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
    EstadoPieza,
    Material,
    MotivoMovimiento,
    MovimientoStock,
    TipoEventoAuditoria,
    Unidad,
    Usuario,
)
from app.schemas import (
    ConsumoPiezaCreateData,
    MaterialCreateData,
    MaterialEditData,
    MaterialStockData,
    PiezaLoteCreateData,
)
from app.services import inventario_service
from app.services.inventario_service import AjusteStock, aplicar_ajustes
from app.services.serializadores import (
    serializar_consumo,
    serializar_material,
    serializar_movimiento,
    serializar_pieza,
)

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
        precio_compra=data.precio_compra,
        ubicacion_estante=data.ubicacion_estante,
        tipo_formato=data.tipo_formato,
        ancho_predeterminado_m=data.ancho_predeterminado_m,
        largo_predeterminado_m=data.largo_predeterminado_m,
        espesor_mm=data.espesor_mm,
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
    material.precio_compra = data.precio_compra
    material.ubicacion_estante = data.ubicacion_estante
    material.tipo_formato = data.tipo_formato
    material.ancho_predeterminado_m = data.ancho_predeterminado_m
    material.largo_predeterminado_m = data.largo_predeterminado_m
    material.espesor_mm = data.espesor_mm

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


# ══ Endpoints de Rollos y Planchas Pre-dimensionadas ══════════════════════

@router.get("/piezas")
async def listar_piezas(
    usuario: Annotated[Usuario, Depends(usuario_actual)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
    material_id: Optional[int] = None,
    estado: Optional[EstadoPieza] = None,
):
    """Lista las piezas físicas, rollos y planchas pre-establecidas."""
    piezas = await inventario_service.listar_piezas(sesion, material_id, estado)
    return {"status": "success", "data": [serializar_pieza(p) for p in piezas]}


@router.post("/piezas")
async def registrar_pieza(
    data: PiezaLoteCreateData,
    usuario: Annotated[Usuario, Depends(supervision)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    """Registra una nueva plancha pre-dimensionada o rollo continuo con costo."""
    pieza = await inventario_service.registrar_pieza(sesion, data, usuario)
    return {"status": "success", "data": serializar_pieza(pieza)}


@router.get("/piezas/{pieza_id}")
async def obtener_pieza(
    pieza_id: int,
    usuario: Annotated[Usuario, Depends(usuario_actual)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    """Detalle de una pieza con su historial de cortes y ganancia neta generada."""
    pieza = await inventario_service.obtener_pieza(sesion, pieza_id)
    return {"status": "success", "data": serializar_pieza(pieza)}


@router.post("/piezas/{pieza_id}/consumos")
async def registrar_consumo_pieza(
    pieza_id: int,
    data: ConsumoPiezaCreateData,
    usuario: Annotated[Usuario, Depends(usuario_actual)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    """Registra un corte/trabajo consumido de la pieza (como en CONTROL ROLLOS A+B)."""
    consumo = await inventario_service.registrar_consumo_pieza(
        sesion, pieza_id, data, usuario
    )
    return {"status": "success", "data": serializar_consumo(consumo)}
