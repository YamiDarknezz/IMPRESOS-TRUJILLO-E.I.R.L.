"""Conexión única a PostgreSQL (SQLAlchemy 2.0 asíncrono).

Se crea un solo engine al importar el módulo; el resto del sistema obtiene
sesiones desde `obtener_sesion`, que es también la dependencia de FastAPI:

* si la petición termina bien, la transacción se confirma;
* si algo falla, se revierte completa (nada de escrituras a medias).
"""
from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings

engine = create_async_engine(
    settings.database_url,
    echo=False,
    pool_pre_ping=True,
)

FabricaSesiones = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


async def obtener_sesion() -> AsyncGenerator[AsyncSession, None]:
    """Dependencia de FastAPI: una sesión por petición, con transacción."""
    async with FabricaSesiones() as sesion:
        try:
            yield sesion
            await sesion.commit()
        except Exception:
            await sesion.rollback()
            raise
