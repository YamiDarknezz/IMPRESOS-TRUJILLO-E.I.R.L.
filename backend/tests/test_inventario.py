"""Pruebas del inventario: reservas, ajustes manuales y movimientos."""
from decimal import Decimal

import pytest

from app.core.errores import ErrorDeNegocio
from app.models import MotivoMovimiento
from app.schemas import MaterialEstimado
from app.services import ordenes_service
from app.services.inventario_service import (
    AjusteStock,
    aplicar_ajustes,
    calcular_delta_reserva,
)
from tests.apoyo import datos_orden


# ══ Reglas puras ═══════════════════════════════════════════════════════════

def test_delta_devuelve_lo_que_sobra():
    ajustes = calcular_delta_reserva({1: 5}, {1: 2})
    assert len(ajustes) == 1
    assert ajustes[0].delta == 3
    assert ajustes[0].motivo == MotivoMovimiento.LIBERACION


def test_delta_reserva_lo_que_falta():
    ajuste = calcular_delta_reserva({1: 2}, {1: 6})[0]
    assert ajuste.delta == -4
    assert ajuste.motivo == MotivoMovimiento.RESERVA


def test_delta_ignora_lo_que_no_cambio():
    assert calcular_delta_reserva({1: 5, 2: 3}, {1: 5, 2: 3}) == []


def test_delta_con_material_nuevo_y_quitado():
    ajustes = calcular_delta_reserva({1: 5}, {2: 1})
    por_material = {ajuste.material_id: ajuste for ajuste in ajustes}
    assert por_material[1].delta == 5  # se quitó de la orden: se devuelve
    assert por_material[2].delta == -1  # se agregó: se reserva


# ══ Ajustes de stock ═══════════════════════════════════════════════════════

async def test_ajuste_manual_registra_movimiento(sesion, admin, material):
    movimientos = await aplicar_ajustes(
        sesion,
        [
            AjusteStock(
                material_id=material.id,
                delta=-4,
                motivo=MotivoMovimiento.AJUSTE_MANUAL,
                nota="conteo físico",
            )
        ],
        usuario_id=admin.id,
    )

    assert float(material.stock_actual) == 6
    assert movimientos[0].motivo == MotivoMovimiento.AJUSTE_MANUAL
    assert movimientos[0].stock_resultante == Decimal("6.00")
    assert movimientos[0].usuario_id == admin.id


async def test_ajuste_no_deja_stock_negativo(sesion, admin, material):
    with pytest.raises(ErrorDeNegocio, match="Stock insuficiente"):
        await aplicar_ajustes(
            sesion,
            [AjusteStock(material_id=material.id, delta=-11)],
            usuario_id=admin.id,
        )
    assert float(material.stock_actual) == 10


async def test_material_borrado_no_bloquea_la_devolucion(sesion, admin):
    movimientos = await aplicar_ajustes(
        sesion,
        [AjusteStock(material_id=999, delta=5, nombre="Material viejo")],
        usuario_id=admin.id,
        exigir_material=False,
    )
    assert movimientos == []


async def test_alerta_de_stock_bajo(sesion, material):
    assert material.stock_bajo is False
    material.stock_actual = 3  # igual a la alerta mínima
    assert material.stock_bajo is True


async def test_editar_orden_mas_alla_del_stock_falla(sesion, admin, material, cliente):
    orden = await ordenes_service.crear_orden(
        sesion, datos_orden(material.id, cliente_id=cliente.id), admin
    )
    assert float(material.stock_actual) == 8

    with pytest.raises(ErrorDeNegocio, match="Stock insuficiente"):
        await ordenes_service.actualizar(
            sesion,
            orden.id,
            datos_orden(
                material.id,
                cliente_id=cliente.id,
                materiales_estimados=[MaterialEstimado(material_id=material.id, cantidad=20)],
            ),
            admin,
        )
    assert float(material.stock_actual) == 8  # no se movió nada
