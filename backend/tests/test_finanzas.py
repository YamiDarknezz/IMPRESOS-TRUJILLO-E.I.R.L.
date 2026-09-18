"""Pruebas del resumen financiero: contratos vs ingresos y desglose por unidad.

La decisión D5 del negocio se verifica aquí: lo vendido se mide por la fecha
de creación de la orden y lo cobrado por la fecha real de cada pago.
"""
from datetime import timedelta

from app.core.fechas import a_fecha_peru, ahora_utc, rango_dia_peru_a_utc
from app.models import MetodoPago, UnidadNegocio
from app.services import finanzas_service, ordenes_service
from tests.apoyo import datos_orden


def _mediodia_peru(fecha):
    """Momento del mediodía peruano de una fecha, en UTC (evita bordes de zona)."""
    inicio, fin = rango_dia_peru_a_utc(fecha)
    return inicio + (fin - inicio) / 2


async def test_contratos_por_creacion_e_ingresos_por_pago(sesion, admin, material, cliente):
    orden = await ordenes_service.crear_orden(
        sesion, datos_orden(material.id, cliente_id=cliente.id), admin
    )

    hoy = a_fecha_peru(ahora_utc())
    ayer = hoy - timedelta(days=1)
    # La orden se creó ayer; el pago se quedó registrado hoy.
    orden.creado_en = _mediodia_peru(ayer)
    await sesion.flush()

    resumen_hoy = await finanzas_service.resumen(sesion, admin, desde=hoy, hasta=hoy)
    assert resumen_hoy["total_contratos"] == 0
    assert resumen_hoy["total_ingresos"] == 50

    resumen_ayer = await finanzas_service.resumen(sesion, admin, desde=ayer, hasta=ayer)
    assert resumen_ayer["total_contratos"] == 100
    assert resumen_ayer["total_ingresos"] == 0
    assert resumen_ayer["total_adelantos"] == 0


async def test_desglose_por_unidad_de_negocio(sesion, admin, material, cliente):
    await ordenes_service.crear_orden(
        sesion,
        datos_orden(
            material.id,
            cliente_id=cliente.id,
            precio_total=100,
            adelanto_pago=50,
            unidad_negocio=UnidadNegocio.IMPRENTA,
        ),
        admin,
    )
    await ordenes_service.crear_orden(
        sesion,
        datos_orden(
            material.id,
            cliente_id=cliente.id,
            precio_total=200,
            adelanto_pago=100,
            metodo_pago=MetodoPago.YAPE,
            unidad_negocio=UnidadNegocio.GIGANTOGRAFIAS,
        ),
        admin,
    )

    hoy = a_fecha_peru(ahora_utc())
    resumen = await finanzas_service.resumen(sesion, admin, desde=hoy, hasta=hoy)

    assert resumen["total_contratos"] == 300
    assert resumen["total_ingresos"] == 150
    assert resumen["por_metodo"] == {"efectivo": 50, "yape": 100}
    assert resumen["por_unidad_negocio"]["imprenta"]["contratos"] == 100
    assert resumen["por_unidad_negocio"]["imprenta"]["ingresos"] == 50
    assert resumen["por_unidad_negocio"]["gigantografias"]["contratos"] == 200
    assert resumen["por_unidad_negocio"]["gigantografias"]["ingresos"] == 100


async def test_orden_cancelada_no_cuenta(sesion, admin, material, cliente):
    orden = await ordenes_service.crear_orden(
        sesion, datos_orden(material.id, cliente_id=cliente.id), admin
    )
    await ordenes_service.cancelar(sesion, orden.id, admin)

    hoy = a_fecha_peru(ahora_utc())
    resumen = await finanzas_service.resumen(sesion, admin, desde=hoy, hasta=hoy)

    assert resumen["total_contratos"] == 0
    assert resumen["total_ingresos"] == 0
    assert resumen["total_por_cobrar"] == 0


async def test_trabajador_solo_ve_sus_ordenes(sesion, admin, operario, material, cliente):
    # El filtro por trabajador se fuerza en el servidor, no lo decide el cliente.
    await ordenes_service.crear_orden(
        sesion,
        datos_orden(material.id, cliente_id=cliente.id, precio_total=100, asignado_a=operario.id),
        admin,
    )
    await ordenes_service.crear_orden(
        sesion,
        datos_orden(
            material.id,
            cliente_id=cliente.id,
            precio_total=300,
            adelanto_pago=150,
        ),
        admin,
    )

    hoy = a_fecha_peru(ahora_utc())
    resumen = await finanzas_service.resumen(sesion, operario, desde=hoy, hasta=hoy)

    assert resumen["es_supervisor"] is False
    assert resumen["total_contratos"] == 100
    assert resumen["total_ordenes"] == 1
    assert len(resumen["por_trabajador"]) == 1
