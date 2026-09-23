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


# ══ Control de Rollos Continuos y Planchas Pre-dimensionadas ══════════════

async def test_trazabilidad_rollos_uv_dtf_y_ganancia(sesion, admin, material):
    """
    Simula el control de rollos A y B (como en CONTROL ROLLOS A + B.xlsx):
    - Rollo de 100 metros con costo de S/ 350
    - Cortes/consumos por cada orden
    - Deducción de saldo restante y cálculo de ganancia neta al terminarse
    """
    from app.models import EstadoPieza
    from app.schemas.inventario import ConsumoPiezaCreateData, PiezaLoteCreateData
    from app.services import inventario_service

    # 1. Alta del Rollo # A-001
    pieza_data = PiezaLoteCreateData(
        material_id=material.id,
        codigo_identificador="ROLL-UV-A-001",
        capacidad_inicial=100.0,
        unidad_medida="m",
        costo_adquisicion=350.0,
        ancho_m=0.60,
        largo_m=100.0,
        ubicacion="Estante R-02",
        maquina_asignada="Mimaki UV DTF",
        nota="Lote importación 2026-A",
    )
    pieza = await inventario_service.registrar_pieza(sesion, pieza_data, admin)

    assert pieza.id is not None
    assert pieza.estado == EstadoPieza.DISPONIBLE
    assert float(pieza.saldo_restante) == 100.0
    assert float(pieza.ganancia_neta) == -350.0

    # 2. Consumo #1: Trabajo stickers 1.50 metros
    consumo1_data = ConsumoPiezaCreateData(
        trabajo_descripcion="Stickers UV DTF Barbería Trujillo",
        cantidad_consumida=1.50,
        monto_cobrado=45.0,
        nota="Impresión sin fallas",
    )
    consumo1 = await inventario_service.registrar_consumo_pieza(
        sesion, pieza.id, consumo1_data, admin
    )
    assert consumo1.id is not None
    assert float(consumo1.saldo_anterior) == 100.0
    assert float(consumo1.saldo_nuevo) == 98.50
    assert float(pieza.saldo_restante) == 98.50
    assert pieza.estado == EstadoPieza.EN_USO

    # 3. Consumo #2: Agotar los 98.50 metros restantes con un gran pedido
    consumo2_data = ConsumoPiezaCreateData(
        trabajo_descripcion="Producción Etiquetas Distribuidora Norte",
        cantidad_consumida=98.50,
        monto_cobrado=1500.0,
        merma_desperdicio=0.50,
    )
    consumo2 = await inventario_service.registrar_consumo_pieza(
        sesion, pieza.id, consumo2_data, admin
    )
    assert float(consumo2.saldo_nuevo) == 0.0
    assert float(pieza.saldo_restante) == 0.0
    assert pieza.estado == EstadoPieza.AGOTADO
    assert pieza.fecha_termino is not None

    # Ganancia neta = 45 + 1500 - 350 = 1195
    assert float(pieza.total_recaudado) == 1545.0
    assert float(pieza.ganancia_neta) == 1195.0

    # 4. Intentar consumir un rollo agotado debe rebotar
    with pytest.raises(ErrorDeNegocio, match="agotado"):
        await inventario_service.registrar_consumo_pieza(
            sesion, pieza.id, ConsumoPiezaCreateData(
                trabajo_descripcion="Intento extra",
                cantidad_consumida=1.0,
            ),
            admin,
        )


async def test_plancha_rigida_predimensionada_area(sesion, admin, material):
    """
    Plancha rígida pre-dimensionada (ej: MDF 2.44x1.22 m = 2.98 m²):
    se descuenta el área útil utilizada y valida que no se supere el saldo.
    """
    from app.schemas.inventario import ConsumoPiezaCreateData, PiezaLoteCreateData
    from app.services import inventario_service

    plancha_data = PiezaLoteCreateData(
        material_id=material.id,
        codigo_identificador="PL-MDF-244x122-01",
        capacidad_inicial=2.98,
        unidad_medida="m2",
        costo_adquisicion=42.0,
        ancho_m=1.22,
        largo_m=2.44,
        espesor_mm=3.0,
        ubicacion="Rack Planchas A-1",
    )
    plancha = await inventario_service.registrar_pieza(sesion, plancha_data, admin)
    assert float(plancha.saldo_restante) == 2.98

    # Descontar 0.98 m2
    await inventario_service.registrar_consumo_pieza(
        sesion,
        plancha.id,
        ConsumoPiezaCreateData(
            trabajo_descripcion="Corte láser marcos decorativos",
            cantidad_consumida=0.98,
            monto_cobrado=70.0,
        ),
        admin,
    )
    assert float(plancha.saldo_restante) == 2.00

    # Intentar consumir más del saldo (ej: 3.5 m2) debe rebotar
    with pytest.raises(ErrorDeNegocio, match="supera el saldo disponible"):
        await inventario_service.registrar_consumo_pieza(
            sesion,
            plancha.id,
            ConsumoPiezaCreateData(
                trabajo_descripcion="Exceso",
                cantidad_consumida=3.50,
            ),
            admin,
        )
