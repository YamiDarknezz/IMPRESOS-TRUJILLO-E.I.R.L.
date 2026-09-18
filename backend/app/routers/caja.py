"""Endpoints de cierre y arqueo diario de caja dual (Imprenta / Gigantografías)."""
from datetime import date
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import obtener_sesion
from app.core.fechas import a_fecha_peru, ahora_utc
from app.core.security import personal_venta, supervision, usuario_actual
from app.models import Rol, UnidadNegocio, Usuario
from app.schemas import CerrarCajaData, CongelarCajaData
from app.services import caja_service
from app.services.serializadores import serializar_cierre

router = APIRouter(prefix="/api/caja", tags=["Caja"])

# Roles que pueden consultar la caja de cualquier usuario.
SUPERVISORES = (Rol.ADMIN, Rol.SUBGERENTE)


@router.get("/resumen")
async def resumen_caja(
    usuario: Annotated[Usuario, Depends(usuario_actual)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
    fecha: Optional[date] = Query(default=None, description="Día peruano; por defecto hoy"),
    unidad_negocio: Optional[UnidadNegocio] = None,
    usuario_id: Optional[int] = None,
):
    """Arqueo del día: totales por método, por unidad y por usuario."""
    if usuario.rol not in SUPERVISORES:
        # Un trabajador solo puede consultar su propia caja.
        usuario_id = usuario.id

    return {
        "status": "success",
        "data": await caja_service.resumen_dia(
            sesion,
            fecha or a_fecha_peru(ahora_utc()),
            usuario_id=usuario_id,
            unidad_negocio=unidad_negocio,
        ),
    }


@router.get("")
async def listar_cierres(
    usuario: Annotated[Usuario, Depends(usuario_actual)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
    fecha: Optional[date] = None,
    unidad_negocio: Optional[UnidadNegocio] = None,
):
    cierres = await caja_service.listar_cierres(sesion, fecha, unidad_negocio)
    if usuario.rol not in SUPERVISORES:
        cierres = [cierre for cierre in cierres if cierre.usuario_id == usuario.id]
    return {"status": "success", "data": [serializar_cierre(c) for c in cierres]}


@router.post("/cerrar")
async def cerrar_caja(
    data: CerrarCajaData,
    usuario: Annotated[Usuario, Depends(personal_venta)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    """Registra el arqueo del usuario autenticado para la fecha y unidad."""
    cierre = await caja_service.cerrar_caja(
        sesion, data.fecha, data.unidad_negocio, data.observacion, usuario
    )
    return {"status": "success", "data": serializar_cierre(cierre)}


@router.post("/{cierre_id}/congelar")
async def congelar_caja(
    cierre_id: int,
    data: CongelarCajaData,
    usuario: Annotated[Usuario, Depends(supervision)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    """La Gerencia valida y congela el cierre del día."""
    cierre = await caja_service.congelar_caja(sesion, cierre_id, data.observacion, usuario)
    return {"status": "success", "data": serializar_cierre(cierre)}
