"""Reentrenamiento: fuentes, aislamiento temporal, rechazo y persistencia."""
from datetime import date, datetime, timedelta, timezone
from decimal import Decimal
import json

import joblib

from app.ia import reentrenamiento as ia


def serie_dias(n=90):
    inicio = date(2026, 8, 1)
    return {inicio + timedelta(days=i): [0, 0.0] if (inicio + timedelta(days=i)).weekday() == 6
            else [12 + i % 6, float(100 + (i % 6) * 10)] for i in range(n)}


def test_pedidos_sin_pii_incluye_registrados_y_excluye_dia_incompleto():
    hoy = date(2026, 10, 30)
    filas = [(datetime(2026, 10, 29, 23, tzinfo=timezone.utc), Decimal('25')),
             (datetime(2026, 10, 30, 2, tzinfo=timezone.utc), Decimal('30')),
             (datetime(2026, 10, 30, 10, tzinfo=timezone.utc), Decimal('40'))]
    serie = ia.construir_serie(filas, hoy)
    assert serie == {date(2026, 10, 29): [2, 55.0]}


def test_cobertura_rechaza_corto_y_hueco():
    valido, _ = ia.cobertura(serie_dias(30))
    assert not valido
    serie = serie_dias()
    for d in [date(2026, 9, 7) + timedelta(days=i) for i in range(4)]:
        serie[d] = [0, 0.0]
    valido, motivo = ia.cobertura(serie)
    assert not valido and 'Cuatro días' in motivo


def test_prediccion_no_accede_a_futuros_y_domingo_cero():
    serie = {d: v[0] for d, v in serie_dias().items()}
    inicio = date(2026, 10, 24)
    modelo = ia.entrenar(serie, inicio - timedelta(days=1))
    primera = ia.predecir_bloque(modelo, serie, inicio, date(2026, 10, 29))
    cambiado = {d: (999 if d >= inicio else v) for d, v in serie.items()}
    segunda = ia.predecir_bloque(modelo, cambiado, inicio, date(2026, 10, 29))
    assert primera == segunda
    assert primera[date(2026, 10, 25)] == 0


def test_decision_no_promueve_modelo_que_no_supera_la_base(monkeypatch):
    monkeypatch.setattr(ia, 'evaluar', lambda _: {n: {'modelo': 10, 'base': 8} for n in ia.NOMBRES})
    resultado, modelos = ia.decidir(serie_dias())
    assert resultado['estado'] == 'sin_promocion' and modelos is None


def test_decision_promueve_solo_si_ambos_mejoran(monkeypatch):
    monkeypatch.setattr(ia, 'evaluar', lambda _: {n: {'modelo': 7, 'base': 8} for n in ia.NOMBRES})
    resultado, modelos = ia.decidir(serie_dias())
    assert resultado['estado'] == 'candidato_aprobado'
    assert set(modelos) == set(ia.NOMBRES)


async def test_ejecucion_con_pocos_datos_no_sobrescribe_modelo(tmp_path, monkeypatch, sesion):
    anterior = tmp_path / 'modelo_activo.joblib'
    joblib.dump({'corte': '2026-09-01'}, anterior)
    async def filas():
        return [(datetime(2026, 10, 29, 12, tzinfo=timezone.utc), Decimal('20'))]
    monkeypatch.setattr(ia, 'leer_pedidos', filas)
    monkeypatch.setattr(ia, 'FabricaSesiones', lambda: sesion)
    monkeypatch.setattr(ia, 'ahora_utc', lambda: datetime(2026, 10, 30, 12, tzinfo=timezone.utc))
    resultado = await ia.ejecutar(tmp_path)
    assert resultado['estado'] == 'sin_promocion'
    assert joblib.load(anterior) == {'corte': '2026-09-01'}
    assert (tmp_path / 'ultimo_entrenamiento.json').exists()


def test_artefacto_atomico_y_espera_semana_completa(tmp_path):
    ruta = tmp_path / 'modelo_activo.joblib'
    ia.guardar_atomico(ruta, {'corte': '2026-09-01'}, binario=True)
    assert joblib.load(ruta)['corte'] == '2026-09-01'
    mejora, motivo = ia.supera_modelo_activo(serie_dias(), {}, {'corte': max(serie_dias()).isoformat()})
    assert not mejora and 'semana completa' in motivo


def test_pronostico_rechazado_usa_linea_base_aunque_exista_archivo_antiguo(tmp_path):
    serie = serie_dias()
    joblib.dump({'corte': '2026-08-10'}, tmp_path / 'modelo_activo.joblib')
    pronostico = ia.pronosticar(serie, tmp_path, {'estado': 'sin_promocion'})
    assert pronostico['metodo'] == 'media_7'
    assert len(pronostico['dias']) == 7
    assert pronostico['valor_es_cobro'] is False


async def test_ejecucion_promueve_candidato_y_conserva_archivos(tmp_path, monkeypatch, sesion):
    inicio = date(2026, 8, 1)
    hoy = inicio + timedelta(days=90)
    async def filas():
        return [(datetime.combine(inicio + timedelta(days=i), datetime.min.time(),
                                  tzinfo=timezone.utc) + timedelta(hours=15),
                 Decimal('100'))
                for i in range(90) if (inicio + timedelta(days=i)).weekday() != 6]
    monkeypatch.setattr(ia, 'leer_pedidos', filas)
    monkeypatch.setattr(ia, 'FabricaSesiones', lambda: sesion)
    monkeypatch.setattr(ia, 'ahora_utc', lambda: datetime.combine(
        hoy, datetime.min.time(), tzinfo=timezone.utc) + timedelta(hours=12))
    monkeypatch.setattr(ia, 'evaluar', lambda _: {n: {'modelo': 5, 'base': 8} for n in ia.NOMBRES})
    resultado = await ia.ejecutar(tmp_path)
    assert resultado['estado'] == 'candidato_aprobado'
    activo = joblib.load(tmp_path / 'modelo_activo.joblib')
    assert set(activo['modelos']) == set(ia.NOMBRES)
    assert activo['corte'] == resultado['corte']
    pronostico = json.loads((tmp_path / 'pronostico_actual.json').read_text(encoding='utf-8'))
    assert pronostico['metodo'] == 'modelo'
