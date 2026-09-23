"""Esquemas de inventario."""
from typing import Optional

from pydantic import BaseModel, field_validator

from app.models.enums import TipoFormatoMaterial
from app.schemas.comunes import exigir_no_negativo, exigir_positivo, exigir_texto, limpiar


class MaterialCreateData(BaseModel):
    nombre: str
    unidad_id: int
    stock_inicial: float = 0.0
    alerta_minima: float = 0.0
    dias_reabastecimiento: int = 0
    precio_compra: float = 0.0
    ubicacion_estante: str = ""
    tipo_formato: TipoFormatoMaterial = TipoFormatoMaterial.UNIDAD_PIEZA
    ancho_predeterminado_m: Optional[float] = None
    largo_predeterminado_m: Optional[float] = None
    espesor_mm: Optional[float] = None

    @field_validator("nombre")
    @classmethod
    def _texto_obligatorio(cls, v: str) -> str:
        return exigir_texto(v)

    @field_validator("stock_inicial", "alerta_minima", "dias_reabastecimiento", "precio_compra")
    @classmethod
    def _no_negativo(cls, v):
        return exigir_no_negativo(v)


class MaterialEditData(BaseModel):
    """Edición de la ficha del material; el stock se ajusta por otro endpoint."""

    nombre: str
    unidad_id: int
    alerta_minima: float = 0.0
    dias_reabastecimiento: int = 0
    precio_compra: float = 0.0
    ubicacion_estante: str = ""
    tipo_formato: TipoFormatoMaterial = TipoFormatoMaterial.UNIDAD_PIEZA
    ancho_predeterminado_m: Optional[float] = None
    largo_predeterminado_m: Optional[float] = None
    espesor_mm: Optional[float] = None

    @field_validator("nombre")
    @classmethod
    def _texto_obligatorio(cls, v: str) -> str:
        return exigir_texto(v)

    @field_validator("alerta_minima", "dias_reabastecimiento", "precio_compra")
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


class PiezaLoteCreateData(BaseModel):
    """Alta de un rollo continuo (100m) o plancha rígida pre-dimensionada (ej: MDF 2.44x1.22m)."""

    material_id: int
    codigo_identificador: str
    capacidad_inicial: float
    unidad_medida: str = "m"
    costo_adquisicion: float = 0.0
    ancho_m: Optional[float] = None
    largo_m: Optional[float] = None
    espesor_mm: Optional[float] = None
    ubicacion: str = ""
    maquina_asignada: str = ""
    nota: str = ""

    @field_validator("codigo_identificador")
    @classmethod
    def _codigo_valido(cls, v: str) -> str:
        return exigir_texto(v, "El código identificador (ej. ROLL-A-01, PL-MDF-01) es obligatorio")

    @field_validator("capacidad_inicial")
    @classmethod
    def _capacidad_valida(cls, v: float) -> float:
        return exigir_positivo(v, "La capacidad inicial (metros o área) debe ser mayor a 0")

    @field_validator("costo_adquisicion")
    @classmethod
    def _costo_valido(cls, v: float) -> float:
        return exigir_no_negativo(v)


class ConsumoPiezaCreateData(BaseModel):
    """Descuento por trabajo/corte en una pieza o rollo en uso."""

    trabajo_descripcion: str
    cantidad_consumida: float
    orden_id: Optional[int] = None
    monto_cobrado: float = 0.0
    merma_desperdicio: float = 0.0
    nota: str = ""

    @field_validator("trabajo_descripcion")
    @classmethod
    def _trabajo_valido(cls, v: str) -> str:
        return exigir_texto(v, "La descripción del trabajo es obligatoria")

    @field_validator("cantidad_consumida")
    @classmethod
    def _consumo_valido(cls, v: float) -> float:
        return exigir_positivo(v, "La cantidad consumida debe ser mayor a 0")

    @field_validator("monto_cobrado", "merma_desperdicio")
    @classmethod
    def _valores_no_negativos(cls, v: float) -> float:
        return exigir_no_negativo(v)
