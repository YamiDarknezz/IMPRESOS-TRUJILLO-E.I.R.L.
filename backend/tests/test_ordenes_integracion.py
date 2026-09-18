"""Pruebas de integración del flujo completo de una orden.

Levantan SQLite en memoria con el esquema real y verifican las reglas que
sostienen el sistema, de punta a punta: reserva de stock, edición con
reajuste, cancelación, reporte de consumo real, candado de entrega y permisos.
"""
import pytest
from sqlalchemy import select

from app.core.errores import Conflicto, ErrorDeNegocio, PermisoDenegado
from app.models import (
    EstadoOrden,
    MetodoPago,
    MotivoMovimiento,
    MovimientoStock,
    Rol,
    Usuario,
)
from app.schemas import MaterialEstimado
from app.services import ordenes_service
from tests.apoyo import datos_orden


# ══ Creación y reserva de stock (RN-03) ════════════════════════════════════

async def test_crear_orden_reserva_el_stock(sesion, admin, material):
    orden = await ordenes_service.crear_orden(sesion, datos_orden(material.id), admin)

    assert orden.estado == EstadoOrden.PENDIENTE
    assert float(orden.total) == 100
    assert float(orden.adelanto) == 50
    assert float(orden.saldo_pendiente) == 50
    assert orden.pagado_totalmente is False
    assert orden.codigo == f"ORD-{orden.id:06d}"
    assert float(material.stock_actual) == 8  # 10 - 2 reservados

    movimientos = (
        await sesion.execute(
            select(MovimientoStock).where(MovimientoStock.orden_id == orden.id)
        )
    ).scalars().all()
    assert len(movimientos) == 1
    assert movimientos[0].motivo == MotivoMovimiento.RESERVA
    assert float(movimientos[0].delta) == -2
    assert float(movimientos[0].stock_resultante) == 8


async def test_crear_orden_sin_adelanto_falla(sesion, admin, material):
    with pytest.raises(ErrorDeNegocio) as exc:
        await ordenes_service.crear_orden(
            sesion, datos_orden(material.id, adelanto_pago=10), admin
        )
    assert "adelanto mínimo" in str(exc.value).lower()
    assert float(material.stock_actual) == 10  # no se reservó nada


async def test_crear_orden_sin_stock_falla(sesion, admin, material):
    with pytest.raises(ErrorDeNegocio) as exc:
        await ordenes_service.crear_orden(
            sesion,
            datos_orden(
                material.id,
                materiales_estimados=[MaterialEstimado(material_id=material.id, cantidad=20)],
            ),
            admin,
        )
    assert "stock insuficiente" in str(exc.value).lower()


# ══ Edición con reajuste de la reserva ═════════════════════════════════════

async def test_editar_orden_reajusta_el_stock(sesion, admin, material):
    orden = await ordenes_service.crear_orden(sesion, datos_orden(material.id), admin)
    assert float(material.stock_actual) == 8

    # 2 -> 5: reserva 3 más.
    await ordenes_service.actualizar(
        sesion,
        orden.id,
        datos_orden(
            material.id,
            materiales_estimados=[MaterialEstimado(material_id=material.id, cantidad=5)],
        ),
        admin,
    )
    assert float(material.stock_actual) == 5

    # 5 -> 1: devuelve 4.
    await ordenes_service.actualizar(
        sesion,
        orden.id,
        datos_orden(
            material.id,
            materiales_estimados=[MaterialEstimado(material_id=material.id, cantidad=1)],
        ),
        admin,
    )
    assert float(material.stock_actual) == 9


# ══ Cancelación (RN-06) ════════════════════════════════════════════════════

async def test_cancelar_devuelve_el_stock_reservado(sesion, admin, material):
    orden = await ordenes_service.crear_orden(sesion, datos_orden(material.id), admin)
    await ordenes_service.cancelar(sesion, orden.id, admin)

    assert orden.estado == EstadoOrden.CANCELADA
    assert float(material.stock_actual) == 10


async def test_orden_cancelada_no_vuelve_a_moverse(sesion, admin, material):
    orden = await ordenes_service.crear_orden(sesion, datos_orden(material.id), admin)
    await ordenes_service.cancelar(sesion, orden.id, admin)

    with pytest.raises(ErrorDeNegocio):
        await ordenes_service.cambiar_estado(sesion, orden.id, EstadoOrden.PENDIENTE, admin)


# ══ Reporte de uso: mermas y devoluciones (D2 / RF-07) ═════════════════════

async def test_reportar_uso_con_merma_descuenta_el_exceso(sesion, admin, material):
    orden = await ordenes_service.crear_orden(sesion, datos_orden(material.id), admin)

    _, mermas, devoluciones = await ordenes_service.completar(
        sesion, orden.id, [MaterialEstimado(material_id=material.id, cantidad=3)], admin
    )

    assert orden.estado == EstadoOrden.FINALIZADA
    assert float(material.stock_actual) == 7  # 8 - 1 de merma
    assert len(mermas) == 1 and mermas[0]["cantidad"] == 1
    assert devoluciones == []
    assert orden.finalizada_en is not None


async def test_reportar_uso_con_sobrante_devuelve_material(sesion, admin, material):
    orden = await ordenes_service.crear_orden(sesion, datos_orden(material.id), admin)

    _, mermas, devoluciones = await ordenes_service.completar(
        sesion, orden.id, [MaterialEstimado(material_id=material.id, cantidad=1)], admin
    )

    assert float(material.stock_actual) == 9  # 8 + 1 devuelto
    assert devoluciones and mermas == []


async def test_no_se_puede_finalizar_sin_reporte_de_uso(sesion, admin, material):
    orden = await ordenes_service.crear_orden(sesion, datos_orden(material.id), admin)

    with pytest.raises(ErrorDeNegocio) as exc:
        await ordenes_service.cambiar_estado(sesion, orden.id, EstadoOrden.FINALIZADA, admin)
    assert "Reportar uso" in str(exc.value)


# ══ Candado de entrega (RN-02) y entrega definitiva ════════════════════════

async def test_no_se_entrega_con_saldo_pendiente(sesion, admin, material):
    orden = await ordenes_service.crear_orden(sesion, datos_orden(material.id), admin)
    await ordenes_service.completar(
        sesion, orden.id, [MaterialEstimado(material_id=material.id, cantidad=2)], admin
    )

    with pytest.raises(ErrorDeNegocio) as exc:
        await ordenes_service.cambiar_estado(sesion, orden.id, EstadoOrden.ENTREGADA, admin)
    assert "pagada" in str(exc.value).lower()


async def test_confirmar_pago_habilita_la_entrega(sesion, admin, material):
    orden = await ordenes_service.crear_orden(sesion, datos_orden(material.id), admin)
    await ordenes_service.completar(
        sesion, orden.id, [MaterialEstimado(material_id=material.id, cantidad=2)], admin
    )

    await ordenes_service.confirmar_pago(sesion, orden.id, MetodoPago.YAPE, "", admin)
    assert orden.pagado_totalmente is True
    assert float(orden.saldo_pendiente) == 0

    await ordenes_service.cambiar_estado(sesion, orden.id, EstadoOrden.ENTREGADA, admin)
    assert orden.estado == EstadoOrden.ENTREGADA
    assert orden.entregada_en is not None


async def test_no_se_confirma_pago_dos_veces(sesion, admin, material):
    orden = await ordenes_service.crear_orden(
        sesion, datos_orden(material.id, adelanto_pago=100), admin
    )

    with pytest.raises(Conflicto):
        await ordenes_service.confirmar_pago(sesion, orden.id, MetodoPago.EFECTIVO, "", admin)


async def test_entrega_definitiva(sesion, admin, material):
    orden = await ordenes_service.crear_orden(
        sesion, datos_orden(material.id, adelanto_pago=100), admin
    )
    await ordenes_service.completar(
        sesion, orden.id, [MaterialEstimado(material_id=material.id, cantidad=2)], admin
    )
    await ordenes_service.cambiar_estado(sesion, orden.id, EstadoOrden.ENTREGADA, admin)

    with pytest.raises(ErrorDeNegocio) as exc:
        await ordenes_service.cambiar_estado(sesion, orden.id, EstadoOrden.FINALIZADA, admin)
    assert "entregada" in str(exc.value).lower()


# ══ Permisos por rol ═══════════════════════════════════════════════════════

async def test_trabajador_no_gestiona_orden_ajena(sesion, admin, operario, material):
    otro = Usuario(
        nombre="Otro Operario",
        email="otro@impresos.test",
        password_hash="x",
        rol=Rol.OPERARIO,
    )
    sesion.add(otro)
    await sesion.flush()

    orden = await ordenes_service.crear_orden(
        sesion, datos_orden(material.id, asignado_a=otro.id), admin
    )

    with pytest.raises(PermisoDenegado):
        await ordenes_service.cambiar_estado(
            sesion, orden.id, EstadoOrden.EN_DISENO, operario
        )


async def test_trabajador_si_gestiona_su_orden(sesion, admin, operario, material):
    orden = await ordenes_service.crear_orden(
        sesion, datos_orden(material.id, asignado_a=operario.id), admin
    )

    await ordenes_service.cambiar_estado(
        sesion, orden.id, EstadoOrden.EN_DISENO, operario
    )
    assert orden.estado == EstadoOrden.EN_DISENO
