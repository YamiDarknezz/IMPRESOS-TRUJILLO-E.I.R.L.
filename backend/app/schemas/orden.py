"""Esquemas de órdenes de trabajo: creación, pipeline, pagos y reporte de uso."""
from datetime import date
from typing import Optional

from pydantic import BaseModel, field_validator

from app.models import EstadoOrden, MetodoPago, TipoDocumento, UnidadNegocio
from app.schemas.comunes import exigir_no_negativo, exigir_positivo, exigir_texto, limpiar


class MaterialEstimado(BaseModel):
    """Un material con su cantidad estimada, tal como lo consume la orden."""

    material_id: int
    cantidad: float

    @field_validator("cantidad")
    @classmethod
    def _cantidad_positiva(cls, v: float) -> float:
        return exigir_positivo(v, "La cantidad debe ser mayor a 0")


class OrdenItemData(BaseModel):
    """Línea del contrato; las gigantografías llevan medidas alto x ancho."""

    descripcion: str
    producto_id: Optional[int] = None
    ancho_m: Optional[float] = None
    alto_m: Optional[float] = None
    cantidad: float = 1
    precio_unitario: float = 0

    @field_validator("descripcion")
    @classmethod
    def _texto_obligatorio(cls, v: str) -> str:
        return exigir_texto(v)

    @field_validator("ancho_m", "alto_m")
    @classmethod
    def _medida_positiva(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and v <= 0:
            raise ValueError("Las medidas deben ser mayores a 0")
        return v

    @field_validator("cantidad")
    @classmethod
    def _cantidad_positiva(cls, v: float) -> float:
        return exigir_positivo(v)

    @field_validator("precio_unitario")
    @classmethod
    def _precio_no_negativo(cls, v: float) -> float:
        return exigir_no_negativo(v)


class OrdenCreateData(BaseModel):
    """Datos para crear o editar una orden (contrato/proforma)."""

    # Se puede mandar el id del cliente o solo el nombre (alta rápida).
    cliente_id: Optional[int] = None
    cliente: str = ""
    direccion: str = ""
    telefono: str = ""

    asignado_a: Optional[int] = None
    descripcion: str

    tipo_documento: TipoDocumento = TipoDocumento.CONTRATO
    unidad_negocio: UnidadNegocio = UnidadNegocio.IMPRENTA
    fecha_entrega: date
    incluye_igv: bool = False

    items: list[OrdenItemData] = []
    materiales_estimados: list[MaterialEstimado] = []

    descuento: float = 0.0
    motivo_descuento: str = ""
    # Subtotal directo cuando la orden no se detalla por líneas.
    precio_total: Optional[float] = None

    adelanto_pago: float
    metodo_pago: MetodoPago

    @field_validator("descripcion")
    @classmethod
    def _texto_obligatorio(cls, v: str) -> str:
        return exigir_texto(v)

    @field_validator("cliente", "direccion", "telefono", "motivo_descuento")
    @classmethod
    def _limpiar(cls, v: str) -> str:
        return limpiar(v)

    @field_validator("descuento", "adelanto_pago")
    @classmethod
    def _no_negativo(cls, v: float) -> float:
        return exigir_no_negativo(v)

    @field_validator("precio_total")
    @classmethod
    def _precio_no_negativo(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and v < 0:
            raise ValueError("El precio no puede ser negativo")
        return v


class OrdenCompletionData(BaseModel):
    """Consumo real de materiales al finalizar la producción."""

    id_orden: int
    materiales_reales: list[MaterialEstimado]


class AsignarData(BaseModel):
    asignado_a: Optional[int] = None  # None desasigna


class ConfirmarPagoData(BaseModel):
    # Método del pago final; si no se indica, se reusa el del adelanto.
    metodo_pago: Optional[MetodoPago] = None
    referencia: str = ""


class CambiarEstadoData(BaseModel):
    estado: EstadoOrden
