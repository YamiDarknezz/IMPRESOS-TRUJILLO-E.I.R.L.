"""Alta de rollos y planchas por HTTP: POST /api/inventario/piezas.

Ninguna prueba cubría este endpoint de punta a punta: las de inventario llaman
a `inventario_service.registrar_pieza()` directamente, así que no veían que el
router responde con `serializar_pieza(pieza)`, y esa función lee
`pieza.material` (una relación lazy) del objeto recién creado. Si la relación
no está cargada, SQLAlchemy intenta un SELECT implícito en contexto async y la
petición muere con `MissingGreenlet` (500) en lugar de dar de alta el rollo.

Aquí la app usa su propio engine (una sesión por petición, como en producción),
que es el escenario donde ese fallo aparece; con la sesión compartida de las
pruebas normales el material ya está en la identity map y el problema se tapa.
"""
import uuid

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.pool import NullPool

from app.core.config import settings
from app.core.security import crear_token, hash_password
from app.main import app
from app.models import Material, PiezaLoteMaterial, Rol, Unidad, Usuario

pytestmark = pytest.mark.postgres

SUFIJO = uuid.uuid4().hex[:8]


async def test_alta_de_rollo_por_api_devuelve_la_pieza_creada():
    engine = create_async_engine(settings.database_url, poolclass=NullPool)
    fabrica = async_sessionmaker(engine, expire_on_commit=False)

    async with fabrica() as sesion:
        unidad = Unidad(nombre=f"m2 api piezas {SUFIJO}", abreviatura="m2")
        sesion.add(unidad)
        await sesion.flush()
        material = Material(
            nombre=f"Lona api piezas {SUFIJO}",
            unidad=unidad,
            stock_actual=10,
            alerta_minima=3,
            dias_reabastecimiento=5,
        )
        admin = Usuario(
            nombre="Admin API piezas",
            email=f"admin-piezas-{SUFIJO}@test.pe",
            password_hash=hash_password("secreto123"),
            rol=Rol.ADMIN,
        )
        sesion.add_all([material, admin])
        await sesion.commit()
        material_id = material.id
        material_nombre = material.nombre
        unidad_id = unidad.id
        admin_id = admin.id
        token = crear_token(admin)

    codigo = f"ROLL-API-{SUFIJO}"
    try:
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as cliente:
            respuesta = await cliente.post(
                "/api/inventario/piezas",
                json={
                    "material_id": material_id,
                    "codigo_identificador": codigo,
                    "capacidad_inicial": 100,
                    "unidad_medida": "m",
                    "costo_adquisicion": 250,
                },
                headers={"Authorization": f"Bearer {token}"},
            )

        assert respuesta.status_code == 200, respuesta.text
        datos = respuesta.json()["data"]
        assert datos["codigo_identificador"] == codigo
        # El nombre del material sale de la relación que lee el serializador:
        # si la carga no ocurre, no puede llegar por casualidad.
        assert datos["material_nombre"] == material_nombre
        assert datos["saldo_restante"] == 100
        assert datos["consumos"] == []

        # Y el rollo quedó de verdad en la base.
        async with fabrica() as sesion:
            guardada = (
                await sesion.execute(
                    select(PiezaLoteMaterial).where(
                        PiezaLoteMaterial.codigo_identificador == codigo
                    )
                )
            ).scalar_one_or_none()
            assert guardada is not None
    finally:
        # La petición confirma su propia transacción, así que lo creado se
        # retira a mano (la del alta también deja su movimiento de stock).
        async with fabrica() as sesion:
            await sesion.execute(
                text(
                    "DELETE FROM consumos_pieza WHERE pieza_id IN "
                    "(SELECT id FROM piezas_lote_material WHERE material_id = :m)"
                ),
                {"m": material_id},
            )
            await sesion.execute(
                text("DELETE FROM piezas_lote_material WHERE material_id = :m"),
                {"m": material_id},
            )
            await sesion.execute(
                text("DELETE FROM movimientos_stock WHERE material_id = :m"),
                {"m": material_id},
            )
            await sesion.execute(
                text("DELETE FROM auditoria WHERE usuario_id = :a"), {"a": admin_id}
            )
            await sesion.execute(
                text("DELETE FROM materiales WHERE id = :m"), {"m": material_id}
            )
            await sesion.execute(
                text("DELETE FROM unidades WHERE id = :u"), {"u": unidad_id}
            )
            await sesion.execute(
                text("DELETE FROM usuarios WHERE id = :a"), {"a": admin_id}
            )
            await sesion.commit()
        await engine.dispose()
