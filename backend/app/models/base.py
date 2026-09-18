"""Base declarativa y utilidades compartidas por los modelos."""
from datetime import datetime

from sqlalchemy import DateTime, Enum as SAEnum, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    """Base declarativa de SQLAlchemy 2.0 para todos los modelos."""


class TemporalMixin:
    """Columnas de auditoría temporal presentes en casi todas las tablas."""

    creado_en: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    actualizado_en: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


def enum_columna(enum_clase, nombre: str, longitud: int = 30) -> SAEnum:
    """
    Columna de enum que guarda los VALORES (no los nombres) del enum.

    Se usa `native_enum=False` (VARCHAR + CHECK) para que las migraciones no
    tengan que alterar tipos nativos de PostgreSQL cada vez que se agrega una
    opción, y `values_callable` para que en la base diga "en_diseno" y no
    "EN_DISENO".
    """
    return SAEnum(
        enum_clase,
        name=nombre,
        native_enum=False,
        length=longitud,
        validate_strings=True,
        values_callable=lambda clase: [miembro.value for miembro in clase],
    )
