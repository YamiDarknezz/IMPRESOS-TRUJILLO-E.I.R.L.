"""Errores del sistema.

La capa de servicios lanza estas excepciones de dominio, que no saben nada de
HTTP. `main.py` registra un manejador global que las traduce al código de
estado correcto. Gracias a eso los routers no repiten try/except en cada
endpoint, y un error interno nunca filtra detalles al cliente.
"""
import logging

logger = logging.getLogger("impresos_trujillo")

MENSAJE_ERROR_INTERNO = "Error interno del servidor."


class ErrorDeNegocio(Exception):
    """
    El usuario pidió algo que las reglas del negocio no permiten.
    Su mensaje SÍ se muestra al cliente, así que debe ser claro y accionable.
    """

    estado_http = 400


class NoEncontrado(ErrorDeNegocio):
    """El recurso solicitado no existe."""

    estado_http = 404


class PermisoDenegado(ErrorDeNegocio):
    """El usuario está autenticado pero no puede hacer esta operación."""

    estado_http = 403


class Conflicto(ErrorDeNegocio):
    """Choca con algo que ya existe (duplicado, pago ya confirmado...)."""

    estado_http = 409
