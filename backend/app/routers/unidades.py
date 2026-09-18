"""Endpoints del catálogo de unidades de medida."""
from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auditoria import registrar
from app.core.database import obtener_sesion
from app.core.errores import Conflicto, NoEncontrado
from app.core.security import solo_admin, usuario_actual
from app.models import TipoEventoAuditoria, Unidad, Usuario
from app.schemas import UnidadCreateData, UnidadUpdateData
from app.services.serializadores import serializar_unidad

router = APIRouter(prefix="/api/unidades", tags=["Unidades"])


@router.get("")
async def listar_unidades(
    usuario: Annotated[Usuario, Depends(usuario_actual)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    unidades = (
        await sesion.execute(select(Unidad).order_by(func.lower(Unidad.nombre)))
    ).scalars()
    return {"status": "success", "data": [serializar_unidad(u) for u in unidades]}


@router.post("")
async def crear_unidad(
    data: UnidadCreateData,
    admin: Annotated[Usuario, Depends(solo_admin)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    existente = (
        await sesion.execute(
            select(Unidad).where(func.lower(Unidad.nombre) == data.nombre.lower())
        )
    ).scalar_one_or_none()
    if existente is not None:
        raise Conflicto("Ya existe una unidad con ese nombre.")

    unidad = Unidad(nombre=data.nombre, abreviatura=data.abreviatura)
    sesion.add(unidad)
    await sesion.flush()

    registrar(
        sesion,
        admin.id,
        TipoEventoAuditoria.CREAR,
        tabla_afectada="unidades",
        registro_id=unidad.id,
        detalle=f"Unidad {unidad.nombre}",
    )
    return {"status": "success", "data": serializar_unidad(unidad)}


@router.patch("/{unidad_id}")
async def actualizar_unidad(
    unidad_id: int,
    data: UnidadUpdateData,
    admin: Annotated[Usuario, Depends(solo_admin)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    unidad = await sesion.get(Unidad, unidad_id)
    if unidad is None:
        raise NoEncontrado("Unidad no encontrada.")

    unidad.nombre = data.nombre
    unidad.abreviatura = data.abreviatura
    registrar(
        sesion,
        admin.id,
        TipoEventoAuditoria.EDITAR,
        tabla_afectada="unidades",
        registro_id=unidad.id,
        detalle=f"Unidad {unidad.nombre} actualizada",
    )
    return {"status": "success", "data": serializar_unidad(unidad)}


@router.delete("/{unidad_id}")
async def eliminar_unidad(
    unidad_id: int,
    admin: Annotated[Usuario, Depends(solo_admin)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    """Borrado lógico: los materiales existentes siguen apuntando a la unidad."""
    unidad = await sesion.get(Unidad, unidad_id)
    if unidad is None:
        raise NoEncontrado("Unidad no encontrada.")

    unidad.activo = False
    registrar(
        sesion,
        admin.id,
        TipoEventoAuditoria.ELIMINAR,
        tabla_afectada="unidades",
        registro_id=unidad.id,
        detalle=f"Unidad {unidad.nombre} desactivada",
    )
    return {"status": "success"}
