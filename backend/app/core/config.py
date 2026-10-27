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

    # ── Datos de la empresa para el contrato impreso (#68) ──────────────────
    # Son los datos públicos de la ficha RUC; se pueden sobrescribir por entorno
    # (EMPRESA_*) sin tocar código, y la pantalla los lee de /api/configuracion.
    empresa_razon_social: str = "IMPRESOS TRUJILLO E.I.R.L."
    empresa_ruc: str = "20602572952"
    empresa_direccion: str = "JR. SIMON BOLIVAR NRO. 945 INT. 1, TRUJILLO, LA LIBERTAD"
    empresa_telefono: str = "924 943 790"
    empresa_horario: str = "Lunes a sábado de 10 AM a 8 PM"

    # ── Comprobantes de pago (RF-11) ────────────────────────────────────────
    # Capturas de Yape o transferencia adjuntas a una orden o a uno de sus
    # pagos. Se guardan fuera del contenedor: la API puede reconstruirse en
    # cada despliegue sin perderlas.
    #
    # `almacenamiento` decide DÓNDE viven. Hoy `local` (el disco de datos del
    # VPS); el día que se mude a Cloudflare R2 o Backblaze B2 es `s3` y se
    # completan las claves: no hay que tocar código.
    almacenamiento: str = "local"
    directorio_comprobantes: str = "/var/lib/impresos/comprobantes"
    # Límite de subida; por encima se rechaza en el propio endpoint.
    comprobante_tamano_maximo_mb: int = 5
    # Lado mayor tras optimizar. Una captura de celular baja de ~3 MB a ~150 KB.
    comprobante_lado_maximo_px: int = 1600
    comprobante_calidad: int = 82

    # ── Almacén S3 (solo si almacenamiento=s3) ──────────────────────────────
    # Compatible con Cloudflare R2, Backblaze B2 y MinIO: solo cambian estos
    # valores. Para R2, `s3_endpoint` es https://<cuenta>.r2.cloudflarestorage.com
    # y la región es "auto".
    s3_endpoint: str = ""
    s3_bucket: str = ""
    s3_access_key: str = ""
    s3_secret_key: str = ""
    s3_region: str = "auto"

    @property
    def origenes_permitidos(self) -> list[str]:
        return [origen.strip() for origen in self.allowed_origins.split(",") if origen.strip()]


@lru_cache
def obtener_settings() -> Settings:
    """Instancia única de la configuración (cacheada)."""
    return Settings()


settings = obtener_settings()


def validar_almacenamiento(almacenamiento: str, endpoint: str, bucket: str,
                           access_key: str, secret_key: str) -> None:
    """
    Con `almacenamiento=s3` pero sin credenciales, la aplicación arrancaría y
    fallaría al primer comprobante subido. Mejor negarse a arrancar y decirlo.
    """
    if almacenamiento != "s3":
        return
    faltan = [
        nombre
        for nombre, valor in (
            ("S3_ENDPOINT", endpoint),
            ("S3_BUCKET", bucket),
            ("S3_ACCESS_KEY", access_key),
            ("S3_SECRET_KEY", secret_key),
        )
        if not valor.strip()
    ]
    if faltan:
        raise RuntimeError(
            f"ALMACENAMIENTO=s3 necesita estas variables: {', '.join(faltan)}. "
            "Complétalas o vuelve a ALMACENAMIENTO=local."
        )


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
