"""Endpoint del registro de auditoría (solo lectura, solo administradores)."""
from datetime import date
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import obtener_sesion
from app.core.fechas import rango_dia_peru_a_utc
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
    offset: int = Query(default=0, ge=0),
    accion: Optional[TipoEventoAuditoria] = None,
    usuario_id: Optional[int] = None,
    desde: Optional[date] = None,
    hasta: Optional[date] = None,
):
    """
    Entradas de auditoría, de la más reciente a la más antigua.

    Devuelve el `total` que cumple los filtros además del bloque pedido: la
    pantalla necesita saber cuántos registros hay para no mostrar un historial
    recortado como si estuviera completo (#28).

    Las fechas son días peruanos: la tabla guarda en UTC, así que un rango del
    1 al 2 de octubre abarca esos dos días en hora de Perú.
    """
    filtros = []
    if accion is not None:
        filtros.append(Auditoria.accion == accion)
    if usuario_id is not None:
        filtros.append(Auditoria.usuario_id == usuario_id)
    if desde is not None:
        filtros.append(Auditoria.fecha >= rango_dia_peru_a_utc(desde)[0])
    if hasta is not None:
        filtros.append(Auditoria.fecha < rango_dia_peru_a_utc(hasta)[1])

    consulta = select(Auditoria)
    if filtros:
        consulta = consulta.where(*filtros)
    entradas = (
        await sesion.execute(consulta.order_by(Auditoria.fecha.desc()).limit(limit).offset(offset))
    ).scalars()

    cuenta = select(func.count()).select_from(Auditoria)
    if filtros:
        cuenta = cuenta.where(*filtros)
    total = int((await sesion.execute(cuenta)).scalar_one())

    return {
        "status": "success",
        "data": [serializar_auditoria(e) for e in entradas],
        "total": total,
    }
