"""Cierre y arqueo diario de caja, segregado por unidad de negocio (RF-12 a RF-14)."""
from datetime import date
from decimal import Decimal
from typing import Optional

from sqlalchemy import Date, ForeignKey, Numeric, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TemporalMixin, enum_columna
from app.models.enums import EstadoCierre, UnidadNegocio


class CierreCaja(Base, TemporalMixin):
    """
    Arqueo de un usuario para una unidad de negocio en una fecha.

    Cada usuario liquida lo que cobró (efectivo, Yape, transferencia) y la
    Gerencia congela el cierre del día. Prohibido mezclar fondos de Imprenta
    con los de Gigantografías (RN-05): por eso la unidad es parte de la clave.
    """

    __tablename__ = "cierres_caja"
    __table_args__ = (
        UniqueConstraint(
            "fecha", "unidad_negocio", "usuario_id", name="cierre_unico_dia_unidad_usuario"
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    fecha: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    unidad_negocio: Mapped[UnidadNegocio] = mapped_column(
        enum_columna(UnidadNegocio, "unidad_negocio", 20), nullable=False
    )
    usuario_id: Mapped[int] = mapped_column(ForeignKey("usuarios.id"), nullable=False)

    monto_efectivo: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0, nullable=False)
    monto_yape: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0, nullable=False)
    monto_transferencia: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0, nullable=False)
    total: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0, nullable=False)

    estado: Mapped[EstadoCierre] = mapped_column(
        enum_columna(EstadoCierre, "estado_cierre", 15),
        default=EstadoCierre.CERRADO,
        nullable=False,
    )
    validado_por: Mapped[Optional[int]] = mapped_column(ForeignKey("usuarios.id"), nullable=True)
    observacion: Mapped[str] = mapped_column(Text, default="", nullable=False)

    usuario = relationship("Usuario", foreign_keys=[usuario_id], lazy="joined")
    validador = relationship("Usuario", foreign_keys=[validado_por], lazy="joined")
