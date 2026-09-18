"""Inventario de materiales y su historial de movimientos."""
from decimal import Decimal
from typing import Optional

from sqlalchemy import Boolean, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TemporalMixin, enum_columna
from app.models.enums import MotivoMovimiento


class Material(Base, TemporalMixin):
    __tablename__ = "materiales"

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120), unique=True, index=True, nullable=False)
    unidad_id: Mapped[int] = mapped_column(ForeignKey("unidades.id"), nullable=False)
    stock_actual: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0, nullable=False)
    alerta_minima: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0, nullable=False)
    dias_reabastecimiento: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    activo: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    unidad = relationship("Unidad", lazy="joined")

    @property
    def stock_bajo(self) -> bool:
        """RF-08: alerta visual cuando el stock cae en el punto de pedido."""
        return self.stock_actual <= self.alerta_minima


class MovimientoStock(Base, TemporalMixin):
    """
    Cada entrada o salida de un material, con su motivo.

    Es la trazabilidad que el cuaderno no daba: quién movió qué, cuándo y por
    qué orden. `delta` negativo descuenta (reserva, merma) y positivo devuelve
    (liberación por cancelación, devolución de sobrante, ajuste manual).
    """

    __tablename__ = "movimientos_stock"

    id: Mapped[int] = mapped_column(primary_key=True)
    material_id: Mapped[int] = mapped_column(ForeignKey("materiales.id"), nullable=False, index=True)
    orden_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("ordenes.id"), nullable=True, index=True
    )
    usuario_id: Mapped[Optional[int]] = mapped_column(ForeignKey("usuarios.id"), nullable=True)
    delta: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    stock_resultante: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    motivo: Mapped[MotivoMovimiento] = mapped_column(
        enum_columna(MotivoMovimiento, "motivo_movimiento", 20), nullable=False
    )
    nota: Mapped[str] = mapped_column(Text, default="", nullable=False)

    material = relationship("Material", lazy="joined")
    usuario = relationship("Usuario", lazy="joined")
