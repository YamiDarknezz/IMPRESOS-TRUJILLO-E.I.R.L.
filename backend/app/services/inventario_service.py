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

from app.core.errores import ErrorDeNegocio
from app.models import Material, MotivoMovimiento, MovimientoStock


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
