"""Órdenes de trabajo: contrato/proforma, ítems, materiales y pagos.

El modelo refleja el talonario físico de la empresa (ver
`docs/contexto/contexto_oficina_hardware.txt`): Nr correlativo, Tipo
(Contrato/Proforma), Cliente, Dirección, Teléfono, ACTA, SALDO, TOTAL, FECHA
ENTREGA e INCLUYE IGV.
"""
from datetime import date, datetime
from decimal import Decimal
from typing import List, Optional

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    Numeric,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.fechas import ahora_utc
from app.models.base import Base, TemporalMixin, enum_columna
from app.models.enums import (
    EstadoOrden,
    EstadoPago,
    MetodoPago,
    MotivoObservacionPago,
    TipoDocumento,
    TipoPago,
    UnidadNegocio,
)


class Orden(Base, TemporalMixin):
    __tablename__ = "ordenes"

    id: Mapped[int] = mapped_column(primary_key=True)
    tipo_documento: Mapped[TipoDocumento] = mapped_column(
        enum_columna(TipoDocumento, "tipo_documento", 10),
        default=TipoDocumento.CONTRATO,
        nullable=False,
    )
    cliente_id: Mapped[int] = mapped_column(ForeignKey("clientes.id"), nullable=False)
    # Snapshot tomado al crear la orden: el contrato impreso debe mostrar los
    # datos pactados aunque después el cliente actualice su ficha.
    direccion: Mapped[str] = mapped_column(String(200), default="", nullable=False)
    telefono: Mapped[str] = mapped_column(String(30), default="", nullable=False)

    asignado_a: Mapped[Optional[int]] = mapped_column(ForeignKey("usuarios.id"), nullable=True)
    creado_por: Mapped[int] = mapped_column(ForeignKey("usuarios.id"), nullable=False)
    descripcion: Mapped[str] = mapped_column(Text, nullable=False)

    unidad_negocio: Mapped[UnidadNegocio] = mapped_column(
        enum_columna(UnidadNegocio, "unidad_negocio", 20),
        default=UnidadNegocio.IMPRENTA,
        nullable=False,
    )
    estado: Mapped[EstadoOrden] = mapped_column(
        enum_columna(EstadoOrden, "estado_orden", 20),
        default=EstadoOrden.PENDIENTE,
        nullable=False,
        index=True,
    )

    fecha_entrega: Mapped[date] = mapped_column(Date, nullable=False)

    # ── Contrato: montos ────────────────────────────────────────────────────
    incluye_igv: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    subtotal: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0, nullable=False)
    igv: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0, nullable=False)
    descuento: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0, nullable=False)
    motivo_descuento: Mapped[str] = mapped_column(String(200), default="", nullable=False)
    total: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0, nullable=False)

    # ── Estado financiero (se recalcula con cada pago) ──────────────────────
    adelanto: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0, nullable=False)
    saldo_pendiente: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0, nullable=False)
    pagado_totalmente: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    metodo_pago_adelanto: Mapped[MetodoPago] = mapped_column(
        enum_columna(MetodoPago, "metodo_pago", 15),
        default=MetodoPago.EFECTIVO,
        nullable=False,
    )

    finalizada_en: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    entregada_en: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    # ── Relaciones ──────────────────────────────────────────────────────────
    cliente = relationship("Cliente", lazy="joined")
    asignado = relationship("Usuario", foreign_keys=[asignado_a], lazy="joined")
    items: Mapped[List["OrdenItem"]] = relationship(
        back_populates="orden", cascade="all, delete-orphan", lazy="selectin"
    )
    materiales: Mapped[List["OrdenMaterial"]] = relationship(
        back_populates="orden", cascade="all, delete-orphan", lazy="selectin"
    )
    pagos: Mapped[List["PagoOrden"]] = relationship(
        back_populates="orden", cascade="all, delete-orphan", lazy="selectin"
    )

    @property
    def codigo(self) -> str:
        """Nr correlativo del talonario: ORD-000123."""
        return f"ORD-{self.id:06d}"


class OrdenItem(Base, TemporalMixin):
    """Línea del contrato: puede ser un producto con medidas (alto x ancho)."""

    __tablename__ = "orden_items"

    id: Mapped[int] = mapped_column(primary_key=True)
    orden_id: Mapped[int] = mapped_column(
        ForeignKey("ordenes.id", ondelete="CASCADE"), nullable=False, index=True
    )
    producto_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("productos.id"), nullable=True
    )
    descripcion: Mapped[str] = mapped_column(String(300), nullable=False)
    ancho_m: Mapped[Optional[Decimal]] = mapped_column(Numeric(8, 2), nullable=True)
    alto_m: Mapped[Optional[Decimal]] = mapped_column(Numeric(8, 2), nullable=True)
    cantidad: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=1, nullable=False)
    precio_unitario: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0, nullable=False)
    importe: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0, nullable=False)

    orden = relationship("Orden", back_populates="items")
    producto = relationship("Producto", lazy="joined")


class OrdenMaterial(Base, TemporalMixin):
    """
    Material comprometido con una orden.

    Al crear la orden se descuenta la cantidad estimada del inventario
    (reserva). Al finalizar la producción se guarda la cantidad real y la
    diferencia se ajusta: de más es merma, de menos es devolución.
    """

    __tablename__ = "orden_materiales"

    id: Mapped[int] = mapped_column(primary_key=True)
    orden_id: Mapped[int] = mapped_column(
        ForeignKey("ordenes.id", ondelete="CASCADE"), nullable=False, index=True
    )
    material_id: Mapped[int] = mapped_column(ForeignKey("materiales.id"), nullable=False)
    # Snapshot del nombre y la unidad por si el catálogo cambia después.
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    unidad: Mapped[str] = mapped_column(String(10), default="", nullable=False)
    cantidad_estimada: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0, nullable=False)
    cantidad_real: Mapped[Optional[Decimal]] = mapped_column(Numeric(12, 2), nullable=True)

    orden = relationship("Orden", back_populates="materiales")
    material = relationship("Material", lazy="joined")


class PagoOrden(Base, TemporalMixin):
    """Evento de pago (D4): fecha real, monto, método y tipo."""

    __tablename__ = "orden_pagos"

    id: Mapped[int] = mapped_column(primary_key=True)
    orden_id: Mapped[int] = mapped_column(
        ForeignKey("ordenes.id", ondelete="CASCADE"), nullable=False, index=True
    )
    fecha: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=ahora_utc, nullable=False
    )
    monto: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    metodo: Mapped[MetodoPago] = mapped_column(
        enum_columna(MetodoPago, "metodo_pago", 15), nullable=False
    )
    tipo: Mapped[TipoPago] = mapped_column(
        enum_columna(TipoPago, "tipo_pago", 10), nullable=False
    )
    registrado_por: Mapped[Optional[int]] = mapped_column(
        ForeignKey("usuarios.id"), nullable=True
    )
    # Referencia del voucher/captura de Yape o transferencia (RF-11).
    referencia: Mapped[str] = mapped_column(String(120), default="", nullable=False)

    # Conciliación y auditoría de pagos (Yape falso, billete falso, etc.)
    estado_pago: Mapped[EstadoPago] = mapped_column(
        enum_columna(EstadoPago, "estado_pago", 15),
        default=EstadoPago.CONFORME,
        nullable=False,
    )
    motivo_observacion: Mapped[Optional[MotivoObservacionPago]] = mapped_column(
        enum_columna(MotivoObservacionPago, "motivo_observacion_pago", 30),
        nullable=True,
    )
    nota_observacion: Mapped[str] = mapped_column(Text, default="", nullable=False)
    observado_por: Mapped[Optional[int]] = mapped_column(
        ForeignKey("usuarios.id"), nullable=True
    )
    observado_en: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    orden = relationship("Orden", back_populates="pagos")
    usuario = relationship("Usuario", foreign_keys=[registrado_por], lazy="joined")
    observador = relationship("Usuario", foreign_keys=[observado_por], lazy="joined")

