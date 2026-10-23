"""Inteligencia de negocio: lectura gerencial, sin modificar datos operativos."""
from datetime import date, timedelta
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import obtener_sesion
from app.core.fechas import a_fecha_peru, ahora_utc
from app.core.security import supervision
from app.models import CanalIngreso, UnidadNegocio, Usuario
from app.services import bi_service

router = APIRouter(prefix="/api/bi", tags=["Inteligencia de negocio"])


@router.get("/resumen")
async def resumen_bi(
    usuario: Annotated[Usuario, Depends(supervision)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
    desde: date | None = None,
    hasta: date | None = None,
    unidad_negocio: UnidadNegocio | None = None,
    canal_ingreso: CanalIngreso | None = None,
):
    hoy = a_fecha_peru(ahora_utc())
    fin = hasta or hoy
    inicio = desde or fin - timedelta(days=6)
    return {"status": "success", "data": await bi_service.resumen(
        sesion, inicio, fin, unidad_negocio, canal_ingreso,
    )}
