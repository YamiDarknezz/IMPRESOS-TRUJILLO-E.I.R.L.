"""Pruebas del cierre y arqueo diario de caja dual (RF-12 a RF-14)."""
from datetime import timedelta

import pytest

from app.core.errores import Conflicto, ErrorDeNegocio
from app.core.fechas import a_fecha_peru, ahora_utc, rango_dia_peru_a_utc
from app.models import EstadoCierre, MetodoPago, UnidadNegocio
from app.services import caja_service, ordenes_service
from tests.apoyo import datos_orden


def _mediodia_peru(fecha):
    inicio, fin = rango_dia_peru_a_utc(fecha)
    return inicio + (fin - inicio) / 2


async def _crear_cobro(sesion, admin, material, cliente, **overrides):
    orden = await ordenes_service.crear_orden(
        sesion, datos_orden(material.id, cliente_id=cliente.id, **overrides), admin
    )
    return orden


async def test_resumen_agrupa_por_metodo_y_unidad(sesion, admin, material, cliente):
    await _crear_cobro(
        sesion, admin, material, cliente,
        precio_total=100, adelanto_pago=50, metodo_pago=MetodoPago.EFECTIVO,
        unidad_negocio=UnidadNegocio.IMPRENTA,
    )
    await _crear_cobro(
        sesion, admin, material, cliente,
        precio_total=200, adelanto_pago=100, metodo_pago=MetodoPago.YAPE,
        unidad_negocio=UnidadNegocio.GIGANTOGRAFIAS,
    )

    hoy = a_fecha_peru(ahora_utc())
    resumen = await caja_service.resumen_dia(sesion, hoy)

    assert resumen["total"]["efectivo"] == 50
    assert resumen["total"]["yape"] == 100
    assert resumen["total"]["total"] == 150
    assert resumen["por_unidad_negocio"]["imprenta"]["total"] == 50
    assert resumen["por_unidad_negocio"]["gigantografias"]["total"] == 100
    assert len(resumen["detalle"]) == 2


async def test_pagos_de_otro_dia_no_entran(sesion, admin, material, cliente):
    orden = await _crear_cobro(sesion, admin, material, cliente)
    hoy = a_fecha_peru(ahora_utc())
    orden.pagos[0].fecha = _mediodia_peru(hoy - timedelta(days=1))
    await sesion.flush()

    resumen = await caja_service.resumen_dia(sesion, hoy)
    assert resumen["total"]["total"] == 0


async def test_cerrar_caja_registra_los_montos(sesion, admin, material, cliente):
    await _crear_cobro(
        sesion, admin, material, cliente,
        precio_total=100, adelanto_pago=50, metodo_pago=MetodoPago.EFECTIVO,
    )

    hoy = a_fecha_peru(ahora_utc())
    cierre = await caja_service.cerrar_caja(sesion, hoy, UnidadNegocio.IMPRENTA, "", admin)

    assert cierre.estado == EstadoCierre.CERRADO
    assert float(cierre.monto_efectivo) == 50
    assert float(cierre.total) == 50


async def test_no_se_cierra_dos_veces_la_misma_caja(sesion, admin, material, cliente):
    await _crear_cobro(sesion, admin, material, cliente)
    hoy = a_fecha_peru(ahora_utc())

    await caja_service.cerrar_caja(sesion, hoy, UnidadNegocio.IMPRENTA, "", admin)
    with pytest.raises(Conflicto):
        await caja_service.cerrar_caja(sesion, hoy, UnidadNegocio.IMPRENTA, "", admin)

    # La misma fecha en la otra unidad de negocio sí es un cierre distinto.
    otro = await caja_service.cerrar_caja(sesion, hoy, UnidadNegocio.GIGANTOGRAFIAS, "", admin)
    assert float(otro.total) == 0


async def test_congelar_cierre_y_no_recongelar(sesion, admin, material, cliente):
    await _crear_cobro(sesion, admin, material, cliente)
    hoy = a_fecha_peru(ahora_utc())
    cierre = await caja_service.cerrar_caja(sesion, hoy, UnidadNegocio.IMPRENTA, "", admin)

    congelado = await caja_service.congelar_caja(sesion, cierre.id, "Validado por gerencia", admin)
    assert congelado.estado == EstadoCierre.CONGELADO
    assert congelado.validado_por == admin.id
    assert congelado.validador is admin
    assert "Validado por gerencia" in congelado.observacion

    with pytest.raises(ErrorDeNegocio):
        await caja_service.congelar_caja(sesion, cierre.id, "", admin)


async def test_cada_usuario_liquida_sus_propios_cobros(sesion, admin, operario, material, cliente):
    # El adelanto lo registra el admin; el saldo lo cobra el operario asignado.
    orden = await ordenes_service.crear_orden(
        sesion,
        datos_orden(
            material.id,
            cliente_id=cliente.id,
            precio_total=100,
            adelanto_pago=50,
            metodo_pago=MetodoPago.EFECTIVO,
            asignado_a=operario.id,
        ),
        admin,
    )
    await ordenes_service.confirmar_pago(sesion, orden.id, MetodoPago.YAPE, "", operario)

    hoy = a_fecha_peru(ahora_utc())
    cierre_admin = await caja_service.cerrar_caja(sesion, hoy, UnidadNegocio.IMPRENTA, "", admin)
    cierre_operario = await caja_service.cerrar_caja(sesion, hoy, UnidadNegocio.IMPRENTA, "", operario)

    assert float(cierre_admin.total) == 50
    assert float(cierre_admin.monto_efectivo) == 50
    assert float(cierre_operario.total) == 50
    assert float(cierre_operario.monto_yape) == 50


async def test_observar_pago_deduce_de_caja_y_reabre_deuda(sesion, admin, material, cliente):
    """
    Auditoría al cierre de caja: si se detecta un Yape falso o billete falso,
    el cobro se anula/observa, se deduce del arqueo y se restaura la deuda en la orden.
    """
    from app.models import EstadoPago, MotivoObservacionPago

    orden = await _crear_cobro(
        sesion, admin, material, cliente,
        precio_total=100, adelanto_pago=100, metodo_pago=MetodoPago.YAPE,
    )
    pago = orden.pagos[0]
    assert float(orden.saldo_pendiente) == 0
    assert orden.pagado_totalmente is True

    hoy = a_fecha_peru(ahora_utc())
    resumen_antes = await caja_service.resumen_dia(sesion, hoy)
    assert resumen_antes["total"]["yape"] == 100
    assert len(resumen_antes["observados"]) == 0

    # Observar el pago fraudulento antes de cerrar la caja
    resultado = await caja_service.observar_pago(
        sesion, pago.id, MotivoObservacionPago.YAPE_FALSO, "Captura editada sin abono real", admin
    )
    assert resultado["estado_pago"] == EstadoPago.OBSERVADO.value
    assert resultado["motivo"] == MotivoObservacionPago.YAPE_FALSO.value
    assert float(orden.saldo_pendiente) == 100
    assert orden.pagado_totalmente is False

    # El arqueo del día ya no incluye el pago observado
    resumen_despues = await caja_service.resumen_dia(sesion, hoy)
    assert resumen_despues["total"]["yape"] == 0
    assert resumen_despues["total"]["total"] == 0
    assert resumen_despues["total_observado"] == 100
    assert len(resumen_despues["observados"]) == 1
    assert resumen_despues["observados"][0]["motivo"] == "yape_falso"

    # Al cerrar la caja, el monto recaudado es 0
    cierre = await caja_service.cerrar_caja(sesion, hoy, UnidadNegocio.IMPRENTA, "", admin)
    assert float(cierre.total) == 0

    # Intentar observar un pago ya observado falla
    with pytest.raises(ErrorDeNegocio):
        await caja_service.observar_pago(
            sesion, pago.id, MotivoObservacionPago.BILLETE_FALSO, "Duplicado", admin
        )


async def test_no_se_observa_un_pago_de_un_cierre_ya_congelado(sesion, admin, material, cliente):
    """
    El cierre congelado es el documento de control de gerencia: si los pagos
    del día siguen siendo observables después, el arqueo deja de valer como
    evidencia (issue relacionado: #19).
    """
    from app.models import MotivoObservacionPago

    orden = await _crear_cobro(
        sesion, admin, material, cliente,
        precio_total=100, adelanto_pago=100, metodo_pago=MetodoPago.EFECTIVO,
    )
    pago = orden.pagos[0]

    hoy = a_fecha_peru(ahora_utc())
    cierre = await caja_service.cerrar_caja(sesion, hoy, UnidadNegocio.IMPRENTA, "", admin)
    await caja_service.congelar_caja(sesion, cierre.id, "Validado", admin)

    with pytest.raises(ErrorDeNegocio, match="congelado"):
        await caja_service.observar_pago(
            sesion, pago.id, MotivoObservacionPago.YAPE_FALSO, "Tarde para esto", admin
        )


async def test_no_se_observa_un_pago_de_una_orden_entregada(sesion, admin, material, cliente):
    """Issue #20: la entrega es definitiva para el resto del sistema; reabrir
    la deuda de una orden ya entregada necesita una decisión explícita, no
    silenciosa."""
    from app.models import EstadoOrden, MotivoObservacionPago
    from app.schemas import MaterialEstimado

    orden = await _crear_cobro(
        sesion, admin, material, cliente,
        precio_total=100, adelanto_pago=100, metodo_pago=MetodoPago.EFECTIVO,
    )
    pago = orden.pagos[0]
    await ordenes_service.completar(
        sesion, orden.id, [MaterialEstimado(material_id=material.id, cantidad=2)], admin
    )
    await ordenes_service.cambiar_estado(sesion, orden.id, EstadoOrden.ENTREGADA, admin)

    with pytest.raises(ErrorDeNegocio, match="entregada"):
        await caja_service.observar_pago(
            sesion, pago.id, MotivoObservacionPago.YAPE_FALSO, "Tarde", admin
        )


async def test_observar_pago_recalcula_el_adelanto_de_la_orden(sesion, admin, material, cliente):
    """Issue #20: `orden.adelanto` (lo que se imprime en el contrato) debe
    dejar de contar un adelanto que ya se observó como fraudulento."""
    orden = await _crear_cobro(
        sesion, admin, material, cliente, precio_total=100, adelanto_pago=50,
    )
    assert float(orden.adelanto) == 50

    from app.models import MotivoObservacionPago
    await caja_service.observar_pago(
        sesion, orden.pagos[0].id, MotivoObservacionPago.YAPE_FALSO, "Falso", admin
    )

    assert float(orden.adelanto) == 0


async def test_editar_orden_no_revive_un_pago_observado(sesion, admin, material, cliente):
    """
    Issue #15: reproduce el escenario exacto del issue — observar un pago y
    luego editar la orden (o confirmar otro pago) no debe volver a contarlo
    como dinero recibido.
    """
    from app.models import MotivoObservacionPago

    orden = await _crear_cobro(
        sesion, admin, material, cliente, precio_total=100, adelanto_pago=50,
    )
    await caja_service.observar_pago(
        sesion, orden.pagos[0].id, MotivoObservacionPago.YAPE_FALSO, "Falso", admin
    )
    assert float(orden.saldo_pendiente) == 100
    assert orden.pagado_totalmente is False

    await ordenes_service.actualizar(
        sesion, orden.id, datos_orden(material.id, cliente_id=cliente.id, precio_total=100, adelanto_pago=50), admin
    )

    assert float(orden.saldo_pendiente) == 100
    assert orden.pagado_totalmente is False


async def test_pagos_de_orden_cancelada_no_entran_al_arqueo(sesion, admin, material, cliente):
    """Issue #18: Finanzas ya excluye las órdenes canceladas; Caja no puede
    seguir mostrando ese cobro como efectivo del día."""
    orden = await _crear_cobro(
        sesion, admin, material, cliente, precio_total=100, adelanto_pago=50,
    )
    await ordenes_service.cancelar(sesion, orden.id, admin)

    hoy = a_fecha_peru(ahora_utc())
    resumen = await caja_service.resumen_dia(sesion, hoy)

    assert resumen["total"]["total"] == 0
    assert resumen["detalle"] == []


async def test_editar_adelanto_bloqueado_si_el_cierre_ya_esta_congelado(
    sesion, admin, material, cliente
):
    """Issue #19: si el pago de un día ya quedó dentro de un cierre
    congelado, cambiar su monto por una edición de la orden dejaría el
    arqueo desincronizado sin ningún aviso."""
    orden = await _crear_cobro(
        sesion, admin, material, cliente, precio_total=100, adelanto_pago=50,
    )
    hoy = a_fecha_peru(ahora_utc())
    cierre = await caja_service.cerrar_caja(sesion, hoy, UnidadNegocio.IMPRENTA, "", admin)
    await caja_service.congelar_caja(sesion, cierre.id, "Validado", admin)

    with pytest.raises(ErrorDeNegocio, match="congelado"):
        await ordenes_service.actualizar(
            sesion, orden.id,
            datos_orden(material.id, cliente_id=cliente.id, precio_total=100, adelanto_pago=80),
            admin,
        )


async def test_confirmar_pago_admite_un_abono_parcial(sesion, admin, material, cliente):
    """Issue #13: el backend ya podía guardar pagos arbitrarios; el límite
    era que `confirmar_pago` siempre cobraba el saldo completo."""
    orden = await _crear_cobro(
        sesion, admin, material, cliente, precio_total=100, adelanto_pago=50,
    )
    assert float(orden.saldo_pendiente) == 50

    await ordenes_service.confirmar_pago(
        sesion, orden.id, MetodoPago.EFECTIVO, "", admin, monto=20
    )

    assert float(orden.saldo_pendiente) == 30
    assert orden.pagado_totalmente is False
    assert len(orden.pagos) == 2

    await ordenes_service.confirmar_pago(
        sesion, orden.id, MetodoPago.EFECTIVO, "", admin, monto=30
    )
    assert float(orden.saldo_pendiente) == 0
    assert orden.pagado_totalmente is True


async def test_confirmar_pago_rechaza_un_monto_mayor_al_saldo(sesion, admin, material, cliente):
    orden = await _crear_cobro(
        sesion, admin, material, cliente, precio_total=100, adelanto_pago=50,
    )
    with pytest.raises(ErrorDeNegocio, match="saldo"):
        await ordenes_service.confirmar_pago(
            sesion, orden.id, MetodoPago.EFECTIVO, "", admin, monto=9999
        )
