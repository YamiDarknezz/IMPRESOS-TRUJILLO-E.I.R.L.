"""Pronóstico consultivo; el HTTP nunca inicia entrenamiento."""
from datetime import timedelta
from pathlib import Path
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import obtener_sesion
from app.core.fechas import a_fecha_peru, ahora_utc
from app.core.security import supervision
from app.ia.reentrenamiento import construir_serie, pronosticar
from app.models import Orden, PronosticoIA, Usuario

router = APIRouter(prefix="/api/ia", tags=["Pronóstico de pedidos"])


@router.get("/pronostico")
async def obtener_pronostico(
    usuario: Annotated[Usuario, Depends(supervision)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    hoy = a_fecha_peru(ahora_utc())
    registro = await sesion.get(PronosticoIA, 1)
    ultimo_dia = (hoy - timedelta(days=1)).isoformat()
    if registro and registro.pronostico and registro.pronostico["corte"] == ultimo_dia:
        return {"status": "success", "data": {"disponible": True,
                "evaluacion": registro.resultado, "pronostico": registro.pronostico}}

    # Si el job aún no corrió o su corte envejeció, mostrar base actualizada.
    # Nunca presentar una predicción antigua como si correspondiera a hoy.
    filas = (await sesion.execute(select(Orden.creado_en, Orden.total))).all()
    serie = construir_serie(filas, hoy)
    respaldo = pronosticar(serie, Path("."), {"estado": "sin_promocion"})
    return {"status": "success", "data": {
        "disponible": respaldo is not None,
        "evaluacion": registro.resultado if registro else None,
        "pronostico": respaldo,
        "aviso": "Sin suficientes pedidos completos para pronosticar." if respaldo is None
                 else "Estimación provisional (media móvil); el entrenamiento semanal aún no cubre este corte.",
    }}
