"""Endpoints del catálogo de productos y servicios."""
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auditoria import registrar
from app.core.database import obtener_sesion
from app.core.errores import Conflicto, NoEncontrado
from app.core.security import solo_admin, usuario_actual
from app.models import (
    Material,
    Producto,
    ProductoMaterial,
    TipoEventoAuditoria,
    TipoProducto,
    Usuario,
)
from app.schemas import ProductoCreateData, ProductoUpdateData
from app.services.serializadores import serializar_producto

router = APIRouter(prefix="/api/productos", tags=["Productos"])


async def _reemplazar_receta(
    sesion: AsyncSession, producto: Producto, data: ProductoCreateData
) -> None:
    producto.receta.clear()
    for linea in data.receta:
        material = await sesion.get(Material, linea.material_id)
        if material is None:
            raise NoEncontrado(f"El material {linea.material_id} no existe.")
        producto.receta.append(
            ProductoMaterial(material_id=linea.material_id, cantidad=linea.cantidad)
        )


@router.get("")
async def listar_productos(
    usuario: Annotated[Usuario, Depends(usuario_actual)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
    tipo: Optional[TipoProducto] = Query(default=None),
    solo_activos: bool = True,
):
    consulta = select(Producto).order_by(func.lower(Producto.nombre))
    if tipo is not None:
        consulta = consulta.where(Producto.tipo == tipo)
    if solo_activos:
        consulta = consulta.where(Producto.activo.is_(True))
    productos = (await sesion.execute(consulta)).scalars()
    return {"status": "success", "data": [serializar_producto(p) for p in productos]}


@router.get("/{producto_id}")
async def obtener_producto(
    producto_id: int,
    usuario: Annotated[Usuario, Depends(usuario_actual)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    producto = await sesion.get(Producto, producto_id)
    if producto is None:
        raise NoEncontrado("Producto no encontrado.")
    return {"status": "success", "data": serializar_producto(producto)}


@router.post("")
async def crear_producto(
    data: ProductoCreateData,
    admin: Annotated[Usuario, Depends(solo_admin)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    existente = (
        await sesion.execute(
            select(Producto).where(func.lower(Producto.nombre) == data.nombre.lower())
        )
    ).scalar_one_or_none()
    if existente is not None:
        raise Conflicto("Ya existe un producto con ese nombre.")

    producto = Producto(
        nombre=data.nombre,
        tipo=data.tipo,
        precio_base=data.precio_base,
        notas=data.notas,
    )
    sesion.add(producto)
    await sesion.flush()
    await _reemplazar_receta(sesion, producto, data)
    await sesion.flush()

    registrar(
        sesion,
        admin.id,
        TipoEventoAuditoria.CREAR,
        tabla_afectada="productos",
        registro_id=producto.id,
        detalle=f"Producto {producto.nombre} ({producto.tipo.value})",
    )
    return {"status": "success", "data": serializar_producto(producto)}


@router.patch("/{producto_id}")
async def actualizar_producto(
    producto_id: int,
    data: ProductoUpdateData,
    admin: Annotated[Usuario, Depends(solo_admin)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    producto = await sesion.get(Producto, producto_id)
    if producto is None:
        raise NoEncontrado("Producto no encontrado.")

    producto.nombre = data.nombre
    producto.tipo = data.tipo
    producto.precio_base = data.precio_base
    producto.notas = data.notas
    await _reemplazar_receta(sesion, producto, data)

    registrar(
        sesion,
        admin.id,
        TipoEventoAuditoria.EDITAR,
        tabla_afectada="productos",
        registro_id=producto.id,
        detalle=f"Producto {producto.nombre} actualizado",
    )
    return {"status": "success", "data": serializar_producto(producto)}


@router.delete("/{producto_id}")
async def eliminar_producto(
    producto_id: int,
    admin: Annotated[Usuario, Depends(solo_admin)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    """Borrado lógico: las órdenes históricas siguen referenciando el producto."""
    producto = await sesion.get(Producto, producto_id)
    if producto is None:
        raise NoEncontrado("Producto no encontrado.")

    producto.activo = False
    registrar(
        sesion,
        admin.id,
        TipoEventoAuditoria.ELIMINAR,
        tabla_afectada="productos",
        registro_id=producto.id,
        detalle=f"Producto {producto.nombre} desactivado",
    )
    return {"status": "success"}
