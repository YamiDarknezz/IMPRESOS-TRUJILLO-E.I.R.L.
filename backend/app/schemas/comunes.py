"""Validadores y respuestas compartidas por todos los esquemas."""
import math
from typing import Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


# ── Validadores reutilizables ───────────────────────────────────────────────

def exigir_texto(valor: str, mensaje: str = "Este campo no puede estar vacío") -> str:
    """Recorta espacios y rechaza el texto vacío."""
    if not valor or not valor.strip():
        raise ValueError(mensaje)
    return valor.strip()


def limpiar(valor: str) -> str:
    """Recorta espacios de un campo opcional (puede quedar vacío)."""
    return (valor or "").strip()


def _exigir_finito(valor: float) -> None:
    """
    `NaN < 0` y `NaN <= 0` son ambas falsas, así que sin esto un monto `NaN`
    pasa cualquiera de los dos validadores de abajo como si fuera válido.
    Pydantic (y el parser de Starlette) aceptan los literales JSON no
    estándar `NaN`/`Infinity` por defecto, así que esto es lo único que
    realmente los detiene.
    """
    if not math.isfinite(valor):
        raise ValueError("El valor debe ser un número finito.")


def exigir_no_negativo(valor: float, mensaje: str = "El valor no puede ser negativo") -> float:
    _exigir_finito(valor)
    if valor < 0:
        raise ValueError(mensaje)
    return valor


def exigir_positivo(valor: float, mensaje: str = "El valor debe ser mayor a 0") -> float:
    _exigir_finito(valor)
    if valor <= 0:
        raise ValueError(mensaje)
    return valor


def exigir_password_compleja(valor: str, longitud_maxima: int) -> str:
    """
    RNF de seguridad (issue #51): "12345678" o "contraseña" por sí solos ya
    no alcanzan, hace falta mezclar letra y número.
    """
    if len(valor) < 8:
        raise ValueError("La contraseña debe tener al menos 8 caracteres")
    if len(valor.encode("utf-8")) > longitud_maxima:
        raise ValueError("La contraseña es demasiado larga")
    if not any(c.isalpha() for c in valor):
        raise ValueError("La contraseña debe incluir al menos una letra")
    if not any(c.isdigit() for c in valor):
        raise ValueError("La contraseña debe incluir al menos un número")
    return valor


# ── Envoltura de respuestas (misma forma que ya consume el frontend) ────────

class RespuestaExitosa(BaseModel):
    status: str = "success"


class RespuestaItem(RespuestaExitosa, Generic[T]):
    data: T


class RespuestaLista(RespuestaExitosa, Generic[T]):
    data: list[T]
