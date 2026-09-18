"""Catálogo de unidades de medida (D7: la unidad sale de catálogo, no se tipea)."""
from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TemporalMixin


class Unidad(Base, TemporalMixin):
    __tablename__ = "unidades"

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    abreviatura: Mapped[str] = mapped_column(String(10), default="", nullable=False)
    activo: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
