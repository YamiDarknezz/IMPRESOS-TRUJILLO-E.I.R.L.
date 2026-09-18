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
