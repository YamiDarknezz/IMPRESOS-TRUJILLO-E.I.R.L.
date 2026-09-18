"""Fixtures compartidas de las pruebas.

Las pruebas de reglas son síncronas y no tocan la base. Las de integración
levantan un SQLite en memoria con el MISMO metadata de los modelos, de modo
que el flujo completo (reservar stock, cobrar, entregar) se pueda verificar
sin depender de PostgreSQL.

Las pruebas marcadas como `postgres` corren contra el PostgreSQL real de
docker-compose y se saltan solas si la base no está disponible.
"""
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.pool import StaticPool

from app.core.database import obtener_sesion
from app.core.security import hash_password
from app.main import app
from app.models import (
    Base,
    Cliente,
    Material,
    Producto,
    ProductoMaterial,
    Rol,
    TipoProducto,
    Unidad,
    Usuario,
)


@pytest_asyncio.fixture
async def sesion():
    """Sesión async contra un SQLite en memoria con el esquema completo."""
    engine = create_async_engine(
        "sqlite+aiosqlite://",
        poolclass=StaticPool,
        connect_args={"check_same_thread": False},
    )
    async with engine.begin() as conexion:
        await conexion.run_sync(Base.metadata.create_all)

    fabrica = async_sessionmaker(engine, expire_on_commit=False)
    async with fabrica() as sesion:
        yield sesion

    await engine.dispose()


@pytest_asyncio.fixture
async def admin(sesion):
    usuario = Usuario(
        nombre="Admin Prueba",
        email="admin@impresos.test",
        password_hash=hash_password("secreto123"),
        rol=Rol.ADMIN,
    )
    sesion.add(usuario)
    await sesion.flush()
    return usuario


@pytest_asyncio.fixture
async def operario(sesion):
    usuario = Usuario(
        nombre="Operario Prueba",
        email="operario@impresos.test",
        password_hash=hash_password("secreto123"),
        rol=Rol.OPERARIO,
    )
    sesion.add(usuario)
    await sesion.flush()
    return usuario


@pytest_asyncio.fixture
async def unidad(sesion):
    unidad = Unidad(nombre="metros cuadrados", abreviatura="m2")
    sesion.add(unidad)
    await sesion.flush()
    return unidad


@pytest_asyncio.fixture
async def material(sesion, unidad):
    material = Material(
        nombre="Lona 13 oz",
        unidad=unidad,
        stock_actual=10,
        alerta_minima=3,
        dias_reabastecimiento=5,
    )
    sesion.add(material)
    await sesion.flush()
    return material


@pytest_asyncio.fixture
async def cliente(sesion):
    cliente = Cliente(nombre="Cliente Persona Prueba", telefono="999888777")
    sesion.add(cliente)
    await sesion.flush()
    return cliente


@pytest_asyncio.fixture
async def cliente_corporativo(sesion):
    cliente = Cliente(
        nombre="Cámara Corporativa Prueba",
        es_corporativo=True,
        telefono="044222333",
    )
    sesion.add(cliente)
    await sesion.flush()
    return cliente


@pytest_asyncio.fixture
async def producto(sesion, material):
    producto = Producto(
        nombre="Gigantografía de prueba",
        tipo=TipoProducto.PROPIO,
        precio_base=30,
        receta=[],
    )
    sesion.add(producto)
    await sesion.flush()
    producto.receta.append(ProductoMaterial(material=material, cantidad=1))
    await sesion.flush()
    return producto


@pytest_asyncio.fixture
async def cliente_api(sesion):
    """Cliente HTTP contra la app real, con la sesión de prueba inyectada."""

    async def _sesion_de_prueba():
        yield sesion
        await sesion.commit()

    app.dependency_overrides[obtener_sesion] = _sesion_de_prueba
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as cliente_http:
        yield cliente_http
    app.dependency_overrides.clear()
