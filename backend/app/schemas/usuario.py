"""Esquemas de usuarios."""
from typing import Optional

from pydantic import BaseModel, field_validator

from app.models import Rol
from app.schemas.auth import LONGITUD_MAXIMA_CONTRASENA
from app.schemas.comunes import exigir_texto, limpiar


class UsuarioCreateData(BaseModel):
    nombre: str
    email: str
    password: str
    rol: Rol = Rol.OPERARIO

    @field_validator("nombre", "email")
    @classmethod
    def _obligatorios(cls, v: str) -> str:
        return exigir_texto(v)

    @field_validator("password")
    @classmethod
    def _longitud(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("La contraseña debe tener al menos 8 caracteres")
        if len(v.encode("utf-8")) > LONGITUD_MAXIMA_CONTRASENA:
            raise ValueError("La contraseña es demasiado larga")
        return v


class UsuarioUpdateData(BaseModel):
    nombre: Optional[str] = None
    rol: Optional[Rol] = None
    activo: Optional[bool] = None

    @field_validator("nombre")
    @classmethod
    def _limpiar_nombre(cls, v: Optional[str]) -> Optional[str]:
        return limpiar(v) if v is not None else None
