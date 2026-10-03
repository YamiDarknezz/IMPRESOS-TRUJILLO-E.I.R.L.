"""Parámetros y catálogos del negocio para la interfaz (#54)."""
from typing import Annotated

from fastapi import APIRouter, Depends

from app.core.catalogos import catalogos, empresa, parametros
from app.core.security import usuario_actual
from app.models import Usuario

router = APIRouter(prefix="/api/configuracion", tags=["Configuración"])


@router.get("")
async def leer_configuracion(usuario: Annotated[Usuario, Depends(usuario_actual)]):
    """
    Lo que la pantalla necesita para no repetir las reglas del negocio.

    Va con sesión porque incluye porcentajes del negocio (IGV y adelanto
    mínimo); el frontend lo pide al iniciar sesión y lo tiene en memoria.
    """
    return {
        "status": "success",
        "data": {"parametros": parametros(), "catalogos": catalogos(), "empresa": empresa()},
    }
