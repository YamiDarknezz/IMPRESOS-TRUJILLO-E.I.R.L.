"""Endpoints del inventario de materiales.

El stock lo mueve normalmente el flujo de órdenes (se reserva al crear y se
ajusta al reportar el consumo real). El endpoint de stock de aquí es para
corregir a mano tras un conteo físico.
"""
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auditoria import registrar
from app.core.database import obtener_sesion
from app.core.errores import Conflicto, NoEncontrado
from app.core.security import supervision, usuario_actual
from app.models import (
    Material,
    MotivoMovimiento,
    MovimientoStock,
    TipoEventoAuditoria,
    Unidad,
    Usuario,
)
from app.schemas import MaterialCreateData, MaterialEditData, MaterialStockData
from app.services.inventario_service import AjusteStock, aplicar_ajustes
from app.services.serializadores import serializar_material, serializar_movimiento

router = APIRouter(prefix="/api/inventario", tags=["Inventario"])


@router.get("")
async def listar_inventario(
    usuario: Annotated[Usuario, Depends(usuario_actual)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
    solo_bajos: bool = Query(default=False, description="Solo materiales en alerta"),
):
    consulta = select(Material).where(Material.activo.is_(True)).order_by(func.lower(Material.nombre))
    materiales = list((await sesion.execute(consulta)).scalars())
    if solo_bajos:
        materiales = [material for material in materiales if material.stock_bajo]
    return {"status": "success", "data": [serializar_material(m) for m in materiales]}


@router.get("/{material_id}/movimientos")
async def listar_movimientos(
    material_id: int,
    usuario: Annotated[Usuario, Depends(usuario_actual)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
    limite: int = Query(default=100, le=500),
):
    """Trazabilidad del material: quién movió qué, cuándo y por qué orden."""
    movimientos = (
        await sesion.execute(
            select(MovimientoStock)
            .where(MovimientoStock.material_id == material_id)
            .order_by(MovimientoStock.creado_en.desc())
            .limit(limite)
        )
    ).scalars()
    return {"status": "success", "data": [serializar_movimiento(m) for m in movimientos]}


@router.post("")
async def crear_material(
    data: MaterialCreateData,
    usuario: Annotated[Usuario, Depends(supervision)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    existente = (
        await sesion.execute(
            select(Material).where(func.lower(Material.nombre) == data.nombre.lower())
        )
    ).scalar_one_or_none()
    if existente is not None:
        raise Conflicto("Ya existe un material con ese nombre.")

    unidad = await sesion.get(Unidad, data.unidad_id)
    if unidad is None:
        raise NoEncontrado("La unidad de medida no existe.")

    material = Material(
        nombre=data.nombre,
        unidad=unidad,
        stock_actual=0,
        alerta_minima=data.alerta_minima,
        dias_reabastecimiento=data.dias_reabastecimiento,
    )
    sesion.add(material)
    await sesion.flush()

    if data.stock_inicial > 0:
        # El stock inicial entra como movimiento para dejar rastro desde el día 1.
        await aplicar_ajustes(
            sesion,
            [
                AjusteStock(
                    material_id=material.id,
                    delta=data.stock_inicial,
                    nombre=material.nombre,
                    motivo=MotivoMovimiento.AJUSTE_MANUAL,
                    nota="Stock inicial del material",
                )
            ],
            usuario_id=usuario.id,
        )

    registrar(
        sesion,
        usuario.id,
        TipoEventoAuditoria.CREAR,
        tabla_afectada="materiales",
        registro_id=material.id,
        detalle=f"Material {material.nombre}, stock inicial {data.stock_inicial}",
    )
    return {"status": "success", "data": serializar_material(material)}


@router.patch("/{material_id}")
async def editar_material(
    material_id: int,
    data: MaterialEditData,
    usuario: Annotated[Usuario, Depends(supervision)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    """Edita la ficha del material. El stock se ajusta por el endpoint de stock."""
    material = await sesion.get(Material, material_id)
    if material is None:
        raise NoEncontrado("Material no encontrado.")

    unidad = await sesion.get(Unidad, data.unidad_id)
    if unidad is None:
        raise NoEncontrado("La unidad de medida no existe.")

    material.nombre = data.nombre
    material.unidad = unidad
    material.alerta_minima = data.alerta_minima
    material.dias_reabastecimiento = data.dias_reabastecimiento

    registrar(
        sesion,
        usuario.id,
        TipoEventoAuditoria.EDITAR,
        tabla_afectada="materiales",
        registro_id=material.id,
        detalle=f"Material {material.nombre} actualizado",
    )
    return {"status": "success", "data": serializar_material(material)}


@router.patch("/{material_id}/stock")
async def ajustar_stock(
    material_id: int,
    data: MaterialStockData,
    usuario: Annotated[Usuario, Depends(supervision)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    """Corrección manual del stock, normalmente tras un conteo físico."""
    material = await sesion.get(Material, material_id)
    if material is None:
        raise NoEncontrado("Material no encontrado.")

    delta = data.stock_actual - float(material.stock_actual)
    if delta != 0:
        await aplicar_ajustes(
            sesion,
            [
                AjusteStock(
                    material_id=material.id,
                    delta=delta,
                    nombre=material.nombre,
                    motivo=MotivoMovimiento.AJUSTE_MANUAL,
                    nota=data.nota or "Ajuste manual tras conteo físico",
                )
            ],
            usuario_id=usuario.id,
        )

    return {"status": "success", "data": serializar_material(material)}
