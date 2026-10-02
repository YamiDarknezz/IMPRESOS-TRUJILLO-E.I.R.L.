"""Autenticación (JWT) y control de acceso por roles (RBAC).

El servidor es la única autoridad de permisos (D6): los routers declaran qué
roles pueden entrar y los servicios verifican la propiedad de cada orden.
Las comprobaciones de la interfaz solo esconden botones.
"""
import secrets
import string
from datetime import datetime, timedelta, timezone
from typing import Annotated, Optional

import bcrypt
import jwt
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import obtener_sesion
from app.models import Rol, Usuario

seguridad = HTTPBearer(auto_error=False)

CREDENCIALES_INVALIDAS = "Sesión no válida. Vuelve a iniciar sesión."

# issue #51: con una contraseña pendiente de cambio, solo estas rutas quedan
# disponibles (cambiarla y salir); todo lo demás se rechaza para forzarlo.
RUTAS_PERMITIDAS_CON_PASSWORD_PENDIENTE = {
    "/api/auth/password",
    "/api/auth/logout",
    "/api/auth/me",
}

# Hash señuelo fijo (issue #43): cuando el correo del login no existe, se
# compara igual contra ESTE hash para que bcrypt (costo 12) corra el mismo
# tiempo que si la cuenta existiera. Sin esto, el tiempo de respuesta
# revelaba qué correos están registrados (~7x más lento con cuenta real,
# medido contra producción). No corresponde a ninguna contraseña real.
HASH_SENUELO = "$2b$12$1aW1dqzbx73F.coh63k/.OmguWEg2iXuKCgiiuntBGpkK20NgQfA6"


# ── Contraseñas (bcrypt) ────────────────────────────────────────────────────

def hash_password(password: str) -> str:
    """Devuelve el hash bcrypt de una contraseña (nunca se guarda en claro)."""
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt(rounds=12)).decode("utf-8")


def verificar_password(password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))
    except (ValueError, TypeError):
        return False


def generar_password_temporal(longitud: int = 12) -> str:
    """Contraseña aleatoria para el restablecimiento de un administrador (issue #51)."""
    alfabeto = string.ascii_letters + string.digits
    while True:
        candidata = "".join(secrets.choice(alfabeto) for _ in range(longitud))
        if any(c.isalpha() for c in candidata) and any(c.isdigit() for c in candidata):
            return candidata


# ── Tokens JWT ──────────────────────────────────────────────────────────────

def crear_token(usuario: Usuario) -> str:
    """
    Firma un JWT con el id, el rol y la versión de sesión del usuario.

    `sesion_version` permite revocar todas las sesiones de una cuenta: al
    incrementarla, los tokens emitidos antes dejan de ser válidos.
    """
    ahora = datetime.now(timezone.utc)
    payload = {
        "sub": str(usuario.id),
        "rol": usuario.rol.value,
        "sv": usuario.sesion_version,
        "iat": ahora,
        "exp": ahora + timedelta(minutes=settings.jwt_expiracion_minutos),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algoritmo)


def decodificar_token(token: str) -> dict:
    try:
        return jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algoritmo])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "La sesión expiró. Vuelve a iniciar sesión.")
    except jwt.InvalidTokenError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, CREDENCIALES_INVALIDAS)


# ── Dependencias de FastAPI ─────────────────────────────────────────────────

async def usuario_actual(
    request: Request,
    credenciales: Annotated[Optional[HTTPAuthorizationCredentials], Depends(seguridad)],
    sesion: Annotated[AsyncSession, Depends(obtener_sesion)],
) -> Usuario:
    """
    Resuelve el usuario autenticado desde el encabezado Authorization.

    Además de validar la firma del token, verifica contra la base que la
    cuenta siga activa y que su versión de sesión no haya cambiado.
    """
    if credenciales is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Falta el token de acceso.")

    datos = decodificar_token(credenciales.credentials)
    usuario_id = int(datos.get("sub", 0))

    usuario = (
        await sesion.execute(select(Usuario).where(Usuario.id == usuario_id))
    ).scalar_one_or_none()

    if usuario is None or not usuario.activo:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, CREDENCIALES_INVALIDAS)
    if datos.get("sv") != usuario.sesion_version:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "La sesión fue revocada. Vuelve a iniciar sesión.")
    if (
        usuario.debe_cambiar_password
        and request.url.path not in RUTAS_PERMITIDAS_CON_PASSWORD_PENDIENTE
    ):
        raise HTTPException(
            status.HTTP_403_FORBIDDEN, "Debes cambiar tu contraseña antes de continuar."
        )

    return usuario


def requiere_roles(*roles: Rol):
    """Genera una dependencia que exige uno de los roles indicados."""

    async def dependencia(usuario: Annotated[Usuario, Depends(usuario_actual)]) -> Usuario:
        if usuario.rol not in roles:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "No tienes permiso para esta operación.")
        return usuario

    return dependencia


# Dependencias listas para los routers.
solo_admin = requiere_roles(Rol.ADMIN)
supervision = requiere_roles(Rol.ADMIN, Rol.SUBGERENTE)
gestion_ordenes = requiere_roles(Rol.ADMIN, Rol.SUBGERENTE, Rol.SECRETARIA)
personal_venta = requiere_roles(Rol.ADMIN, Rol.SUBGERENTE, Rol.SECRETARIA, Rol.OPERARIO)
# Avanzar etapa, reportar uso de materiales y cobrar el saldo de una orden: lo
# hace quien la tiene asignada (operario o diseñadora, según el trabajo) o
# quien supervisa. A propósito NO es lo mismo que `personal_venta`: esas
# operaciones son de mostrador/caja (venta rápida, cerrar caja) y la
# diseñadora no las hace. `ordenes_service.puede_gestionar()` /
# `puede_avanzar_etapa()` ya limitan a operario/diseñadora a solo lo suyo.
personal_produccion = requiere_roles(
    Rol.ADMIN, Rol.SUBGERENTE, Rol.SECRETARIA, Rol.OPERARIO, Rol.DISENADORA
)
