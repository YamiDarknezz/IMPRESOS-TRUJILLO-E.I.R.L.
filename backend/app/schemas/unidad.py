"""Esquemas de unidades de medida."""
from pydantic import BaseModel, Field, field_validator

from app.schemas.comunes import exigir_texto, limpiar


class UnidadCreateData(BaseModel):
    nombre: str = Field(max_length=50)
    abreviatura: str = Field(default="", max_length=10)

    @field_validator("nombre")
    @classmethod
    def _nombre_obligatorio(cls, v: str) -> str:
        return exigir_texto(v, "El nombre de la unidad es requerido")

    @field_validator("abreviatura")
    @classmethod
    def _limpiar(cls, v: str) -> str:
        return limpiar(v)


class UnidadUpdateData(UnidadCreateData):
    """Mismos campos que la creación; el id va en la URL."""
