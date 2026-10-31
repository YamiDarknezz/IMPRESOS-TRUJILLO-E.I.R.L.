"""API IA: privilegios, ausencia de modelo y pronóstico vigente."""
from datetime import date, datetime, timezone

import pytest

from app.models import Orden, PronosticoIA
from app.routers import ia as router_ia
from tests.apoyo import cabecera_token


@pytest.fixture(autouse=True)
def reloj(monkeypatch):
    monkeypatch.setattr(router_ia, "ahora_utc", lambda: datetime(2026, 11, 2, 16, tzinfo=timezone.utc))


async def test_pronostico_requiere_supervision(cliente_api, operario):
    sin_sesion = await cliente_api.get('/api/ia/pronostico')
    assert sin_sesion.status_code == 401
    no_autorizado = await cliente_api.get('/api/ia/pronostico', headers=cabecera_token(operario))
    assert no_autorizado.status_code == 403


async def test_pronostico_inicial_no_inventa_resultados(cliente_api, admin):
    respuesta = await cliente_api.get('/api/ia/pronostico', headers=cabecera_token(admin))
    assert respuesta.status_code == 200
    assert respuesta.json()['data']['disponible'] is False
    assert respuesta.json()['data']['pronostico'] is None


async def test_pronostico_vigente_sirve_resultado_sin_recalcular(cliente_api, sesion, admin, monkeypatch):
    esperado = {'corte': '2026-11-01', 'metodo': 'media_7', 'dias': []}
    sesion.add(PronosticoIA(id=1, resultado={'estado': 'sin_promocion'}, pronostico=esperado))
    await sesion.flush()
    respuesta = await cliente_api.get('/api/ia/pronostico', headers=cabecera_token(admin))
    assert respuesta.status_code == 200
    assert respuesta.json()['data']['pronostico'] == esperado


async def test_pronostico_caducado_no_se_presenta_como_actual(cliente_api, sesion, admin):
    sesion.add(PronosticoIA(id=1, resultado={'estado': 'candidato_aprobado'},
                           pronostico={'corte': '2026-10-30', 'metodo': 'modelo', 'dias': []}))
    await sesion.flush()
    respuesta = await cliente_api.get('/api/ia/pronostico', headers=cabecera_token(admin))
    assert respuesta.status_code == 200
    assert respuesta.json()['data']['disponible'] is False


async def test_pronostico_de_respaldo_usa_datos_reales(cliente_api, sesion, admin, cliente):
    for i in range(9):
        dia = date(2026, 10, 24).toordinal() + i
        fecha = date.fromordinal(dia)
        if fecha.weekday() == 6:
            continue
        sesion.add(Orden(cliente_id=cliente.id, creado_por=admin.id, descripcion='Pedido',
                         fecha_entrega=fecha, creado_en=datetime(fecha.year, fecha.month, fecha.day,
                                                                16, tzinfo=timezone.utc), total=30))
    await sesion.flush()
    respuesta = await cliente_api.get('/api/ia/pronostico', headers=cabecera_token(admin))
    assert respuesta.status_code == 200
    datos = respuesta.json()['data']
    assert datos['disponible'] is True
    assert datos['pronostico']['metodo'] == 'media_7'
    assert len(datos['pronostico']['dias']) == 7
