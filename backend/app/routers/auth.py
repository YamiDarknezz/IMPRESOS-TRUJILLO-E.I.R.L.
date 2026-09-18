"""Endpoints de autenticación."""
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auditoria import registrar
from app.core.database import obtener_sesion
from app.core.security import crear_token, hash_password, usuario_actual, verificar_password
from app.models import TipoEventoAuditoria, Usuario
from app.schemas import CambiarPasswordData, LoginData
from app.services.serializadores import serializar_usuario

router = APIRouter(prefix="/api/auth", tags=["Autenticación"])


@router.post("/login")
async def iniciar_sesion(
    data: LoginData,
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    """Valida credenciales y devuelve el token JWT de la sesión."""
    usuario = (
        await sesion.execute(
            select(Usuario).where(func.lower(Usuario.email) == data.email.lower())
        )
    ).scalar_one_or_none()

    if (
        usuario is None
        or not usuario.activo
        or not verificar_password(data.password, usuario.password_hash)
    ):
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED, "Correo o contraseña incorrectos."
        )

    registrar(
        sesion,
        usuario.id,
        TipoEventoAuditoria.SESION,
        tabla_afectada="usuarios",
        registro_id=usuario.id,
        detalle="Inicio de sesión",
    )

    return {
        "status": "success",
        "data": {
            "access_token": crear_token(usuario),
            "token_type": "bearer",
            "usuario": serializar_usuario(usuario),
        },
    }


@router.get("/me")
async def mi_perfil(usuario: Annotated[Usuario, Depends(usuario_actual)]):
    return {"status": "success", "data": serializar_usuario(usuario)}


@router.post("/password")
async def cambiar_password(
    data: CambiarPasswordData,
    usuario: Annotated[Usuario, Depends(usuario_actual)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    """Cambia la contraseña propia y revoca las demás sesiones."""
    if not verificar_password(data.password_actual, usuario.password_hash):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "La contraseña actual no coincide.")

    usuario.password_hash = hash_password(data.password_nueva)
    # Fuerza a iniciar sesión de nuevo en cualquier otro dispositivo; el
    # token que se devuelve abajo mantiene viva esta sesión.
    usuario.sesion_version += 1

    registrar(
        sesion,
        usuario.id,
        TipoEventoAuditoria.EDITAR,
        tabla_afectada="usuarios",
        registro_id=usuario.id,
        detalle="Cambio de contraseña",
    )
    return {"status": "success", "data": {"access_token": crear_token(usuario)}}
