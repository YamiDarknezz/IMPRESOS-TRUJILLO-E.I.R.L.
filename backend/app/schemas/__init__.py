"""Esquemas Pydantic de entrada y envolturas de respuesta."""
from app.schemas.comunes import RespuestaExitosa, RespuestaItem, RespuestaLista
from app.schemas.auth import CambiarPasswordData, LoginData
from app.schemas.caja import CerrarCajaData, CongelarCajaData, ObservarPagoData
from app.schemas.cliente import ClienteCreateData, ClienteUpdateData
from app.schemas.inventario import (
    ConsumoPiezaCreateData,
    MaterialCreateData,
    MaterialEditData,
    MaterialStockData,
    PiezaLoteCreateData,
)
from app.schemas.orden import (
    AsignarData,
    CambiarEstadoData,
    ConfirmarPagoData,
    MaterialEstimado,
    OrdenCompletionData,
    OrdenCreateData,
    OrdenItemData,
    VentaRapidaData,
)
from app.schemas.producto import ProductoCreateData, ProductoUpdateData, RecetaItem
from app.schemas.unidad import UnidadCreateData, UnidadUpdateData
from app.schemas.usuario import UsuarioCreateData, UsuarioUpdateData

__all__ = [
    "RespuestaExitosa",
    "RespuestaItem",
    "RespuestaLista",
    "CambiarPasswordData",
    "LoginData",
    "CerrarCajaData",
    "CongelarCajaData",
    "ObservarPagoData",
    "ClienteCreateData",
    "ClienteUpdateData",
    "ConsumoPiezaCreateData",
    "MaterialCreateData",
    "MaterialEditData",
    "MaterialStockData",
    "PiezaLoteCreateData",
    "AsignarData",
    "CambiarEstadoData",
    "ConfirmarPagoData",
    "MaterialEstimado",
    "OrdenCompletionData",
    "OrdenCreateData",
    "OrdenItemData",
    "VentaRapidaData",
    "ProductoCreateData",
    "ProductoUpdateData",
    "RecetaItem",
    "UnidadCreateData",
    "UnidadUpdateData",
    "UsuarioCreateData",
    "UsuarioUpdateData",
]
