"""Esquemas de inventario."""
from pydantic import BaseModel, field_validator

from app.schemas.comunes import exigir_no_negativo, exigir_texto


class MaterialCreateData(BaseModel):
    nombre: str
    unidad_id: int
    stock_inicial: float = 0.0
    alerta_minima: float = 0.0
    dias_reabastecimiento: int = 0

    @field_validator("nombre")
    @classmethod
    def _texto_obligatorio(cls, v: str) -> str:
        return exigir_texto(v)

    @field_validator("stock_inicial", "alerta_minima", "dias_reabastecimiento")
    @classmethod
    def _no_negativo(cls, v):
        return exigir_no_negativo(v)


class MaterialEditData(BaseModel):
    """Edición de la ficha del material; el stock se ajusta por otro endpoint."""

    nombre: str
    unidad_id: int
    alerta_minima: float = 0.0
    dias_reabastecimiento: int = 0

    @field_validator("nombre")
    @classmethod
    def _texto_obligatorio(cls, v: str) -> str:
        return exigir_texto(v)

    @field_validator("alerta_minima", "dias_reabastecimiento")
    @classmethod
    def _no_negativo(cls, v):
        return exigir_no_negativo(v)


class MaterialStockData(BaseModel):
    """Ajuste manual de stock (conteo físico)."""

    stock_actual: float
    nota: str = ""

    @field_validator("stock_actual")
    @classmethod
    def _no_negativo(cls, v: float) -> float:
        return exigir_no_negativo(v, "El stock no puede ser negativo")
