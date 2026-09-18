"""Enumeraciones del dominio.

Viven en un solo módulo porque las usan tanto los modelos ORM como los
esquemas Pydantic, y duplicarlas sería la forma más fácil de que se
desincronicen.
"""
from enum import StrEnum


class Rol(StrEnum):
    """Roles del sistema (SRS, sección Clases y características de usuarios)."""

    ADMIN = "admin"
    SUBGERENTE = "subgerente"
    SECRETARIA = "secretaria"
    DISENADORA = "disenadora"
    OPERARIO = "operario"


class TipoCliente(StrEnum):
    PERSONA = "persona"
    EMPRESA = "empresa"


class TipoProducto(StrEnum):
    PROPIO = "propio"
    SERVICIO = "servicio"
    SUBCONTRATADO = "subcontratado"


class EstadoOrden(StrEnum):
    """Pipeline de producción. 'cancelada' queda fuera del flujo normal."""

    PENDIENTE = "pendiente"
    EN_DISENO = "en_diseno"
    APROBADO = "aprobado"
    EN_PRODUCCION = "en_produccion"
    FINALIZADA = "finalizada"
    ENTREGADA = "entregada"
    CANCELADA = "cancelada"


class TipoDocumento(StrEnum):
    """Formato del talonario digital: Contrato / Proforma."""

    CONTRATO = "contrato"
    PROFORMA = "proforma"


class UnidadNegocio(StrEnum):
    """Las dos líneas de negocio que exigen caja separada (RN-05)."""

    IMPRENTA = "imprenta"
    GIGANTOGRAFIAS = "gigantografias"


class MetodoPago(StrEnum):
    EFECTIVO = "efectivo"
    YAPE = "yape"
    TRANSFERENCIA = "transferencia"


class TipoPago(StrEnum):
    ADELANTO = "adelanto"
    SALDO = "saldo"


class MotivoMovimiento(StrEnum):
    """Por qué se movió el stock de un material."""

    RESERVA = "reserva"
    LIBERACION = "liberacion"
    MERMA = "merma"
    DEVOLUCION = "devolucion"
    AJUSTE_MANUAL = "ajuste_manual"


class EstadoCierre(StrEnum):
    CERRADO = "cerrado"
    CONGELADO = "congelado"


class TipoEventoAuditoria(StrEnum):
    CREAR = "crear"
    EDITAR = "editar"
    ELIMINAR = "eliminar"
    CAMBIO_ESTADO = "cambio_estado"
    PAGO = "pago"
    AJUSTE_STOCK = "ajuste_stock"
    SESION = "sesion"
    CIERRE_CAJA = "cierre_caja"
