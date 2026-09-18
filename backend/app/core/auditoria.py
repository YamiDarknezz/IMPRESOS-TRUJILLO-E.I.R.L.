"""Registro de auditoría.

Cada operación crítica deja una entrada con el usuario, la acción, el registro
afectado, los valores anteriores/nuevos y la IP de la petición. Se agrega a la
misma transacción de la operación: si la operación se revierte, la entrada
también (no se audita lo que no ocurrió).
"""
from typing import Any, Optional

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.contexto import ip_cliente
from app.models import Auditoria, TipoEventoAuditoria


def registrar(
    sesion: AsyncSession,
    usuario_id: Optional[int],
    accion: TipoEventoAuditoria,
    *,
    tabla_afectada: str = "",
    registro_id: str = "",
    detalle: str = "",
    valores_anteriores: Optional[Any] = None,
    valores_nuevos: Optional[Any] = None,
) -> None:
    """
    Encola una entrada de auditoría en la sesión actual.

    No lanza excepciones: el registro nunca debe interrumpir la operación
    principal.
    """
    try:
        sesion.add(
            Auditoria(
                usuario_id=usuario_id,
                accion=accion,
                tabla_afectada=tabla_afectada,
                registro_id=str(registro_id),
                detalle=detalle,
                valores_anteriores=valores_anteriores,
                valores_nuevos=valores_nuevos,
                ip=ip_cliente.get(),
            )
        )
    except Exception:  # pragma: no cover - defensivo
        pass
