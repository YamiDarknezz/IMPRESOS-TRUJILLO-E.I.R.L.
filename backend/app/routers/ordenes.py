"""Endpoints de órdenes de trabajo.

Esta capa solo traduce HTTP: lee la petición, resuelve quién la hace y delega
en `services.ordenes_service`. Las reglas del negocio y el manejo de errores
viven fuera de aquí.
"""
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import obtener_sesion
from app.core.security import gestion_ordenes, personal_venta, supervision, usuario_actual
from app.models import EstadoOrden, Usuario
from app.schemas import (
    AsignarData,
    CambiarEstadoData,
    ConfirmarPagoData,
    OrdenCompletionData,
    OrdenCreateData,
    VentaRapidaData,
)
from app.services import ordenes_service
from app.services.serializadores import serializar_orden

router = APIRouter(prefix="/api/ordenes", tags=["Órdenes"])

LIMITE_POR_DEFECTO = 100
LIMITE_MAXIMO = 500


@router.get("")
async def listar_ordenes(
    usuario: Annotated[Usuario, Depends(usuario_actual)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
    estado: Optional[EstadoOrden] = Query(default=None),
    limit: int = Query(default=LIMITE_POR_DEFECTO, le=LIMITE_MAXIMO),
):
    ordenes = await ordenes_service.listar(sesion, usuario, estado, limit)
    return {"status": "success", "data": [serializar_orden(o) for o in ordenes]}


@router.get("/{id_orden}")
async def obtener_orden(
    id_orden: int,
    usuario: Annotated[Usuario, Depends(usuario_actual)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    orden = await ordenes_service.obtener(sesion, id_orden, usuario)
    return {"status": "success", "data": serializar_orden(orden)}


@router.post("")
async def crear_orden(
    data: OrdenCreateData,
    usuario: Annotated[Usuario, Depends(gestion_ordenes)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    orden = await ordenes_service.crear_orden(sesion, data, usuario)
    return {"status": "success", "data": serializar_orden(orden)}


@router.post("/caja-rapida")
async def crear_venta_rapida(
    data: VentaRapidaData,
    usuario: Annotated[Usuario, Depends(personal_venta)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    """Venta express en mostrador (copias, fotochecks, servicios rápidos) con pago al 100%."""
    orden = await ordenes_service.crear_venta_rapida(sesion, data, usuario)
    return {"status": "success", "data": serializar_orden(orden)}


@router.patch("/{id_orden}")
async def actualizar_orden(
    id_orden: int,
    data: OrdenCreateData,
    usuario: Annotated[Usuario, Depends(gestion_ordenes)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    orden = await ordenes_service.actualizar(sesion, id_orden, data, usuario)
    return {"status": "success", "data": serializar_orden(orden)}


@router.post("/{id_orden}/cancelar")
async def cancelar_orden(
    id_orden: int,
    usuario: Annotated[Usuario, Depends(supervision)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    orden = await ordenes_service.cancelar(sesion, id_orden, usuario)
    return {"status": "success", "data": serializar_orden(orden)}


@router.post("/{id_orden}/asignar")
async def asignar_orden(
    id_orden: int,
    data: AsignarData,
    usuario: Annotated[Usuario, Depends(supervision)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    orden = await ordenes_service.asignar(sesion, id_orden, data.asignado_a, usuario)
    return {"status": "success", "data": serializar_orden(orden)}


@router.post("/{id_orden}/estado")
async def cambiar_estado(
    id_orden: int,
    data: CambiarEstadoData,
    usuario: Annotated[Usuario, Depends(personal_venta)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    """Avanza (o corrige) la etapa de producción de una orden."""
    orden = await ordenes_service.cambiar_estado(sesion, id_orden, data.estado, usuario)
    return {"status": "success", "data": serializar_orden(orden)}


@router.post("/{id_orden}/confirmar-pago")
async def confirmar_pago(
    id_orden: int,
    data: ConfirmarPagoData,
    usuario: Annotated[Usuario, Depends(personal_venta)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    orden = await ordenes_service.confirmar_pago(
        sesion, id_orden, data.metodo_pago, data.referencia, usuario
    )
    return {"status": "success", "data": serializar_orden(orden)}


@router.post("/completar")
async def completar_orden(
    data: OrdenCompletionData,
    usuario: Annotated[Usuario, Depends(personal_venta)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    """Cierra la producción reportando el consumo real de materiales."""
    orden, mermas, devoluciones = await ordenes_service.completar(
        sesion, data.id_orden, data.materiales_reales, usuario
    )
    return {
        "status": "success",
        "data": serializar_orden(orden),
        "mermas_registradas": mermas,
        "devoluciones_registradas": devoluciones,
    }
