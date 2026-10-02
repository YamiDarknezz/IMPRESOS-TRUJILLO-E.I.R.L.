"""Esquemas de usuarios."""
from typing import Optional

from pydantic import BaseModel, Field, field_validator

from app.models import Rol
from app.schemas.auth import LONGITUD_MAXIMA_CONTRASENA
from app.schemas.comunes import exigir_password_compleja, exigir_texto, limpiar


class UsuarioCreateData(BaseModel):
    nombre: str = Field(max_length=120)
    email: str = Field(max_length=150)
    password: str
    rol: Rol = Rol.OPERARIO

    @field_validator("nombre", "email")
    @classmethod
    def _obligatorios(cls, v: str) -> str:
        return exigir_texto(v)

    @field_validator("password")
    @classmethod
    def _complejidad(cls, v: str) -> str:
        return exigir_password_compleja(v, LONGITUD_MAXIMA_CONTRASENA)


class UsuarioUpdateData(BaseModel):
    nombre: Optional[str] = Field(default=None, max_length=120)
    rol: Optional[Rol] = None
    activo: Optional[bool] = None

    @field_validator("nombre")
    @classmethod
    def _limpiar_nombre(cls, v: Optional[str]) -> Optional[str]:
        return limpiar(v) if v is not None else None
