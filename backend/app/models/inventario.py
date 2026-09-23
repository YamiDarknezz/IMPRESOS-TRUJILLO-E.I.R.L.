"""Inventario de materiales, piezas pre-dimensionadas / rollos y su historial."""
from datetime import datetime
from decimal import Decimal
from typing import List, Optional

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TemporalMixin, enum_columna
from app.models.enums import EstadoPieza, MotivoMovimiento, TipoFormatoMaterial


class Material(Base, TemporalMixin):
    __tablename__ = "materiales"

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120), unique=True, index=True, nullable=False)
    unidad_id: Mapped[int] = mapped_column(ForeignKey("unidades.id"), nullable=False)
    stock_actual: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0, nullable=False)
    alerta_minima: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0, nullable=False)
    dias_reabastecimiento: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    activo: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # ── Gestión de compras, formato y almacén físico ────────────────────────
    precio_compra: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0, nullable=False)
    ubicacion_estante: Mapped[str] = mapped_column(String(120), default="", nullable=False)
    tipo_formato: Mapped[TipoFormatoMaterial] = mapped_column(
        enum_columna(TipoFormatoMaterial, "tipo_formato_material", 25),
        default=TipoFormatoMaterial.UNIDAD_PIEZA,
        nullable=False,
    )
    ancho_predeterminado_m: Mapped[Optional[Decimal]] = mapped_column(Numeric(8, 2), nullable=True)
    largo_predeterminado_m: Mapped[Optional[Decimal]] = mapped_column(Numeric(8, 2), nullable=True)
    espesor_mm: Mapped[Optional[Decimal]] = mapped_column(Numeric(6, 2), nullable=True)

    unidad = relationship("Unidad", lazy="joined")
    piezas: Mapped[List["PiezaLoteMaterial"]] = relationship(
        back_populates="material", cascade="all, delete-orphan", lazy="selectin"
    )

    @property
    def stock_bajo(self) -> bool:
        """RF-08: alerta visual cuando el stock cae en el punto de pedido."""
        return self.stock_actual <= self.alerta_minima


class PiezaLoteMaterial(Base, TemporalMixin):
    """
    Rollo continuo (p. ej. UV DTF Film A / B de 100m) o Plancha rígida pre-dimensionada
    (p. ej. MDF 2.44x1.22m, Acrílico 60x40cm) con trazabilidad unitaria y cálculo de ganancia.
    """

    __tablename__ = "piezas_lote_material"

    id: Mapped[int] = mapped_column(primary_key=True)
    material_id: Mapped[int] = mapped_column(ForeignKey("materiales.id"), nullable=False, index=True)
    codigo_identificador: Mapped[str] = mapped_column(String(60), nullable=False, index=True)
    ancho_m: Mapped[Optional[Decimal]] = mapped_column(Numeric(8, 2), nullable=True)
    largo_m: Mapped[Optional[Decimal]] = mapped_column(Numeric(8, 2), nullable=True)
    espesor_mm: Mapped[Optional[Decimal]] = mapped_column(Numeric(6, 2), nullable=True)

    capacidad_inicial: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    saldo_restante: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    unidad_medida: Mapped[str] = mapped_column(String(20), default="m", nullable=False)
    costo_adquisicion: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0, nullable=False)

    estado: Mapped[EstadoPieza] = mapped_column(
        enum_columna(EstadoPieza, "estado_pieza", 20),
        default=EstadoPieza.DISPONIBLE,
        nullable=False,
    )
    ubicacion: Mapped[str] = mapped_column(String(120), default="", nullable=False)
    maquina_asignada: Mapped[str] = mapped_column(String(120), default="", nullable=False)
    fecha_ingreso: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    fecha_termino: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    nota: Mapped[str] = mapped_column(Text, default="", nullable=False)

    material = relationship("Material", back_populates="piezas", lazy="joined")
    consumos: Mapped[List["ConsumoPieza"]] = relationship(
        back_populates="pieza", cascade="all, delete-orphan", lazy="selectin"
    )

    @property
    def total_recaudado(self) -> Decimal:
        return sum((Decimal(str(c.monto_cobrado)) for c in self.consumos), Decimal("0.00"))

    @property
    def ganancia_neta(self) -> Decimal:
        return Decimal(str(self.total_recaudado)) - Decimal(str(self.costo_adquisicion))


class ConsumoPieza(Base, TemporalMixin):
    """Registro individual de corte/uso de un rollo o plancha pre-dimensionada."""

    __tablename__ = "consumos_pieza"

    id: Mapped[int] = mapped_column(primary_key=True)
    pieza_id: Mapped[int] = mapped_column(
        ForeignKey("piezas_lote_material.id", ondelete="CASCADE"), nullable=False, index=True
    )
    orden_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("ordenes.id"), nullable=True, index=True
    )
    usuario_id: Mapped[Optional[int]] = mapped_column(ForeignKey("usuarios.id"), nullable=True)

    trabajo_descripcion: Mapped[str] = mapped_column(String(250), nullable=False)
    cantidad_consumida: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    saldo_anterior: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    saldo_nuevo: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    monto_cobrado: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0, nullable=False)
    merma_desperdicio: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0, nullable=False)
    fecha: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    nota: Mapped[str] = mapped_column(Text, default="", nullable=False)

    pieza = relationship("PiezaLoteMaterial", back_populates="consumos", lazy="joined")
    orden = relationship("Orden", lazy="joined")
    usuario = relationship("Usuario", lazy="joined")


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
