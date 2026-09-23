"""Modelos ORM del sistema Impresos Trujillo.

`Base` se importa aquí para que Alembic y los tests encuentren el metadata
completo con solo hacer `from app.models import Base`.
"""
from app.models.base import Base
from app.models.auditoria import Auditoria
from app.models.caja import CierreCaja
from app.models.cliente import Cliente
from app.models.enums import (
    EstadoCierre,
    EstadoOrden,
    EstadoPago,
    EstadoPieza,
    MetodoPago,
    MotivoMovimiento,
    MotivoObservacionPago,
    Rol,
    TipoCliente,
    TipoDocumento,
    TipoEventoAuditoria,
    TipoFormatoMaterial,
    TipoPago,
    TipoProducto,
    UnidadNegocio,
)
from app.models.inventario import ConsumoPieza, Material, MovimientoStock, PiezaLoteMaterial
from app.models.orden import Orden, OrdenItem, OrdenMaterial, PagoOrden
from app.models.producto import Producto, ProductoMaterial
from app.models.unidad import Unidad
from app.models.usuario import Usuario

__all__ = [
    "Base",
    "Auditoria",
    "CierreCaja",
    "Cliente",
    "ConsumoPieza",
    "Material",
    "MovimientoStock",
    "Orden",
    "OrdenItem",
    "OrdenMaterial",
    "PagoOrden",
    "PiezaLoteMaterial",
    "Producto",
    "ProductoMaterial",
    "Unidad",
    "Usuario",
    "EstadoCierre",
    "EstadoOrden",
    "EstadoPago",
    "EstadoPieza",
    "MetodoPago",
    "MotivoMovimiento",
    "MotivoObservacionPago",
    "Rol",
    "TipoCliente",
    "TipoDocumento",
    "TipoEventoAuditoria",
    "TipoFormatoMaterial",
    "TipoPago",
    "TipoProducto",
    "UnidadNegocio",
]
