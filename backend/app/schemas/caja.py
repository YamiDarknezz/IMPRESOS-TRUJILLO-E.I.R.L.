"""Esquemas de cierre y arqueo de caja."""
from datetime import date
from typing import Optional

from pydantic import BaseModel, field_validator

from app.models import MotivoObservacionPago, UnidadNegocio
from app.schemas.comunes import limpiar


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

