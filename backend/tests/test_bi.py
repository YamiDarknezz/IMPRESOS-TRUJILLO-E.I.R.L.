"""Métricas BI: separación flujo/stock, fecha peruana y calidad financiera."""
from datetime import date, datetime, timezone
from decimal import Decimal

import pytest

from app.models import (
    CanalIngreso, EstadoOrden, EstadoPago, MetodoPago, Orden, PagoOrden, Rol,
    TipoPago, UnidadNegocio, Usuario,
)
from app.services import bi_service
from tests.apoyo import cabecera_token


def utc(dia, hora=12):
    return datetime(2026, 10, dia, hora, tzinfo=timezone.utc)


@pytest.fixture(autouse=True)
def reloj(monkeypatch):
    monkeypatch.setattr(bi_service, "ahora_utc", lambda: utc(22, 20))


async def orden(sesion, cliente, admin, **valores):
    datos = dict(cliente_id=cliente.id, creado_por=admin.id, descripcion="Orden BI",
                 fecha_entrega=date(2026, 10, 20), creado_en=utc(20),
                 total=100, saldo_pendiente=100, pagado_totalmente=False)
    datos.update(valores)
    o = Orden(**datos)
    sesion.add(o)
    await sesion.flush()
    return o


async def pago(sesion, o, monto, fecha, estado=EstadoPago.CONFORME, metodo=MetodoPago.EFECTIVO):
    sesion.add(PagoOrden(orden_id=o.id, monto=monto, fecha=fecha,
                         metodo=metodo, tipo=TipoPago.SALDO, estado_pago=estado))
    await sesion.flush()


async def test_flujos_por_evento_y_saldo_sin_filtro_de_fechas(sesion, cliente, admin):
    antigua = await orden(sesion, cliente, admin, creado_en=utc(5), saldo_pendiente=40)
    nueva = await orden(sesion, cliente, admin, saldo_pendiente=50)
    cancelada = await orden(sesion, cliente, admin, estado=EstadoOrden.CANCELADA, total=500)
    await pago(sesion, antigua, 60, utc(20))
    await pago(sesion, nueva, 50, utc(20))
    await pago(sesion, nueva, 25, utc(20), EstadoPago.OBSERVADO)
    await pago(sesion, cancelada, 80, utc(20))
    d = await bi_service.resumen(sesion, date(2026, 10, 20), date(2026, 10, 20))
    assert d["indicadores"]["valor_ordenes"] == 100
    assert d["indicadores"]["cobros"] == 110
    assert d["cobranza"]["saldo_actual"] == 90
    assert d["calidad"]["pagos_en_canceladas"] == 80
    assert d["calidad"]["ordenes_descuadradas"] == 0
    assert d["serie_diaria"] == [{"fecha": "2026-10-20", "ventas": 100, "cobros": 110}]


async def test_corte_peru_y_dias_sin_actividad(sesion, cliente, admin):
    # 04:00 UTC del 21 sigue siendo 20 de octubre en Perú.
    o = await orden(sesion, cliente, admin, creado_en=utc(21, 4), saldo_pendiente=0)
    await pago(sesion, o, 100, utc(21, 4), metodo=MetodoPago.YAPE_ANGEL)
    await orden(sesion, cliente, admin, creado_en=utc(21, 5), total=30)
    d = await bi_service.resumen(sesion, date(2026, 10, 19), date(2026, 10, 20))
    assert d["indicadores"]["ordenes"] == 1
    assert d["serie_diaria"][0] == {"fecha": "2026-10-19", "ventas": 0, "cobros": 0}
    assert d["serie_diaria"][1]["cobros"] == 100
    assert d["cobros_por_metodo"] == [{"metodo": "yape_angel", "monto": 100}]


async def test_operacion_cubre_cohortes_anteriores_y_distingue_listo_de_entregado(sesion, cliente, admin):
    await orden(sesion, cliente, admin, creado_en=utc(5), estado=EstadoOrden.FINALIZADA,
                saldo_pendiente=0, pagado_totalmente=True, finalizada_en=utc(6))
    await orden(sesion, cliente, admin, estado=EstadoOrden.FINALIZADA, saldo_pendiente=70,
                fecha_entrega=date(2026, 10, 10), finalizada_en=utc(21))
    await orden(sesion, cliente, admin, estado=EstadoOrden.ENTREGADA, saldo_pendiente=20,
                entrega_autorizada_por=admin.id)
    await orden(sesion, cliente, admin, estado=EstadoOrden.CANCELADA)
    d = await bi_service.resumen(sesion, date(2026, 10, 20), date(2026, 10, 21))
    assert d["operacion"]["listas_pagadas"] == 1
    assert d["operacion"]["listas_con_deuda"] == 1
    assert d["operacion"]["fecha_vencida"] == 2
    assert d["operacion"]["sin_asignar"] == 3
    assert d["operacion"]["finalizadas_con_fecha"] == 1
    assert d["operacion"]["horas_hasta_finalizar"] == 24
    assert d["cobranza"]["entregado_autorizado_con_deuda"] == 20
    assert d["cobranza"]["vencida_por_entrega"]["d8_30"] == 70


async def test_filtros_linea_canal_y_recorrencia(sesion, cliente, admin):
    for _ in range(2):
        await orden(sesion, cliente, admin, canal_ingreso=CanalIngreso.WHATSAPP,
                    unidad_negocio=UnidadNegocio.GIGANTOGRAFIAS)
    await orden(sesion, cliente, admin, canal_ingreso=CanalIngreso.PRESENCIAL)
    d = await bi_service.resumen(sesion, date(2026, 10, 20), date(2026, 10, 20),
                                UnidadNegocio.GIGANTOGRAFIAS, CanalIngreso.WHATSAPP)
    assert d["indicadores"]["ordenes"] == 2
    assert d["cobranza"]["saldo_actual"] == 200
    assert d["clientes"]["recurrentes"] == 1
    assert d["clientes"]["ventas_recurrentes"] == 200
    assert d["operacion"]["ordenes"] == 2


async def test_comparacion_sin_base_y_diferencia_no_se_corrigen(sesion, cliente, admin):
    o = await orden(sesion, cliente, admin, total=75, saldo_pendiente=0)
    await pago(sesion, o, 100, utc(20))
    d = await bi_service.resumen(sesion, date(2026, 10, 20), date(2026, 10, 21))
    assert d["comparacion"]["disponible"] is False
    assert d["calidad"]["ids_descuadradas"] == [o.id]
    assert d["indicadores"]["cobros"] == 100
    assert o.total == Decimal("75")
    assert o.saldo_pendiente == 0
    await orden(sesion, cliente, admin, creado_en=utc(5))
    d = await bi_service.resumen(sesion, date(2026, 10, 20), date(2026, 10, 21))
    assert d["comparacion"]["disponible"] is True
    d = await bi_service.resumen(sesion, date(2026, 10, 20), date(2026, 10, 22))
    assert d["comparacion"]["disponible"] is False  # hoy parcial


async def test_bi_vacio_no_inventa_porcentajes(sesion):
    d = await bi_service.resumen(sesion, date(2026, 10, 20), date(2026, 10, 21))
    assert d["indicadores"]["porcentaje_liquidadas"] is None
    assert d["indicadores"]["ticket_promedio"] == 0
    assert d["operacion"]["horas_hasta_finalizar"] is None
    assert d["clientes"]["recurrentes"] == 0
    assert d["cobranza"]["saldo_actual"] == 0


async def test_api_bi_solo_supervision_y_validacion(cliente_api, sesion, admin, operario):
    url = "/api/bi/resumen?desde=2026-10-20&hasta=2026-10-21"
    for rol in (Rol.SECRETARIA, Rol.DISENADORA):
        u = Usuario(nombre="Prueba", email=f"{rol}@test.pe", password_hash="x", rol=rol)
        sesion.add(u)
        await sesion.flush()
        assert (await cliente_api.get(url, headers=cabecera_token(u))).status_code == 403
    assert (await cliente_api.get(url, headers=cabecera_token(operario))).status_code == 403
    assert (await cliente_api.get(url)).status_code == 401
    assert (await cliente_api.get(url, headers=cabecera_token(admin))).status_code == 200
    sub = Usuario(nombre="Sub", email="sub-bi@test.pe", password_hash="x", rol=Rol.SUBGERENTE)
    sesion.add(sub)
    await sesion.flush()
    assert (await cliente_api.get(url, headers=cabecera_token(sub))).status_code == 200
    for query in ("desde=no-es-fecha", "desde=2026-10-21&hasta=2026-10-20",
                  "desde=2024-01-01&hasta=2026-10-20", "hasta=2099-01-01",
                  "unidad_negocio=inexistente", "canal_ingreso=inexistente"):
        respuesta = await cliente_api.get(f"/api/bi/resumen?{query}", headers=cabecera_token(admin))
        assert respuesta.status_code in (400, 422)
