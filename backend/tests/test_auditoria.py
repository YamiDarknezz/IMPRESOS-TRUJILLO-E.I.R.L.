"""El registro de auditoría guarda cada operación crítica (RNF-03)."""
from sqlalchemy import select

from app.models import Auditoria, EstadoOrden, MetodoPago, TipoEventoAuditoria
from app.schemas import MaterialEstimado
from app.services import ordenes_service
from tests.apoyo import datos_orden


async def test_las_operaciones_dejan_rastro(sesion, admin, material, cliente):
    orden = await ordenes_service.crear_orden(
        sesion, datos_orden(material.id, cliente_id=cliente.id), admin
    )
    await ordenes_service.completar(
        sesion,
        orden.id,
        [MaterialEstimado(material_id=material.id, cantidad=2)],
        admin,
    )
    await ordenes_service.confirmar_pago(sesion, orden.id, MetodoPago.EFECTIVO, "", admin)
    await ordenes_service.cambiar_estado(sesion, orden.id, EstadoOrden.ENTREGADA, admin)

    entradas = (
        await sesion.execute(select(Auditoria).order_by(Auditoria.id))
    ).scalars().all()

    acciones = [entrada.accion for entrada in entradas]
    assert TipoEventoAuditoria.CREAR in acciones
    assert TipoEventoAuditoria.PAGO in acciones
    assert acciones.count(TipoEventoAuditoria.CAMBIO_ESTADO) == 2

    # Todo movimiento de esta orden quedó ligado al usuario y al correlativo.
    assert all(entrada.usuario_id == admin.id for entrada in entradas)
    assert all(entrada.registro_id == orden.codigo for entrada in entradas)

    # El último cambio de estado guarda los valores anteriores y nuevos.
    ultimo_cambio = [e for e in entradas if e.accion == TipoEventoAuditoria.CAMBIO_ESTADO][-1]
    assert ultimo_cambio.valores_anteriores == {"estado": "finalizada"}
    assert ultimo_cambio.valores_nuevos == {"estado": "entregada"}


async def test_la_cancelacion_queda_auditada(sesion, admin, material, cliente):
    orden = await ordenes_service.crear_orden(
        sesion, datos_orden(material.id, cliente_id=cliente.id), admin
    )
    await ordenes_service.cancelar(sesion, orden.id, admin)

    entradas = (
        await sesion.execute(
            select(Auditoria).where(Auditoria.accion == TipoEventoAuditoria.CAMBIO_ESTADO)
        )
    ).scalars().all()

    assert len(entradas) == 1
    assert entradas[0].valores_nuevos == {"estado": "cancelada"}
    assert "stock" in entradas[0].detalle.lower()
