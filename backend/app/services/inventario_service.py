"""Ajuste de stock dentro de una transacción.

Toda operación que mueve inventario (crear, editar, cancelar y completar una
orden, o un ajuste manual) pasa por aquí. El patrón es siempre el mismo: se
leen y validan TODOS los materiales antes de escribir, y cada movimiento queda
registrado en `movimientos_stock` con su motivo.

Intercalar lecturas y escrituras en un bucle falla con dos o más materiales:
por eso las fases de este módulo están separadas y el código vive en un solo
lugar en vez de repetirse en cada operación.
"""
from dataclasses import dataclass
from decimal import Decimal
from typing import Iterable, Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.errores import Conflicto, ErrorDeNegocio, NoEncontrado
from app.core.fechas import ahora_utc
from app.models import (
    ConsumoPieza,
    EstadoPieza,
    Material,
    MotivoMovimiento,
    MovimientoStock,
    PiezaLoteMaterial,
    Usuario,
)
from app.schemas.inventario import ConsumoPiezaCreateData, PiezaLoteCreateData


@dataclass(frozen=True)
class AjusteStock:
    """
    Un cambio pendiente sobre el stock de un material.

    `delta` negativo descuenta del inventario (se consume material) y positivo
    lo devuelve (se cancela una orden o sobró material).
    """

    material_id: int
    delta: float
    nombre: str = ""
    motivo: MotivoMovimiento = MotivoMovimiento.RESERVA
    nota: str = ""


def _decimal(valor: float | Decimal) -> Decimal:
    return Decimal(str(valor))


def _redondear(valor: Decimal) -> Decimal:
    return valor.quantize(Decimal("0.01"))


async def aplicar_ajustes(
    sesion: AsyncSession,
    ajustes: Iterable[AjusteStock],
    *,
    orden_id: Optional[int] = None,
    usuario_id: Optional[int] = None,
    exigir_material: bool = True,
) -> list[MovimientoStock]:
    """
    Aplica los ajustes de stock y registra cada movimiento.

    `exigir_material=True` falla si el material ya no existe en el inventario;
    con False se ignora en silencio (al devolver stock de una orden vieja no
    tiene sentido bloquear por un material que se borró del catálogo).

    Lanza ErrorDeNegocio si el stock no alcanza, sin haber escrito nada.
    """
    pendientes = [ajuste for ajuste in ajustes if ajuste.delta != 0]
    if not pendientes:
        return []

    # Se bloquean las filas para que dos órdenes simultáneas no reserven el
    # mismo material por encima de lo disponible. `of=Material` limita el
    # bloqueo a esta tabla (PostgreSQL rechaza FOR UPDATE con joins externos).
    ids = {ajuste.material_id for ajuste in pendientes}
    filas = (
        await sesion.execute(
            select(Material).where(Material.id.in_(ids)).with_for_update(of=Material)
        )
    ).scalars()
    materiales = {material.id: material for material in filas}

    # ── Fase 1: simular y validar todo ──────────────────────────────────────
    simulado: dict[int, Decimal] = {}
    for ajuste in pendientes:
        material = materiales.get(ajuste.material_id)
        if material is None:
            if exigir_material and ajuste.delta < 0:
                raise ErrorDeNegocio(
                    f"Material '{ajuste.nombre or ajuste.material_id}' no existe en inventario."
                )
            continue

        disponible = simulado.get(material.id, _decimal(material.stock_actual))
        resultado = disponible + _decimal(ajuste.delta)
        if resultado < 0:
            raise ErrorDeNegocio(
                f"Stock insuficiente para '{material.nombre}' "
                f"(disponible: {_redondear(disponible)}, requerido: {abs(_decimal(ajuste.delta))})."
            )
        simulado[material.id] = resultado

    # ── Fase 2: recién ahora se escribe ─────────────────────────────────────
    movimientos: list[MovimientoStock] = []
    for ajuste in pendientes:
        material = materiales.get(ajuste.material_id)
        if material is None:
            continue

        material.stock_actual = _redondear(_decimal(material.stock_actual) + _decimal(ajuste.delta))
        movimiento = MovimientoStock(
            material_id=material.id,
            orden_id=orden_id,
            usuario_id=usuario_id,
            delta=_redondear(_decimal(ajuste.delta)),
            stock_resultante=material.stock_actual,
            motivo=ajuste.motivo,
            nota=ajuste.nota,
        )
        sesion.add(movimiento)
        movimientos.append(movimiento)

    await sesion.flush()
    return movimientos


def calcular_delta_reserva(
    estimados_anteriores: dict[int, float],
    estimados_nuevos: dict[int, float],
) -> list[AjusteStock]:
    """
    Diferencia entre dos estimaciones: lo que sobra se devuelve y lo que falta
    se reserva, sin tocar lo que no cambió.
    """
    ajustes = []
    for material_id in set(estimados_anteriores) | set(estimados_nuevos):
        antes = estimados_anteriores.get(material_id, 0)
        ahora = estimados_nuevos.get(material_id, 0)
        if antes == ahora:
            continue
        delta = antes - ahora  # >0 devuelve, <0 reserva más
        ajustes.append(
            AjusteStock(
                material_id=material_id,
                delta=delta,
                motivo=(
                    MotivoMovimiento.LIBERACION if delta > 0 else MotivoMovimiento.RESERVA
                ),
            )
        )
    return ajustes


# ══ Gestión de Rollos y Planchas Pre-dimensionadas ════════════════════════

async def registrar_pieza(
    sesion: AsyncSession,
    data: PiezaLoteCreateData,
    usuario: Usuario,
) -> PiezaLoteMaterial:
    """Registra un nuevo rollo continuo o plancha rígida pre-dimensionada."""
    material = await sesion.get(Material, data.material_id)
    if material is None:
        raise NoEncontrado("Material no encontrado.")

    existente = (
        await sesion.execute(
            select(PiezaLoteMaterial).where(
                PiezaLoteMaterial.codigo_identificador == data.codigo_identificador.strip()
            )
        )
    ).scalar_one_or_none()
    if existente is not None:
        raise Conflicto(f"Ya existe una pieza o rollo con el código '{data.codigo_identificador}'.")

    ahora = ahora_utc()
    capacidad = _redondear(_decimal(data.capacidad_inicial))
    pieza = PiezaLoteMaterial(
        material_id=data.material_id,
        codigo_identificador=data.codigo_identificador.strip(),
        ancho_m=_decimal(data.ancho_m) if data.ancho_m is not None else material.ancho_predeterminado_m,
        largo_m=_decimal(data.largo_m) if data.largo_m is not None else material.largo_predeterminado_m,
        espesor_mm=_decimal(data.espesor_mm) if data.espesor_mm is not None else material.espesor_mm,
        capacidad_inicial=capacidad,
        saldo_restante=capacidad,
        unidad_medida=data.unidad_medida,
        costo_adquisicion=_redondear(_decimal(data.costo_adquisicion)),
        estado=EstadoPieza.DISPONIBLE,
        ubicacion=data.ubicacion or material.ubicacion_estante,
        maquina_asignada=data.maquina_asignada,
        fecha_ingreso=ahora,
        nota=data.nota,
        consumos=[],
    )
    sesion.add(pieza)
    await sesion.flush()
    return pieza


async def listar_piezas(
    sesion: AsyncSession,
    material_id: Optional[int] = None,
    estado: Optional[EstadoPieza] = None,
) -> list[PiezaLoteMaterial]:
    """Lista las piezas/rollos filtrados opcionalmente por material o estado."""
    consulta = (
        select(PiezaLoteMaterial)
        .order_by(PiezaLoteMaterial.fecha_ingreso.desc(), PiezaLoteMaterial.id.desc())
    )
    if material_id is not None:
        consulta = consulta.where(PiezaLoteMaterial.material_id == material_id)
    if estado is not None:
        consulta = consulta.where(PiezaLoteMaterial.estado == estado)
    return list((await sesion.execute(consulta)).scalars())


async def obtener_pieza(sesion: AsyncSession, pieza_id: int) -> PiezaLoteMaterial:
    """Devuelve la pieza o rollo con su historial completo de consumos y cortes."""
    pieza = await sesion.get(PiezaLoteMaterial, pieza_id)
    if pieza is None:
        raise NoEncontrado("Pieza o rollo no encontrado.")
    return pieza


async def registrar_consumo_pieza(
    sesion: AsyncSession,
    pieza_id: int,
    data: ConsumoPiezaCreateData,
    usuario: Usuario,
) -> ConsumoPieza:
    """
    Registra un corte o uso de rollo/plancha (como en CONTROL ROLLOS A+B).
    Deduce el saldo restante y recalcula el estado y la ganancia.
    """
    pieza = await sesion.get(PiezaLoteMaterial, pieza_id)
    if pieza is None:
        raise NoEncontrado("Pieza o rollo no encontrado.")

    if pieza.estado == EstadoPieza.AGOTADO:
        raise ErrorDeNegocio("Esta pieza o rollo ya se encuentra agotado.")

    cantidad = _redondear(_decimal(data.cantidad_consumida))
    if cantidad > _decimal(pieza.saldo_restante):
        raise ErrorDeNegocio(
            f"El consumo solicitado ({cantidad} {pieza.unidad_medida}) supera el saldo disponible "
            f"({pieza.saldo_restante} {pieza.unidad_medida})."
        )

    saldo_anterior = _decimal(pieza.saldo_restante)
    saldo_nuevo = _redondear(saldo_anterior - cantidad)
    pieza.saldo_restante = saldo_nuevo

    ahora = ahora_utc()
    if saldo_nuevo == Decimal("0.00"):
        pieza.estado = EstadoPieza.AGOTADO
        pieza.fecha_termino = ahora
    else:
        pieza.estado = EstadoPieza.EN_USO

    consumo = ConsumoPieza(
        pieza=pieza,
        orden_id=data.orden_id,
        usuario_id=usuario.id,
        trabajo_descripcion=data.trabajo_descripcion,
        cantidad_consumida=cantidad,
        saldo_anterior=saldo_anterior,
        saldo_nuevo=saldo_nuevo,
        monto_cobrado=_redondear(_decimal(data.monto_cobrado)),
        merma_desperdicio=_redondear(_decimal(data.merma_desperdicio)),
        fecha=ahora,
        nota=data.nota,
    )
    if consumo not in pieza.consumos:
        pieza.consumos.append(consumo)
    sesion.add(consumo)
    await sesion.flush()
    return consumo
