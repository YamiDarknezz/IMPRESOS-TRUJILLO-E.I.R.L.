"""Parámetros y catálogos del negocio, en un solo lugar (#54).

Lo que la pantalla necesita saber de las reglas del negocio —porcentajes y
listas de valores con su nombre legible— sale de aquí y se publica en
`GET /api/configuracion`. El frontend ya no los escribe a mano.

El nombre legible de cada valor se escribe una sola vez. Cuando se agregó
`observacion_pago` al enum de auditoría, en la pantalla siguió apareciendo el
texto crudo porque la copia del frontend nadie la actualizó.
"""
from app.core.config import settings
from app.models.enums import (
    CanalIngreso,
    EstadoPago,
    MetodoPago,
    MotivoMovimiento,
    MotivoObservacionPago,
    TipoEventoAuditoria,
    TipoPago,
)

# ── Nombres legibles ────────────────────────────────────────────────────────

ETIQUETA_METODO_PAGO = {
    MetodoPago.EFECTIVO: "Efectivo",
    MetodoPago.YAPE: "Yape",
    MetodoPago.TRANSFERENCIA: "Transferencia",
}

ETIQUETA_CANAL_INGRESO = {
    CanalIngreso.WHATSAPP: "WhatsApp",
    CanalIngreso.LLAMADA: "Llamada",
    CanalIngreso.PRESENCIAL: "Presencial",
    CanalIngreso.CORREO: "Correo",
    CanalIngreso.OTRO: "Otro",
}

ETIQUETA_TIPO_PAGO = {
    TipoPago.ADELANTO: "Adelanto",
    TipoPago.SALDO: "Saldo",
}

ETIQUETA_ESTADO_PAGO = {
    EstadoPago.CONFORME: "Conforme",
    EstadoPago.OBSERVADO: "Observado",
    EstadoPago.ANULADO: "Anulado",
}

# Se conservan los textos que la pantalla de Caja ya mostraba: el catálogo
# unifica el origen, no cambia lo que el usuario lee.
ETIQUETA_MOTIVO_OBSERVACION = {
    MotivoObservacionPago.YAPE_FALSO: "Yape falso / Captura trucada",
    MotivoObservacionPago.BILLETE_FALSO: "Billete falso",
    MotivoObservacionPago.VOUCHER_NO_UBICADO: "Voucher no encontrado en cuenta",
    MotivoObservacionPago.COBRO_DUPLICADO: "Cobro duplicado",
    MotivoObservacionPago.ERROR_DIGITACION: "Error de digitación",
    MotivoObservacionPago.OTRO: "Otro motivo",
}

ETIQUETA_MOTIVO_MOVIMIENTO = {
    MotivoMovimiento.RESERVA: "Reserva por orden",
    MotivoMovimiento.LIBERACION: "Liberación",
    MotivoMovimiento.MERMA: "Merma",
    MotivoMovimiento.DEVOLUCION: "Devolución",
    MotivoMovimiento.AJUSTE_MANUAL: "Ajuste manual",
}

ETIQUETA_ACCION = {
    TipoEventoAuditoria.CREAR: "Crear",
    TipoEventoAuditoria.EDITAR: "Editar",
    TipoEventoAuditoria.ELIMINAR: "Eliminar",
    TipoEventoAuditoria.CAMBIO_ESTADO: "Cambio de estado",
    TipoEventoAuditoria.PAGO: "Pago",
    TipoEventoAuditoria.AJUSTE_STOCK: "Ajuste de stock",
    TipoEventoAuditoria.SESION: "Sesión",
    TipoEventoAuditoria.SESION_FALLIDA: "Intento de sesión fallido",
    TipoEventoAuditoria.CIERRE_CAJA: "Cierre de caja",
    TipoEventoAuditoria.OBSERVACION_PAGO: "Observación de pago",
}


def _como_lista(enum, etiquetas: dict) -> list[dict[str, str]]:
    """
    Lista de {valor, etiqueta} en el orden del enum.

    Se recorre el enum (no el diccionario) a propósito: si mañana se agrega un
    valor sin nombre legible, el que falta se ve enseguida porque aparece con su
    propio texto. Un test comprueba que los dos conjuntos coincidan.
    """
    return [
        {"valor": miembro.value, "etiqueta": etiquetas.get(miembro, miembro.value)}
        for miembro in enum
    ]


def parametros() -> dict[str, float]:
    """Números configurables del negocio (los que el frontend calculaba a mano)."""
    return {
        "igv_porcentaje": settings.igv_porcentaje,
        "adelanto_minimo_porcentaje": settings.adelanto_minimo_porcentaje,
    }


def catalogos() -> dict[str, list[dict[str, str]]]:
    """Listas de valores con su nombre legible, para los desplegables y las tablas."""
    return {
        "metodos_pago": _como_lista(MetodoPago, ETIQUETA_METODO_PAGO),
        "canales_ingreso": _como_lista(CanalIngreso, ETIQUETA_CANAL_INGRESO),
        "tipos_pago": _como_lista(TipoPago, ETIQUETA_TIPO_PAGO),
        "estados_pago": _como_lista(EstadoPago, ETIQUETA_ESTADO_PAGO),
        "motivos_observacion": _como_lista(MotivoObservacionPago, ETIQUETA_MOTIVO_OBSERVACION),
        "motivos_movimiento": _como_lista(MotivoMovimiento, ETIQUETA_MOTIVO_MOVIMIENTO),
        "acciones_auditoria": _como_lista(TipoEventoAuditoria, ETIQUETA_ACCION),
    }
