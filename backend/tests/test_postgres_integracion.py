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
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.pool import NullPool

from app.core.config import settings
from app.core.fechas import a_fecha_peru, ahora_utc
from app.core.security import hash_password
from app.models import (
    Cliente,
    EstadoOrden,
    EstadoPieza,
    Material,
    MetodoPago,
    PiezaLoteMaterial,
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


async def test_check_de_enum_rechaza_un_valor_fuera_del_dominio(sesion_pg, entorno_pg):
    """
    El docstring de este módulo dice que los enums se guardan como `VARCHAR`
    con `CHECK`: esta prueba es la que de verdad lo comprueba. Sin el CHECK,
    este UPDATE por SQL directo pasaría silenciosamente y dejaría un
    `tipo_formato` que ningún camino del código (ni Pydantic, que aquí ni
    interviene) considera posible.
    """
    material = entorno_pg["material"]

    with pytest.raises(IntegrityError):
        async with sesion_pg.begin_nested():
            await sesion_pg.execute(
                text("UPDATE materiales SET tipo_formato = 'no_existe' WHERE id = :id"),
                {"id": material.id},
            )


async def test_codigo_de_pieza_duplicado_lo_rechaza_la_base(sesion_pg, entorno_pg):
    """
    `registrar_pieza` ya comprueba el duplicado con un SELECT antes del
    INSERT, pero eso no cierra la carrera entre dos peticiones concurrentes.
    Esta prueba comprueba la barrera real: el índice único de
    `codigo_identificador`.
    """
    material = entorno_pg["material"]
    ahora = ahora_utc()

    sesion_pg.add(
        PiezaLoteMaterial(
            material_id=material.id,
            codigo_identificador=f"ROLL-{SUFIJO}",
            capacidad_inicial=100,
            saldo_restante=100,
            unidad_medida="m",
            estado=EstadoPieza.DISPONIBLE,
            fecha_ingreso=ahora,
        )
    )
    await sesion_pg.flush()

    with pytest.raises(IntegrityError):
        async with sesion_pg.begin_nested():
            sesion_pg.add(
                PiezaLoteMaterial(
                    material_id=material.id,
                    codigo_identificador=f"ROLL-{SUFIJO}",
                    capacidad_inicial=50,
                    saldo_restante=50,
                    unidad_medida="m",
                    estado=EstadoPieza.DISPONIBLE,
                    fecha_ingreso=ahora,
                )
            )
            await sesion_pg.flush()


async def test_saldo_restante_fuera_de_capacidad_lo_rechaza_la_base(sesion_pg, entorno_pg):
    """El CHECK es el respaldo si algún día un bug deja escribir un saldo imposible."""
    material = entorno_pg["material"]

    with pytest.raises(IntegrityError):
        async with sesion_pg.begin_nested():
            sesion_pg.add(
                PiezaLoteMaterial(
                    material_id=material.id,
                    codigo_identificador=f"ROLL-NEG-{SUFIJO}",
                    capacidad_inicial=100,
                    saldo_restante=-1,
                    unidad_medida="m",
                    estado=EstadoPieza.DISPONIBLE,
                    fecha_ingreso=ahora_utc(),
                )
            )
            await sesion_pg.flush()


async def test_la_orden_recien_creada_se_puede_responder(sesion_pg, entorno_pg):
    """
    POST /api/ordenes responde con `serializar_orden(orden)`.

    Esa función lee `orden.comprobantes` y las de cada pago. En un objeto recién
    creado y ya persistido esas colecciones no están inicializadas: el acceso
    dispara un SELECT implícito y la petición muere con MissingGreenlet (500) en
    Postgres. En SQLite la carga implícita pasa desapercibida, así que este
    caso solo se ve contra el motor real (issue #67).
    """
    from app.models import Comprobante
    from app.services.serializadores import serializar_orden

    admin = entorno_pg["admin"]
    material = entorno_pg["material"]
    cliente = entorno_pg["cliente"]

    orden = await ordenes_service.crear_orden(
        sesion_pg, datos_orden(material.id, cliente_id=cliente.id), admin
    )

    # El alta devuelve la orden: aquí es donde fallaba, con el pago del adelanto.
    respuesta = serializar_orden(orden)

    assert respuesta["comprobantes"] == []
    assert len(respuesta["finanzas"]["pagos"]) == 1
    assert respuesta["finanzas"]["pagos"][0]["comprobantes"] == []

    # Y con una captura adjunta al adelanto, también.
    sesion_pg.add(
        Comprobante(
            orden_id=orden.id,
            clave="pruebaDeClaveAleatoria12345678.webp",
            nombre_original="yape.webp",
            tipo_mime="image/webp",
            tamano_bytes=1024,
            subido_por=admin.id,
        )
    )
    await sesion_pg.flush()

    await sesion_pg.refresh(orden, ["comprobantes"])
    assert len(serializar_orden(orden)["comprobantes"]) == 1


async def test_borrar_un_comprobante_en_postgres(sesion_pg, entorno_pg):
    """
    DELETE /api/comprobantes/{id}: quita la fila y el archivo.

    El servicio leía `comprobante.orden` (relación lazy) para el detalle de la
    auditoría: en Postgres eso es un SELECT implícito y la petición moría con
    500 después de haber borrado el archivo, dejando la fila viva (issue #67).
    """
    from app.models import Comprobante
    from app.services import comprobantes_service

    admin = entorno_pg["admin"]
    material = entorno_pg["material"]
    cliente = entorno_pg["cliente"]

    orden = await ordenes_service.crear_orden(
        sesion_pg, datos_orden(material.id, cliente_id=cliente.id), admin
    )
    comprobante = Comprobante(
        orden_id=orden.id,
        clave="otraClaveAleatoriaParaBorrar1234.webp",
        nombre_original="yape.webp",
        tipo_mime="image/webp",
        tamano_bytes=2048,
        subido_por=admin.id,
    )
    sesion_pg.add(comprobante)
    await sesion_pg.flush()
    id_comprobante = comprobante.id

    await comprobantes_service.borrar(sesion_pg, id_comprobante, admin)

    queda = await sesion_pg.get(Comprobante, id_comprobante)
    assert queda is None


async def test_canal_de_ingreso_con_check_y_valor_por_defecto_en_postgres(sesion_pg, entorno_pg):
    """
    #69: la columna nueva entra a una tabla con filas gracias al
    `server_default` ("otro"), y su CHECK rechaza un canal fuera del dominio.
    """
    admin, material, cliente = entorno_pg["admin"], entorno_pg["material"], entorno_pg["cliente"]
    orden = await ordenes_service.crear_orden(
        sesion_pg, datos_orden(material.id, cliente_id=cliente.id), admin
    )
    assert orden.canal_ingreso.value == "otro"

    # Una fila escrita sin el campo (como las anteriores a la migración) lo recibe de la base.
    guardado = (
        await sesion_pg.execute(
            text("SELECT canal_ingreso FROM ordenes WHERE id = :id"), {"id": orden.id}
        )
    ).scalar_one()
    assert guardado == "otro"

    with pytest.raises(IntegrityError):
        async with sesion_pg.begin_nested():
            await sesion_pg.execute(
                text("UPDATE ordenes SET canal_ingreso = 'paloma' WHERE id = :id"), {"id": orden.id}
            )


async def test_gasto_de_caja_exige_monto_positivo_en_postgres(sesion_pg, entorno_pg):
    """#112: el CHECK `monto > 0` de gastos_caja existe de verdad en la base."""
    from datetime import date

    from app.models import GastoCaja

    admin = entorno_pg["admin"]
    sesion_pg.add(
        GastoCaja(
            fecha=date(2026, 10, 3), unidad_negocio=UnidadNegocio.IMPRENTA, monto=5,
            motivo="Tinta", registrado_por=admin.id,
        )
    )
    await sesion_pg.flush()

    with pytest.raises(IntegrityError):
        async with sesion_pg.begin_nested():
            sesion_pg.add(
                GastoCaja(
                    fecha=date(2026, 10, 3), unidad_negocio=UnidadNegocio.IMPRENTA, monto=0,
                    motivo="Nada", registrado_por=admin.id,
                )
            )
            await sesion_pg.flush()


async def test_corte_asignado_a_un_pedido_se_serializa_sin_cargas_perezosas_en_postgres(
    sesion_pg, entorno_pg
):
    """
    #71: serializar un corte recién creado lee `consumo.orden` y la pieza. En
    SQLite una carga perezosa pasa sin avisar; en PostgreSQL con asyncpg
    revienta con MissingGreenlet (le pasó tres veces a este proyecto).
    """
    from app.schemas.inventario import ConsumoPiezaCreateData, PiezaLoteCreateData
    from app.services import inventario_service
    from app.services.serializadores import serializar_consumo

    admin, material, cliente = entorno_pg["admin"], entorno_pg["material"], entorno_pg["cliente"]
    orden = await ordenes_service.crear_orden(
        sesion_pg, datos_orden(material.id, cliente_id=cliente.id), admin
    )
    pieza = await inventario_service.registrar_pieza(
        sesion_pg,
        PiezaLoteCreateData(
            material_id=material.id, codigo_identificador=f"R71-{SUFIJO}", capacidad_inicial=5,
            unidad_medida="m",
        ),
        admin,
    )

    consumo = await inventario_service.registrar_consumo_pieza(
        sesion_pg,
        pieza.id,
        ConsumoPiezaCreateData(trabajo_descripcion="Banner", cantidad_consumida=2, orden_id=orden.id),
        admin,
    )
    fila = serializar_consumo(consumo)

    assert fila["orden_codigo"] == orden.codigo
    assert fila["pieza_codigo"] == f"R71-{SUFIJO}"
    assert fila["saldo_restante_pieza"] == 3
    delante = await inventario_service.consumos_de_orden(sesion_pg, orden.id)
    assert [c.id for c in delante] == [consumo.id]


async def test_entrega_con_saldo_autorizada_y_cuentas_por_cobrar_en_postgres(sesion_pg, entorno_pg):
    """
    #72: autorizar una entrega con saldo escribe las columnas nuevas (FK a
    usuarios incluida), serializa sin cargas perezosas y aparece en la vista de
    cuentas por cobrar con su antigüedad.
    """
    from app.models import Cliente
    from app.schemas import MaterialEstimado
    from app.services import finanzas_service
    from app.services.serializadores import serializar_orden

    admin, material = entorno_pg["admin"], entorno_pg["material"]
    corporativo = Cliente(nombre=f"Cliente PG proforma {SUFIJO}")
    sesion_pg.add(corporativo)
    await sesion_pg.flush()

    orden = await ordenes_service.crear_orden(
        sesion_pg,
        datos_orden(material.id, cliente_id=corporativo.id, tipo_documento="proforma"),
        admin,
    )
    await ordenes_service.completar(
        sesion_pg, orden.id, [MaterialEstimado(material_id=material.id, cantidad=2)], admin
    )
    entregada = await ordenes_service.cambiar_estado(
        sesion_pg, orden.id, EstadoOrden.ENTREGADA, admin,
        autorizar_saldo=True, motivo="Orden de compra mensual",
    )
    datos = serializar_orden(entregada)

    assert datos["entregada_con_saldo"] is True
    assert datos["entrega_autorizada"]["por"] == admin.nombre
    assert datos["entrega_autorizada"]["motivo"] == "Orden de compra mensual"

    cuentas = await finanzas_service.cuentas_por_cobrar(sesion_pg)
    fila = next(f for f in cuentas["clientes"] if f["cliente_id"] == corporativo.id)
    assert fila["saldo_pendiente"] == 50
    assert fila["ordenes"][0]["dias"] == 0
    assert fila["ordenes"][0]["entrega_autorizada_por"] == admin.nombre


async def test_corte_cobrado_entra_a_caja_y_serializa_en_postgres(sesion_pg, entorno_pg):
    """
    #57: un corte cobrado sin pedido crea su venta rápida (pago conforme), el
    corte serializado la referencia y el monto aparece en el arqueo real.
    """
    from app.schemas.inventario import ConsumoPiezaCreateData, PiezaLoteCreateData
    from app.services import inventario_service
    from app.services.serializadores import serializar_consumo

    admin, material = entorno_pg["admin"], entorno_pg["material"]
    pieza = await inventario_service.registrar_pieza(
        sesion_pg,
        PiezaLoteCreateData(
            material_id=material.id,
            codigo_identificador=f"R57-{SUFIJO}",
            capacidad_inicial=5,
            unidad_medida="m",
            costo_adquisicion=100,
        ),
        admin,
    )

    consumo = await inventario_service.registrar_consumo_pieza(
        sesion_pg,
        pieza.id,
        ConsumoPiezaCreateData(
            trabajo_descripcion="Stickers UV DTF",
            cantidad_consumida=1,
            monto_cobrado=30,
            metodo_pago=MetodoPago.EFECTIVO,
        ),
        admin,
    )

    fila = serializar_consumo(consumo)
    assert fila["orden_codigo"] is not None
    assert fila["monto_cobrado"] == 30

    # La base del CI ya trae los datos demo del seed: se ubica el cobro por su
    # orden en vez de comparar el total del día.
    resumen = await caja_service.resumen_dia(sesion_pg, a_fecha_peru(ahora_utc()))
    cobro = next(f for f in resumen["detalle"] if f["orden_id"] == consumo.orden_id)
    assert cobro["monto"] == 30
    assert cobro["metodo"] == "efectivo"

