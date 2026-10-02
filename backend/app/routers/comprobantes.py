"""Lectura y borrado de comprobantes de pago (RF-11, issue #67).

La imagen se sirve por la API y no como archivo estático: son vouchers de
clientes, así que la petición tiene que venir con sesión válida. La clave del
archivo es aleatoria, pero eso es una defensa extra, no la principal.
"""
from typing import Annotated

from fastapi import APIRouter, Depends, Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import obtener_sesion
from app.core.security import gestion_ordenes, usuario_actual
from app.models import Usuario
from app.services import comprobantes_service

router = APIRouter(prefix="/api/comprobantes", tags=["Comprobantes"])


@router.get("/{clave}")
async def leer_comprobante(
    clave: str,
    usuario: Annotated[Usuario, Depends(usuario_actual)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    """Devuelve la captura al navegador que ya inició sesión."""
    contenido, tipo_mime = await comprobantes_service.leer(sesion, clave)
    return Response(
        content=contenido,
        media_type=tipo_mime,
        headers={
            # Dato de cliente: que no quede en cachés intermedias.
            "Cache-Control": "private, max-age=300",
            # El navegador lo muestra en la pestaña en vez de descargarlo.
            "Content-Disposition": "inline",
        },
    )


@router.delete("/{id_comprobante}")
async def borrar_comprobante(
    id_comprobante: int,
    usuario: Annotated[Usuario, Depends(gestion_ordenes)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    """Quita la captura de la orden y del almacén."""
    await comprobantes_service.borrar(sesion, id_comprobante, usuario)
    return {"status": "success", "data": {"id": id_comprobante}}
