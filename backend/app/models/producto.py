"""Catálogo de productos/servicios y su receta de materiales (D8)."""
from decimal import Decimal
from typing import List

from sqlalchemy import Boolean, ForeignKey, Numeric, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TemporalMixin, enum_columna
from app.models.enums import TipoProducto


class Producto(Base, TemporalMixin):
    __tablename__ = "productos"

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(150), unique=True, index=True, nullable=False)
    tipo: Mapped[TipoProducto] = mapped_column(
        enum_columna(TipoProducto, "tipo_producto", 15),
        default=TipoProducto.PROPIO,
        nullable=False,
    )
    precio_base: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0, nullable=False)
    notas: Mapped[str] = mapped_column(Text, default="", nullable=False)
    activo: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    receta: Mapped[List["ProductoMaterial"]] = relationship(
        back_populates="producto", cascade="all, delete-orphan", lazy="selectin"
    )


class ProductoMaterial(Base, TemporalMixin):
    """
    Una línea de la receta: cuánto material consume una unidad del producto.

    Al crear una orden, la receta autocompleta los materiales estimados
    (RF-16); el consumo real se reporta al finalizar (RF-07).
    """

    __tablename__ = "producto_materiales"
    __table_args__ = (UniqueConstraint("producto_id", "material_id", name="producto_material_unico"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    producto_id: Mapped[int] = mapped_column(
        ForeignKey("productos.id", ondelete="CASCADE"), nullable=False
    )
    material_id: Mapped[int] = mapped_column(ForeignKey("materiales.id"), nullable=False)
    cantidad: Mapped[Decimal] = mapped_column(Numeric(12, 4), nullable=False)

    producto = relationship("Producto", back_populates="receta")
    material = relationship("Material", lazy="joined")
