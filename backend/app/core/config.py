"""Configuración centralizada del backend.

Todas las variables de entorno se leen aquí y en ningún otro lugar, para que
sea evidente de qué depende el sistema para arrancar. En desarrollo toma los
valores por defecto; en producción se inyectan por entorno o archivo .env.
"""
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # ── Aplicación ──────────────────────────────────────────────────────────
    app_nombre: str = "API Impresos Trujillo"
    entorno: str = "desarrollo"
    log_level: str = "INFO"

    # ── Base de datos (PostgreSQL) ──────────────────────────────────────────
    database_url: str = (
        "postgresql+asyncpg://impresos:impresos@localhost:5432/impresos"
    )

    # ── CORS ────────────────────────────────────────────────────────────────
    # Varios dominios separados por coma: útil mientras se define el dominio.
    allowed_origins: str = "http://localhost:4200"

    # ── Autenticación (JWT + bcrypt) ────────────────────────────────────────
    jwt_secret: str = "cambia-esta-clave-en-produccion"
    jwt_algoritmo: str = "HS256"
    # Un turno completo de atención (10 AM – 8 PM) más margen.
    jwt_expiracion_minutos: int = 720

    # ── Reglas del negocio ──────────────────────────────────────────────────
    # Perú es UTC-5 todo el año (no aplica horario de verano).
    peru_utc_offset_horas: int = -5
    # RN-01: adelanto mínimo para clientes generales (los corporativos con
    # orden de compra formal quedan exceptuados).
    adelanto_minimo_porcentaje: float = 50.0
    # Tasa de IGV usada cuando el contrato marca "incluye IGV".
    igv_porcentaje: float = 18.0

    @property
    def origenes_permitidos(self) -> list[str]:
        return [origen.strip() for origen in self.allowed_origins.split(",") if origen.strip()]


@lru_cache
def obtener_settings() -> Settings:
    """Instancia única de la configuración (cacheada)."""
    return Settings()


settings = obtener_settings()
