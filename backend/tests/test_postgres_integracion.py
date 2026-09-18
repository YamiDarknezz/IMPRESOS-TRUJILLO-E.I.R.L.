"""Pruebas de integración contra el PostgreSQL real de docker-compose.

Se saltan solas si la base no está levantada. Cada prueba corre dentro de una
transacción que se revierte al final, así que no deja datos en la base.

    docker compose up -d db
    python -m pytest -m postgres

Verifican lo que SQLite no puede: dialecto real (FOR UPDATE, NUMERIC, JSON,
enums como VARCHAR con CHECK) y el flujo completo tal como correrá en planta.
"""
import uuid

import pytest
import pytest_asyncio
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.pool import NullPool

from app.core.config import settings
from app.core.fechas import a_fecha_peru, ahora_utc
from app.core.security import hash_password
from app.models import (
    Cliente,
    EstadoOrden,
    Material,
    MetodoPago,
    Rol,
    Unidad,
    UnidadNegocio,
    Usuario,
)
from app.schemas import MaterialEstimado
from app.services import caja_service, ordenes_service
from tests.apoyo import datos_orden

pytestmark = pytest.mark.postgres

SUFIJO = uuid.uuid4().hex[:8]


@pytest_asyncio.fixture
async def sesion_pg():
    engine = create_async_engine(settings.database_url, poolclass=NullPool)
    try:
        conexion = await engine.connect()
    except Exception:
        await engine.dispose()
        pytest.skip("PostgreSQL no disponible: levanta `docker compose up -d db`")

    transaccion = await conexion.begin()
    sesion = AsyncSession(
        bind=conexion,
        expire_on_commit=False,
        join_transaction_mode="create_savepoint",
    )
    try:
        yield sesion
    finally:
        await sesion.close()
        await transaccion.rollback()
        await conexion.close()
        await engine.dispose()


@pytest_asyncio.fixture
async def entorno_pg(sesion_pg):
    """Admin, unidad, material y cliente únicos para esta corrida."""
    admin = Usuario(
        nombre="Admin PG",
        email=f"admin-pg-{SUFIJO}@test.pe",
        password_hash=hash_password("secreto123"),
        rol=Rol.ADMIN,
    )
    unidad = Unidad(nombre=f"m2 pg {SUFIJO}", abreviatura="m2")
    sesion_pg.add_all([admin, unidad])
    await sesion_pg.flush()

    material = Material(
        nombre=f"Lona PG {SUFIJO}",
        unidad=unidad,
        stock_actual=10,
        alerta_minima=3,
        dias_reabastecimiento=5,
    )
    cliente = Cliente(nombre=f"Cliente PG {SUFIJO}", telefono="999000111")
    sesion_pg.add_all([material, cliente])
    await sesion_pg.flush()

    return {"admin": admin, "material": material, "cliente": cliente}


async def test_flujo_completo_en_postgres(sesion_pg, entorno_pg):
    admin = entorno_pg["admin"]
    material = entorno_pg["material"]
    cliente = entorno_pg["cliente"]

    # RF-05: la reserva descuenta el stock al crear la orden.
    orden = await ordenes_service.crear_orden(
        sesion_pg, datos_orden(material.id, cliente_id=cliente.id), admin
    )
    assert float(material.stock_actual) == 8

    # RF-07: reportar uso ajusta la diferencia (merma de 1).
    _, mermas, devoluciones = await ordenes_service.completar(
        sesion_pg,
        orden.id,
        [MaterialEstimado(material_id=material.id, cantidad=3)],
        admin,
    )
    assert float(material.stock_actual) == 7
    assert mermas[0]["cantidad"] == 1
    assert devoluciones == []

    # RN-02 y entrega.
    await ordenes_service.confirmar_pago(sesion_pg, orden.id, MetodoPago.EFECTIVO, "", admin)
    await ordenes_service.cambiar_estado(sesion_pg, orden.id, EstadoOrden.ENTREGADA, admin)

    # Los enums se guardan con su valor en minúscula, no con el nombre del miembro.
    estado = (
        await sesion_pg.execute(
            text("SELECT estado FROM ordenes WHERE id = :id"), {"id": orden.id}
        )
    ).scalar_one()
    assert estado == "entregada"

    metodos = set(
        (
            await sesion_pg.execute(
                text("SELECT metodo FROM orden_pagos WHERE orden_id = :id"),
                {"id": orden.id},
            )
        ).scalars()
    )
    assert metodos == {"efectivo"}

    # La auditoría quedó escrita en PostgreSQL.
    filas = (
        await sesion_pg.execute(
            text("SELECT COUNT(*) FROM auditoria WHERE registro_id = :codigo"),
            {"codigo": orden.codigo},
        )
    ).scalar_one()
    assert filas >= 4

    # El arqueo del admin incluye sus dos cobros (adelanto + saldo).
    resumen = await caja_service.resumen_dia(
        sesion_pg, a_fecha_peru(ahora_utc()), usuario_id=admin.id
    )
    assert resumen["total"]["total"] == 100


async def test_precision_numerica_con_igv(sesion_pg, entorno_pg):
    orden = await ordenes_service.crear_orden(
        sesion_pg,
        datos_orden(
            entorno_pg["material"].id,
            cliente_id=entorno_pg["cliente"].id,
            precio_total=33.33,
            incluye_igv=True,
            adelanto_pago=20,
        ),
        entorno_pg["admin"],
    )

    assert float(orden.subtotal) == 33.33
    assert float(orden.igv) == 6.00
    assert float(orden.total) == 39.33
    assert float(orden.saldo_pendiente) == 19.33


async def test_cierre_de_caja_en_postgres(sesion_pg, entorno_pg):
    admin = entorno_pg["admin"]
    await ordenes_service.crear_orden(
        sesion_pg,
        datos_orden(entorno_pg["material"].id, cliente_id=entorno_pg["cliente"].id),
        admin,
    )

    hoy = a_fecha_peru(ahora_utc())
    cierre = await caja_service.cerrar_caja(sesion_pg, hoy, UnidadNegocio.IMPRENTA, "", admin)
    assert float(cierre.total) == 50

    congelado = await caja_service.congelar_caja(sesion_pg, cierre.id, "Validado", admin)
    assert congelado.estado.value == "congelado"
    assert congelado.validado_por == admin.id
