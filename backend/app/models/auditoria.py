"""Registro de auditoría inmutable (RNF-03).

Se escribe desde cada operación crítica y solo se lee desde el panel de
auditoría. Nunca se edita ni se borra.
"""
from typing import Any, Optional

from sqlalchemy import JSON, BigInteger, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.fechas import ahora_utc
from app.models.base import Base
from app.models.enums import TipoEventoAuditoria
from app.models.base import enum_columna
from datetime import datetime
from sqlalchemy import DateTime


class Auditoria(Base):
    __tablename__ = "auditoria"

    # BIGSERIAL en PostgreSQL; en SQLite (pruebas) un INTEGER autoincremental.
    id: Mapped[int] = mapped_column(
        BigInteger().with_variant(Integer, "sqlite"), primary_key=True
    )
    usuario_id: Mapped[Optional[int]] = mapped_column(ForeignKey("usuarios.id"), nullable=True)
    accion: Mapped[TipoEventoAuditoria] = mapped_column(
        enum_columna(TipoEventoAuditoria, "tipo_evento_auditoria", 20), nullable=False
    )
    tabla_afectada: Mapped[str] = mapped_column(String(60), default="", nullable=False)
    registro_id: Mapped[str] = mapped_column(String(40), default="", nullable=False)
    detalle: Mapped[str] = mapped_column(Text, default="", nullable=False)
    # Valores anteriores/nuevos exigidos por RNF-03, en JSON para no atarse a
    # una forma de cada tabla.
    valores_anteriores: Mapped[Optional[Any]] = mapped_column(JSON, nullable=True)
    valores_nuevos: Mapped[Optional[Any]] = mapped_column(JSON, nullable=True)
    ip: Mapped[str] = mapped_column(String(45), default="", nullable=False)
    fecha: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=ahora_utc, nullable=False, index=True
    )

    usuario = relationship("Usuario", lazy="joined")
