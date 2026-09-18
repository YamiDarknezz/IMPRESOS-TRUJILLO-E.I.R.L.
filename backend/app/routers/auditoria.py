"""Endpoint del registro de auditoría (solo lectura, solo administradores)."""
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import obtener_sesion
from app.core.security import solo_admin
from app.models import Auditoria, TipoEventoAuditoria, Usuario
from app.services.serializadores import serializar_auditoria

router = APIRouter(prefix="/api/auditoria", tags=["Auditoría"])

LIMITE_POR_DEFECTO = 100
LIMITE_MAXIMO = 500


@router.get("")
async def listar_auditoria(
    admin: Annotated[Usuario, Depends(solo_admin)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
    limit: int = Query(default=LIMITE_POR_DEFECTO, le=LIMITE_MAXIMO),
    accion: Optional[TipoEventoAuditoria] = None,
):
    consulta = select(Auditoria).order_by(Auditoria.fecha.desc()).limit(limit)
    if accion is not None:
        consulta = consulta.where(Auditoria.accion == accion)

    entradas = (await sesion.execute(consulta)).scalars()
    return {"status": "success", "data": [serializar_auditoria(e) for e in entradas]}
