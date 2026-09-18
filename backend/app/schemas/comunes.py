"""Validadores y respuestas compartidas por todos los esquemas."""
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


def exigir_no_negativo(valor: float, mensaje: str = "El valor no puede ser negativo") -> float:
    if valor < 0:
        raise ValueError(mensaje)
    return valor


def exigir_positivo(valor: float, mensaje: str = "El valor debe ser mayor a 0") -> float:
    if valor <= 0:
        raise ValueError(mensaje)
    return valor


# ── Envoltura de respuestas (misma forma que ya consume el frontend) ────────

class RespuestaExitosa(BaseModel):
    status: str = "success"


class RespuestaItem(RespuestaExitosa, Generic[T]):
    data: T


class RespuestaLista(RespuestaExitosa, Generic[T]):
    data: list[T]
