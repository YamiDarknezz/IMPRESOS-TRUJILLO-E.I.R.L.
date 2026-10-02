"""Comprobantes de pago: capturas de Yape o transferencia (RF-11).

El cliente pidió adjuntar la captura dentro de cada orden, como sustituto de
integrarse con la API de WhatsApp: es el mecanismo de conciliación que eligió
por costo y lo que hoy vive en el celular de la secretaria.

Del archivo se guarda la clave con la que está almacenado, no su ruta: el
almacén puede pasar de un disco del VPS a Cloudflare sin tocar la base.
"""
from typing import Optional

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TemporalMixin


class Comprobante(Base, TemporalMixin):
    """Una captura adjunta a una orden o a uno de sus pagos."""

    __tablename__ = "comprobantes"

    id: Mapped[int] = mapped_column(primary_key=True)
    orden_id: Mapped[int] = mapped_column(
        ForeignKey("ordenes.id", ondelete="CASCADE"), nullable=False, index=True
    )
    # Nulo cuando la captura es del adelanto acordado al crear la orden.
    pago_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("orden_pagos.id", ondelete="CASCADE"), nullable=True, index=True
    )

    # Clave aleatoria con la que el archivo vive en el almacén. No se deriva de
    # la orden ni del pago: quien no tenga permiso no puede adivinar la de otro.
    clave: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    # Nombre que traía el archivo, solo para mostrarlo; nunca se usa para ubicarlo.
    nombre_original: Mapped[str] = mapped_column(String(200), default="", nullable=False)
    tipo_mime: Mapped[str] = mapped_column(String(60), default="", nullable=False)
    tamano_bytes: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    subido_por: Mapped[Optional[int]] = mapped_column(
        ForeignKey("usuarios.id"), nullable=True
    )

    orden = relationship("Orden", back_populates="comprobantes")
    pago = relationship("PagoOrden", back_populates="comprobantes")
    usuario = relationship("Usuario", foreign_keys=[subido_por], lazy="joined")
