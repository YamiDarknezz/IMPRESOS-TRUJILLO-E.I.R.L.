"""Reentrenamiento semanal con evaluación cronológica y promoción conservadora.

El importe es el valor del pedido, NO dinero cobrado. No usa CSV ni PII.
"""
import asyncio
import json
import os
import tempfile
from collections import defaultdict
from datetime import date, datetime, timedelta, timezone
from pathlib import Path
from statistics import mean

import joblib
from sklearn.ensemble import HistGradientBoostingRegressor
from sqlalchemy import select

from app.core.database import FabricaSesiones
from app.core.fechas import a_fecha_peru, ahora_utc
from app.models import Orden, PronosticoIA

MIN_DIAS_ABIERTOS = 60
MIN_MUESTRAS = 28
MARGEN_MEJORA = 0.05
NOMBRES = ("pedidos", "valor_pedidos_pen")


async def leer_pedidos():
    """Solo columnas necesarias; evita cargar clientes y relaciones ORM."""
    async with FabricaSesiones() as sesion:
        consulta = select(Orden.creado_en, Orden.total).order_by(Orden.creado_en)
        return list((await sesion.execute(consulta)).all())


def construir_serie(filas, hoy):
    """Incluye ceros observados desde el primer pedido; omite el día en curso."""
    agregados = defaultdict(lambda: [0, 0.0])
    for creado_en, total in filas:
        dia = a_fecha_peru(creado_en)
        if dia >= hoy:
            continue
        if total is None or float(total) < 0:
            raise ValueError("Monto de pedido inválido")
        agregados[dia][0] += 1
        agregados[dia][1] += float(total)
    if not agregados:
        return {}
    primero = min(agregados)
    return {primero + timedelta(days=i): agregados[primero + timedelta(days=i)]
            for i in range((hoy - primero).days)}


def cobertura(serie):
    habiles = [dia for dia in serie if dia.weekday() != 6]
    sin_pedidos = 0
    for dia in habiles:
        sin_pedidos = sin_pedidos + 1 if serie[dia][0] == 0 else 0
        if sin_pedidos >= 4:
            return False, "Cuatro días hábiles seguidos sin pedidos: verificar cobertura"
    if len(habiles) < MIN_DIAS_ABIERTOS:
        return False, f"Historial insuficiente: {len(habiles)}/{MIN_DIAS_ABIERTOS} días hábiles"
    return True, ""


def rasgos(serie, dia):
    anteriores = [serie[d] for d in sorted(serie) if d < dia and d.weekday() != 6]
    similares = [serie[d] for d in sorted(serie) if d < dia and d.weekday() == dia.weekday()]
    return [*[int(dia.weekday() == i) for i in range(6)], mean(anteriores[-7:]),
            mean(anteriores[-21:]), mean(similares[-4:])]


def entrenar(serie, corte):
    fechas = [d for d in sorted(serie) if d <= corte and d.weekday() != 6]
    muestras = fechas[MIN_MUESTRAS:]
    modelo = HistGradientBoostingRegressor(
        loss="absolute_error", max_iter=60, learning_rate=0.05,
        max_leaf_nodes=4, min_samples_leaf=8, l2_regularization=10.0,
        random_state=42,
    )
    modelo.fit([rasgos(serie, d) for d in muestras], [serie[d] for d in muestras])
    return modelo


def predecir_bloque(modelo, serie, inicio, fin):
    """Predicción recursiva: nunca lee datos reales del bloque evaluado."""
    contexto = {d: valor for d, valor in serie.items() if d < inicio}
    predicciones = {}
    dia = inicio
    while dia <= fin:
        if dia.weekday() == 6:
            valor = 0.0  # Cierre dominical: supuesto a confirmar con el negocio.
        elif modelo is None:
            valor = mean([contexto[d] for d in sorted(contexto) if d.weekday() != 6][-7:])
        else:
            valor = float(modelo.predict([rasgos(contexto, dia)])[0])
        contexto[dia] = predicciones[dia] = max(0.0, valor)
        dia += timedelta(days=1)
    return predicciones


def evaluar(serie):
    """Tres semanas pasadas disjuntas; cada modelo solo ve días anteriores."""
    dias = sorted(serie)
    fin = dias[-1]
    errores = {nombre: {"modelo": [], "base": []} for nombre in NOMBRES}
    for semana in (3, 2, 1):
        inicio = fin - timedelta(days=7 * semana - 1)
        cierre = min(inicio + timedelta(days=6), fin)
        for indice, nombre in enumerate(NOMBRES):
            variable = {d: v[indice] for d, v in serie.items()}
            modelo = entrenar(variable, inicio - timedelta(days=1))
            pronosticos = {metodo: predecir_bloque(m, variable, inicio, cierre)
                           for metodo, m in (("modelo", modelo), ("base", None))}
            for dia in pronosticos["modelo"]:
                if dia.weekday() == 6:
                    continue
                for metodo, valores in pronosticos.items():
                    errores[nombre][metodo].append(abs(valores[dia] - variable[dia]))
    return {nombre: {metodo: round(mean(valores), 4) for metodo, valores in metodos.items()}
            for nombre, metodos in errores.items()}


def decidir(serie):
    valido, motivo = cobertura(serie)
    if not valido:
        return {"estado": "sin_promocion", "motivo": motivo}, None
    metricas = evaluar(serie)
    mejora = all(v["modelo"] <= v["base"] * (1 - MARGEN_MEJORA) for v in metricas.values())
    resultado = {"estado": "candidato_aprobado" if mejora else "sin_promocion",
                 "motivo": "Supera ambas líneas base por al menos 5 %" if mejora
                           else "El modelo no mejora ambas líneas base por al menos 5 %",
                 "metricas_mae": metricas, "dias_evaluados": 18,
                 "corte": max(serie).isoformat(), "dias_abiertos": sum(d.weekday() != 6 for d in serie)}
    if not mejora:
        return resultado, None
    modelos = {nombre: entrenar({d: v[i] for d, v in serie.items()}, max(serie))
               for i, nombre in enumerate(NOMBRES)}
    return resultado, modelos


def supera_modelo_activo(serie, modelos, artefacto):
    """El candidato debe superar también al activo en una semana inédita para éste."""
    corte_anterior = date.fromisoformat(artefacto["corte"])
    fin = max(serie)
    inicio = fin - timedelta(days=6)
    if corte_anterior >= inicio:
        return False, "Esperar una semana completa posterior al modelo activo"
    for indice, nombre in enumerate(NOMBRES):
        variable = {d: v[indice] for d, v in serie.items()}
        candidato = entrenar(variable, inicio - timedelta(days=1))
        nuevo = predecir_bloque(candidato, variable, inicio, fin)
        anterior = predecir_bloque(artefacto["modelos"][nombre], variable, inicio, fin)
        fechas = [d for d in nuevo if d.weekday() != 6]
        mae_nuevo = mean(abs(nuevo[d] - variable[d]) for d in fechas)
        mae_anterior = mean(abs(anterior[d] - variable[d]) for d in fechas)
        if mae_nuevo >= mae_anterior:
            return False, f"El candidato no supera al activo en {nombre}"
    return True, "Supera al modelo activo en ambos objetivos"


def guardar_atomico(ruta, datos, *, binario=False):
    ruta.parent.mkdir(parents=True, exist_ok=True)
    temporal = None
    try:
        with tempfile.NamedTemporaryFile(dir=ruta.parent, prefix=".ia-", delete=False,
                                         mode="wb" if binario else "w", encoding=None if binario else "utf-8") as f:
            temporal = Path(f.name)
            if binario:
                joblib.dump(datos, f)
            else:
                json.dump(datos, f, ensure_ascii=False, indent=2)
                f.write("\n")
            f.flush()
            os.fsync(f.fileno())
        os.replace(temporal, ruta)
    finally:
        if temporal is not None:
            temporal.unlink(missing_ok=True)


def pronosticar(serie, destino, resultado):
    """El consumidor usa la base si el último candidato no fue aprobado."""
    if not serie or sum(d.weekday() != 6 for d in serie) < 7:
        return None
    metodo = "media_7"
    modelos = None
    ruta = destino / "modelo_activo.joblib"
    if resultado["estado"] == "candidato_aprobado" and ruta.exists():
        artefacto = joblib.load(ruta)  # Solo artefactos escritos localmente por el job.
        if artefacto["corte"] == max(serie).isoformat():
            modelos = artefacto["modelos"]
            metodo = "modelo"
    inicio = max(serie) + timedelta(days=1)
    fin = inicio + timedelta(days=6)
    calculos = {}
    for indice, nombre in enumerate(NOMBRES):
        variable = {d: valores[indice] for d, valores in serie.items()}
        calculos[nombre] = predecir_bloque(
            modelos[nombre] if modelos else None, variable, inicio, fin)
    return {"corte": max(serie).isoformat(), "metodo": metodo,
            "supuesto_domingo_cerrado": True,
            "valor_es_cobro": False,
            "dias": [{"fecha": d.isoformat(), "pedidos": round(calculos["pedidos"][d]),
                      "valor_pedidos_pen": round(calculos["valor_pedidos_pen"][d], 2)}
                     for d in sorted(calculos["pedidos"])]}


async def ejecutar(destino):
    destino = Path(destino)
    hoy = a_fecha_peru(ahora_utc())
    serie = construir_serie(await leer_pedidos(), hoy)
    resultado, modelos = decidir(serie) if serie else (
        {"estado": "sin_promocion", "motivo": "No hay pedidos completos"}, None)
    activo = destino / "modelo_activo.joblib"
    if modelos and activo.exists():
        mejora, motivo = supera_modelo_activo(serie, modelos, joblib.load(activo))
        if not mejora:
            resultado.update(estado="sin_promocion", motivo=motivo)
            modelos = None
    resultado.update(ejecutado_en=datetime.now(timezone.utc).isoformat(),
                     origen="ordenes PostgreSQL", pedidos_utilizados=sum(v[0] for v in serie.values()))
    if modelos:
        # Solo reemplaza el modelo activo cuando el candidato supera la base.
        guardar_atomico(activo,
                        {"modelos": modelos, "corte": resultado["corte"],
                         "metricas_mae": resultado["metricas_mae"]}, binario=True)
    guardar_atomico(destino / "ultimo_entrenamiento.json", resultado)
    pronostico = pronosticar(serie, destino, resultado)
    if pronostico:
        guardar_atomico(destino / "pronostico_actual.json", pronostico)
    async with FabricaSesiones() as sesion:
        registro = await sesion.get(PronosticoIA, 1)
        if registro is None:
            registro = PronosticoIA(id=1, resultado=resultado, pronostico=pronostico)
            sesion.add(registro)
        else:
            registro.resultado = resultado
            registro.pronostico = pronostico
        await sesion.commit()
    print(json.dumps(resultado, ensure_ascii=False))
    return resultado


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--destino", default="/var/lib/impresos/ia")
    args = parser.parse_args()
    asyncio.run(ejecutar(args.destino))
