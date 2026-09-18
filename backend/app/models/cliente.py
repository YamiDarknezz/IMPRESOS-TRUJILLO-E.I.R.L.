"""Clientes de la imprenta."""
from sqlalchemy import Boolean, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TemporalMixin, enum_columna
from app.models.enums import TipoCliente


class Cliente(Base, TemporalMixin):
    """
    Solo el nombre es obligatorio: muchos trabajos son rápidos e informales y
    no siempre se piden los datos de contacto (decisión de alcance del SRS).
    """

    __tablename__ = "clientes"

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(150), index=True, nullable=False)
    tipo: Mapped[TipoCliente] = mapped_column(
        enum_columna(TipoCliente, "tipo_cliente", 10), default=TipoCliente.PERSONA, nullable=False
    )
    documento: Mapped[str] = mapped_column(String(20), default="", nullable=False)  # DNI o RUC
    telefono: Mapped[str] = mapped_column(String(30), default="", nullable=False)
    email: Mapped[str] = mapped_column(String(150), default="", nullable=False)
    direccion: Mapped[str] = mapped_column(String(200), default="", nullable=False)
    notas: Mapped[str] = mapped_column(Text, default="", nullable=False)

    # Órdenes corporativas (ej. Cámara de Comercio): se exceptúan del adelanto
    # mínimo del RN-01 y se atienden con orden de compra formal.
    es_corporativo: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Borrado lógico: nunca se elimina un cliente con historial.
    activo: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
