"""Endpoints de autenticación."""
from datetime import timedelta
from typing import Annotated, Optional

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auditoria import registrar
from app.core.contexto import ip_cliente
from app.core.database import obtener_sesion
from app.core.fechas import ahora_utc
from app.core.config import settings
from app.core.security import (
    COOKIE_SESION,
    HASH_SENUELO,
    crear_token,
    hash_password,
    usuario_actual,
    verificar_password,
)
from app.models import Auditoria, TipoEventoAuditoria, Usuario
from app.schemas import CambiarPasswordData, LoginData
from app.services.serializadores import serializar_usuario

router = APIRouter(prefix="/api/auth", tags=["Autenticación"])

# issue #43: sin esto, el login se podía forzar sin límite y sin dejar rastro.
MAX_INTENTOS_POR_CORREO = 5
MAX_INTENTOS_POR_IP = 20
VENTANA_BLOQUEO = timedelta(minutes=15)


async def _intentos_fallidos_recientes(
    sesion: AsyncSession, *, registro_id: Optional[str] = None, ip: Optional[str] = None
) -> int:
    desde = ahora_utc() - VENTANA_BLOQUEO
    consulta = select(func.count()).select_from(Auditoria).where(
        Auditoria.accion == TipoEventoAuditoria.SESION_FALLIDA,
        Auditoria.fecha >= desde,
    )
    if registro_id is not None:
        consulta = consulta.where(Auditoria.registro_id == registro_id)
    if ip is not None:
        consulta = consulta.where(Auditoria.ip == ip)
    return (await sesion.execute(consulta)).scalar_one()



def _poner_cookie_sesion(response: Response, token: str) -> None:
    """
    Deja el token en una cookie HttpOnly, que es la vía del navegador (#48).

    HttpOnly la esconde de cualquier script (un XSS ya no puede exfiltrar el
    token), Secure evita que viaje por http y SameSite=strict impide que un
    sitio externo la use en una petición cruzada. En desarrollo y pruebas el
    navegador es http, así que Secure se activa solo en producción.
    """
    response.set_cookie(
        COOKIE_SESION,
        token,
        max_age=settings.jwt_expiracion_minutos * 60,
        httponly=True,
        secure=settings.entorno == "produccion",
        samesite="strict",
        path="/",
    )


def _borrar_cookie_sesion(response: Response) -> None:
    response.delete_cookie(COOKIE_SESION, path="/")


@router.post("/login")
async def iniciar_sesion(
    data: LoginData,
    response: Response,
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    """Valida credenciales y abre la sesión (cookie HttpOnly + token)."""
    correo = data.email.lower()
    correo_registro = correo[:40]  # Auditoria.registro_id es String(40)
    ip = ip_cliente.get()

    intentos_correo = await _intentos_fallidos_recientes(sesion, registro_id=correo_registro)
    intentos_ip = await _intentos_fallidos_recientes(sesion, ip=ip) if ip else 0
    if intentos_correo >= MAX_INTENTOS_POR_CORREO or intentos_ip >= MAX_INTENTOS_POR_IP:
        raise HTTPException(
            status.HTTP_429_TOO_MANY_REQUESTS,
            "Demasiados intentos fallidos. Espera unos minutos y vuelve a intentarlo.",
        )

    usuario = (
        await sesion.execute(select(Usuario).where(func.lower(Usuario.email) == correo))
    ).scalar_one_or_none()

    # Se compara SIEMPRE, exista o no la cuenta: bcrypt (costo 12) contra el
    # hash real o contra el señuelo tarda lo mismo, así que el tiempo de
    # respuesta deja de delatar qué correos están registrados (issue #43).
    hash_a_comparar = usuario.password_hash if usuario is not None else HASH_SENUELO
    password_valida = verificar_password(data.password, hash_a_comparar)

    if usuario is None or not usuario.activo or not password_valida:
        registrar(
            sesion,
            usuario.id if usuario is not None else None,
            TipoEventoAuditoria.SESION_FALLIDA,
            tabla_afectada="usuarios",
            registro_id=correo_registro,
            detalle="Intento de inicio de sesión fallido",
        )
        # `obtener_sesion` revierte TODA la transacción si la petición termina
        # en excepción (database.py) -- y el 401 de abajo es justo eso. Sin
        # este commit explícito, el intento fallido nunca llegaba a quedar
        # escrito: se auditaba y se borraba en el mismo request.
        await sesion.commit()
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

    token = crear_token(usuario)
    _poner_cookie_sesion(response, token)

    return {
        "status": "success",
        "data": {
            "access_token": token,
            "token_type": "bearer",
            "usuario": serializar_usuario(usuario),
        },
    }


@router.get("/me")
async def mi_perfil(usuario: Annotated[Usuario, Depends(usuario_actual)]):
    return {"status": "success", "data": serializar_usuario(usuario)}


@router.post("/logout")
async def cerrar_sesion(
    response: Response,
    usuario: Annotated[Usuario, Depends(usuario_actual)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    """
    Revoca el token actual (y cualquier otro emitido antes para esta cuenta).

    Antes solo se borraba el localStorage del navegador: el token seguía
    siendo válido en la API hasta su expiración (720 minutos). Reutiliza
    `sesion_version`, el mismo mecanismo que ya usa `cambiar_password`.
    """
    usuario.sesion_version += 1

    registrar(
        sesion,
        usuario.id,
        TipoEventoAuditoria.SESION,
        tabla_afectada="usuarios",
        registro_id=usuario.id,
        detalle="Cierre de sesión",
    )
    _borrar_cookie_sesion(response)
    return {"status": "success"}


@router.post("/password")
async def cambiar_password(
    data: CambiarPasswordData,
    response: Response,
    usuario: Annotated[Usuario, Depends(usuario_actual)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
):
    """Cambia la contraseña propia y revoca las demás sesiones."""
    if not verificar_password(data.password_actual, usuario.password_hash):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "La contraseña actual no coincide.")

    usuario.password_hash = hash_password(data.password_nueva)
    usuario.debe_cambiar_password = False
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
    token = crear_token(usuario)
    _poner_cookie_sesion(response, token)
    return {"status": "success", "data": {"access_token": token}}
