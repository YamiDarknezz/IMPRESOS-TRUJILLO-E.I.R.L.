"""Configuración centralizada del backend.

Todas las variables de entorno se leen aquí y en ningún otro lugar, para que
sea evidente de qué depende el sistema para arrancar. En desarrollo toma los
valores por defecto; en producción se inyectan por entorno o archivo .env.
"""
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict

# Compartido con la validación de arranque en app/main.py: si ENTORNO=produccion
# sigue usando este valor, el arranque se niega (issue #52).
JWT_SECRET_POR_DEFECTO = "cambia-esta-clave-en-produccion"


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
    jwt_secret: str = JWT_SECRET_POR_DEFECTO
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


def validar_jwt_secret(entorno: str, jwt_secret: str) -> None:
    """
    Con el secreto por defecto, cualquiera que lea el código puede firmar un
    token de administrador válido: se niega a arrancar en producción con él.
    """
    if entorno == "produccion" and jwt_secret == JWT_SECRET_POR_DEFECTO:
        raise RuntimeError(
            "JWT_SECRET sigue en su valor por defecto con ENTORNO=produccion. "
            "Configura una clave propia antes de arrancar."
        )
