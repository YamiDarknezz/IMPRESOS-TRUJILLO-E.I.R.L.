"""Esquemas de cierre y arqueo de caja."""
from datetime import date

from typing import Optional

from pydantic import BaseModel, Field, field_validator

from app.models import MotivoObservacionPago, UnidadNegocio
from app.schemas.comunes import exigir_positivo, exigir_texto, limpiar


class CerrarCajaData(BaseModel):
    """Un usuario cierra su caja del día para una unidad de negocio."""

    fecha: date
    unidad_negocio: UnidadNegocio
    observacion: str = ""

    @field_validator("observacion")
    @classmethod
    def _limpiar(cls, v: str) -> str:
        return limpiar(v)


class CongelarCajaData(BaseModel):
    """La Gerencia valida y congela el cierre del día."""

    observacion: str = ""

    @field_validator("observacion")
    @classmethod
    def _limpiar(cls, v: str) -> str:
        return limpiar(v)


class ObservarPagoData(BaseModel):
    """Motivo y justificación para observar o anular un cobro en auditoría."""

    motivo: MotivoObservacionPago
    nota: str = ""

    @field_validator("nota")
    @classmethod
    def _limpiar(cls, v: str) -> str:
        return limpiar(v)


class GastoCajaData(BaseModel):
    """Un gasto que salió de la caja del día (#112)."""

    monto: float
    motivo: str = Field(max_length=200)
    unidad_negocio: UnidadNegocio
    # Si no se indica, es de hoy (día peruano); no puede ser futuro.
    fecha: Optional[date] = None

    @field_validator("monto")
    @classmethod
    def _monto_positivo(cls, v: float) -> float:
        return exigir_positivo(v, "El monto del gasto debe ser mayor a 0")

    @field_validator("motivo")
    @classmethod
    def _motivo_obligatorio(cls, v: str) -> str:
        return exigir_texto(v, "Indica en qué se gastó")

