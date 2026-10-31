"""Última ejecución y pronóstico publicable, sin datos personales ni binarios."""
from sqlalchemy import JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class PronosticoIA(Base):
    __tablename__ = "pronosticos_ia"

    id: Mapped[int] = mapped_column(primary_key=True)
    resultado: Mapped[dict] = mapped_column(JSON, nullable=False)
    pronostico: Mapped[dict | None] = mapped_column(JSON, nullable=True)
