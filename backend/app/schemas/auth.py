"""Esquemas de autenticación."""
from pydantic import BaseModel, field_validator

from app.schemas.comunes import exigir_password_compleja, exigir_texto

LONGITUD_MAXIMA_CONTRASENA = 72  # límite de bcrypt


class LoginData(BaseModel):
    email: str
    password: str

    @field_validator("email", "password")
    @classmethod
    def _obligatorios(cls, v: str) -> str:
        return exigir_texto(v, "Correo y contraseña son obligatorios")


class CambiarPasswordData(BaseModel):
    password_actual: str
    password_nueva: str

    @field_validator("password_actual", "password_nueva")
    @classmethod
    def _obligatorios(cls, v: str) -> str:
        return exigir_texto(v)

    @field_validator("password_nueva")
    @classmethod
    def _complejidad(cls, v: str) -> str:
        return exigir_password_compleja(v, LONGITUD_MAXIMA_CONTRASENA)
