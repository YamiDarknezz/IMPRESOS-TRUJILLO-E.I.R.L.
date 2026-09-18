"""Endpoints de reportes financieros."""
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import obtener_sesion
from app.core.fechas import parsear_fecha
from app.core.security import usuario_actual
from app.models import UnidadNegocio, Usuario
from app.services import finanzas_service

router = APIRouter(prefix="/api/finanzas", tags=["Finanzas"])


@router.get("/resumen")
async def resumen_finanzas(
    usuario: Annotated[Usuario, Depends(usuario_actual)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
    desde: Optional[str] = None,
    hasta: Optional[str] = None,
    trabajador: Optional[int] = None,
    unidad_negocio: Optional[UnidadNegocio] = None,
):
    """
    Resumen de ingresos y contratos del rango pedido.

    El filtro por trabajador solo lo aplica un supervisor: a un trabajador el
    servicio lo restringe a sus propias órdenes sin importar lo que pida.
    """
    return {
        "status": "success",
        "data": await finanzas_service.resumen(
            sesion,
            usuario,
            desde=parsear_fecha(desde),
            hasta=parsear_fecha(hasta),
            trabajador_id=trabajador,
            unidad_negocio=unidad_negocio,
        ),
    }
