"""Esquemas del catálogo de productos y su receta."""
from pydantic import BaseModel, field_validator

from app.models import TipoProducto
from app.schemas.comunes import exigir_no_negativo, exigir_positivo, exigir_texto, limpiar


class RecetaItem(BaseModel):
    material_id: int
    cantidad: float

    @field_validator("cantidad")
    @classmethod
    def _cantidad_positiva(cls, v: float) -> float:
        return exigir_positivo(v, "La cantidad debe ser mayor a 0")


class ProductoCreateData(BaseModel):
    nombre: str
    tipo: TipoProducto = TipoProducto.PROPIO
    precio_base: float = 0.0
    notas: str = ""
    # "Receta": solo para productos propios.
    receta: list[RecetaItem] = []

    @field_validator("nombre")
    @classmethod
    def _nombre_obligatorio(cls, v: str) -> str:
        return exigir_texto(v, "El nombre del producto es requerido")

    @field_validator("notas")
    @classmethod
    def _limpiar(cls, v: str) -> str:
        return limpiar(v)

    @field_validator("precio_base")
    @classmethod
    def _no_negativo(cls, v: float) -> float:
        return exigir_no_negativo(v, "El precio no puede ser negativo")


class ProductoUpdateData(ProductoCreateData):
    """Mismos campos que la creación; el id va en la URL."""
