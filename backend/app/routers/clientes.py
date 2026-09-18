"""Endpoints de clientes."""
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auditoria import registrar
from app.core.database import obtener_sesion
from app.core.errores import NoEncontrado
from app.core.security import gestion_ordenes, usuario_actual
from app.models import Cliente, TipoEventoAuditoria, Usuario
from app.schemas import ClienteCreateData, ClienteUpdateData
from app.services import ordenes_service
from app.services.serializadores import serializar_cliente

router = APIRouter(prefix="/api/clientes", tags=["Clientes"])


@router.get("")
async def listar_clientes(
    usuario: Annotated[Usuario, Depends(usuario_actual)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
    q: Optional[str] = Query(default=None, description="Búsqueda por nombre o documento"),
    incluir_inactivos: bool = False,
):
    consulta = select(Cliente).order_by(func.lower(Cliente.nombre))
    if not incluir_inactivos:
        consulta = consulta.where(Cliente.activo.is_(True))
    if q:
        patron = f"%{q.strip()}%"
        consulta = consulta.where(
            Cliente.nombre.ilike(patron) | Cliente.documento.ilike(patron)
        )
    clientes = (await sesion.execute(consulta)).scalars()
    return {"status": "success", "data": [serializar_cliente(c) for c in clientes]}


@router.get("/{cliente_id}")
async def obtener_cliente(
    cliente_id: int,
    usuario: Annotated[Usuario, Depends(usuario_actual)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    cliente = await sesion.get(Cliente, cliente_id)
    if cliente is None:
        raise NoEncontrado("Cliente no encontrado.")
    return {"status": "success", "data": serializar_cliente(cliente)}


@router.get("/{cliente_id}/resumen")
async def resumen_cliente(
    cliente_id: int,
    usuario: Annotated[Usuario, Depends(usuario_actual)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    """Ficha del cliente: historial de órdenes, facturado y por cobrar."""
    return {
        "status": "success",
        "data": await ordenes_service.resumen_cliente(sesion, cliente_id),
    }


@router.post("")
async def crear_cliente(
    data: ClienteCreateData,
    usuario: Annotated[Usuario, Depends(gestion_ordenes)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    cliente = Cliente(**data.model_dump())
    sesion.add(cliente)
    await sesion.flush()

    registrar(
        sesion,
        usuario.id,
        TipoEventoAuditoria.CREAR,
        tabla_afectada="clientes",
        registro_id=cliente.id,
        detalle=f"Cliente {cliente.nombre}",
        valores_nuevos={"nombre": cliente.nombre, "documento": cliente.documento},
    )
    return {"status": "success", "data": serializar_cliente(cliente)}


@router.patch("/{cliente_id}")
async def actualizar_cliente(
    cliente_id: int,
    data: ClienteUpdateData,
    usuario: Annotated[Usuario, Depends(gestion_ordenes)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    cliente = await sesion.get(Cliente, cliente_id)
    if cliente is None:
        raise NoEncontrado("Cliente no encontrado.")

    anteriores = {"nombre": cliente.nombre, "telefono": cliente.telefono}
    for campo, valor in data.model_dump().items():
        setattr(cliente, campo, valor)

    registrar(
        sesion,
        usuario.id,
        TipoEventoAuditoria.EDITAR,
        tabla_afectada="clientes",
        registro_id=cliente.id,
        detalle=f"Cliente {cliente.nombre} actualizado",
        valores_anteriores=anteriores,
        valores_nuevos={"nombre": cliente.nombre, "telefono": cliente.telefono},
    )
    return {"status": "success", "data": serializar_cliente(cliente)}


@router.delete("/{cliente_id}")
async def eliminar_cliente(
    cliente_id: int,
    usuario: Annotated[Usuario, Depends(gestion_ordenes)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    """Borrado lógico: no se elimina un cliente con historial de órdenes."""
    cliente = await sesion.get(Cliente, cliente_id)
    if cliente is None:
        raise NoEncontrado("Cliente no encontrado.")

    cliente.activo = False
    registrar(
        sesion,
        usuario.id,
        TipoEventoAuditoria.ELIMINAR,
        tabla_afectada="clientes",
        registro_id=cliente.id,
        detalle=f"Cliente {cliente.nombre} desactivado",
    )
    return {"status": "success"}
