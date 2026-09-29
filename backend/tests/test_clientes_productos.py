"""Pruebas de clientes (ficha, alta rápida) y productos (receta)."""
import pytest

from app.core.errores import NoEncontrado
from app.models import Producto, TipoProducto
from app.services import ordenes_service
from tests.apoyo import cabecera_token, datos_orden


# ══ Clientes ═══════════════════════════════════════════════════════════════

async def test_resumen_del_cliente(sesion, admin, material, cliente):
    primera = await ordenes_service.crear_orden(
        sesion,
        datos_orden(material.id, cliente_id=cliente.id, precio_total=100, adelanto_pago=50),
        admin,
    )
    cancelada = await ordenes_service.crear_orden(
        sesion,
        datos_orden(material.id, cliente_id=cliente.id, precio_total=200, adelanto_pago=100),
        admin,
    )
    await ordenes_service.cancelar(sesion, cancelada.id, admin)

    resumen = await ordenes_service.resumen_cliente(sesion, cliente.id)

    assert resumen["total_ordenes"] == 2  # el historial conserva la cancelada
    assert resumen["facturado"] == 100
    assert resumen["por_cobrar"] == 50
    assert primera.estado.value == "pendiente"


async def test_alta_rapida_reutiliza_el_cliente_existente(sesion, admin, material):
    primera = await ordenes_service.crear_orden(
        sesion, datos_orden(material.id, cliente="Cliente Nuevo Mostrador"), admin
    )
    segunda = await ordenes_service.crear_orden(
        sesion, datos_orden(material.id, cliente="cliente nuevo mostrador"), admin
    )
    assert primera.cliente_id == segunda.cliente_id


async def test_no_se_crea_orden_para_cliente_inactivo(sesion, admin, material, cliente):
    cliente.activo = False
    await sesion.flush()

    with pytest.raises(NoEncontrado):
        await ordenes_service.crear_orden(
            sesion, datos_orden(material.id, cliente_id=cliente.id), admin
        )


# ══ Issue #59: no se permiten clientes duplicados ═══════════════════════════

async def test_no_se_permite_cliente_con_nombre_duplicado(cliente_api, admin):
    payload = {"nombre": "Cliente Duplicado", "documento": "12345678"}
    assert (
        await cliente_api.post("/api/clientes", json=payload, headers=cabecera_token(admin))
    ).status_code == 200

    otra_vez = {"nombre": "cliente duplicado"}  # sin importar mayúsculas
    respuesta = await cliente_api.post(
        "/api/clientes", json=otra_vez, headers=cabecera_token(admin)
    )
    assert respuesta.status_code == 409


async def test_no_se_permite_documento_duplicado_con_otro_nombre(cliente_api, admin):
    await cliente_api.post(
        "/api/clientes",
        json={"nombre": "Primer Cliente", "documento": "12345678"},
        headers=cabecera_token(admin),
    )

    respuesta = await cliente_api.post(
        "/api/clientes",
        json={"nombre": "Otro Cliente Distinto", "documento": "12345678"},
        headers=cabecera_token(admin),
    )
    assert respuesta.status_code == 409


# ══ Productos y recetas ════════════════════════════════════════════════════

async def test_receta_autocompleta_los_materiales(sesion, producto, material):
    items = ordenes_service.materiales_desde_receta(producto, cantidad=3)
    assert len(items) == 1
    assert items[0].material_id == material.id
    assert items[0].cantidad == 3


async def test_producto_de_servicio_no_tiene_receta(sesion, material):
    servicio = Producto(
        nombre="Diseño de arte",
        tipo=TipoProducto.SERVICIO,
        precio_base=40,
        receta=[],
    )
    sesion.add(servicio)
    await sesion.flush()

    assert ordenes_service.materiales_desde_receta(servicio) == []
