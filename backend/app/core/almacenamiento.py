"""Dónde viven los comprobantes de pago (RF-11, issue #67).

El resto del sistema nunca escribe archivos: pide el almacén configurado y usa
tres operaciones (`guardar`, `leer`, `borrar`). Hoy ese almacén es una carpeta
del disco de datos del VPS; el día que se mude a Cloudflare R2 o Backblaze B2
basta con poner `ALMACENAMIENTO=s3` y las claves en el `.env`, sin tocar el
resto del sistema ni la base de datos.

Las claves las genera este módulo y son aleatorias: el nombre del archivo no
se puede deducir de la orden ni del pago, así que una URL no se adivina.
"""
import re
import secrets
from functools import lru_cache
from pathlib import Path
from typing import Protocol

from starlette.concurrency import run_in_threadpool

from app.core.config import settings
from app.core.errores import ErrorDeNegocio, NoEncontrado

# Una clave válida: 32 caracteres aleatorios y una extensión corta. Se valida
# antes de tocar el disco para que un valor manipulado no pueda salirse de la
# carpeta del almacén.
CLAVE_VALIDA = re.compile(r"^[A-Za-z0-9_-]{20,64}\.[a-z0-9]{2,5}$")


def clave_aleatoria(extension: str) -> str:
    """Clave del archivo en el almacén. 32 bytes de entropía y su extensión."""
    return f"{secrets.token_urlsafe(24)}.{extension}"


def validar_clave(clave: str) -> str:
    if not CLAVE_VALIDA.match(clave):
        raise ErrorDeNegocio("La referencia del comprobante no es válida.")
    return clave


class Almacen(Protocol):
    """Lo que el sistema necesita de un almacén de archivos."""

    async def guardar(self, clave: str, datos: bytes, tipo_mime: str) -> None: ...

    async def leer(self, clave: str) -> bytes: ...

    async def borrar(self, clave: str) -> None: ...


class AlmacenLocal:
    """Carpeta del disco. La ruta llega por configuración, nunca por la petición."""

    def __init__(self, raiz: str) -> None:
        self.raiz = Path(raiz)

    def _ruta(self, clave: str) -> Path:
        # Subcarpeta por los dos primeros caracteres: con miles de comprobantes
        # un único directorio se vuelve lento de listar y respaldar.
        return self.raiz / clave[:2] / validar_clave(clave)

    async def guardar(self, clave: str, datos: bytes, tipo_mime: str) -> None:
        destino = self._ruta(clave)
        destino.parent.mkdir(parents=True, exist_ok=True)
        await run_in_threadpool(destino.write_bytes, datos)

    async def leer(self, clave: str) -> bytes:
        ruta = self._ruta(clave)
        if not ruta.is_file():
            raise NoEncontrado("El comprobante ya no está disponible.")
        return await run_in_threadpool(ruta.read_bytes)

    async def borrar(self, clave: str) -> None:
        ruta = self._ruta(clave)
        if ruta.is_file():
            await run_in_threadpool(ruta.unlink)


class AlmacenS3:
    """
    Bucket compatible con S3: Cloudflare R2, Backblaze B2 o MinIO.

    boto3 es sincrónico, así que cada llamada se manda a un hilo: bloquear el
    bucle de eventos de la API mientras sube un archivo frenaría a todos.
    """

    def __init__(self, endpoint: str, bucket: str, access_key: str, secret_key: str, region: str) -> None:
        import boto3  # Import perezoso: en modo local no se carga el SDK.

        self.bucket = bucket
        self.cliente = boto3.client(
            "s3",
            endpoint_url=endpoint,
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            region_name=region,
        )

    async def guardar(self, clave: str, datos: bytes, tipo_mime: str) -> None:
        validar_clave(clave)
        await run_in_threadpool(
            lambda: self.cliente.put_object(
                Bucket=self.bucket, Key=clave, Body=datos, ContentType=tipo_mime
            )
        )

    async def leer(self, clave: str) -> bytes:
        validar_clave(clave)

        def descargar() -> bytes:
            respuesta = self.cliente.get_object(Bucket=self.bucket, Key=clave)
            return respuesta["Body"].read()

        try:
            return await run_in_threadpool(descargar)
        except Exception as error:  # botocore.exceptions.ClientError
            if "NoSuchKey" in str(error) or "404" in str(error):
                raise NoEncontrado("El comprobante ya no está disponible.") from error
            raise

    async def borrar(self, clave: str) -> None:
        validar_clave(clave)
        await run_in_threadpool(
            lambda: self.cliente.delete_object(Bucket=self.bucket, Key=clave)
        )


@lru_cache
def obtener_almacen() -> Almacen:
    """Almacén configurado. Se construye una vez por proceso."""
    if settings.almacenamiento == "s3":
        return AlmacenS3(
            endpoint=settings.s3_endpoint,
            bucket=settings.s3_bucket,
            access_key=settings.s3_access_key,
            secret_key=settings.s3_secret_key,
            region=settings.s3_region,
        )
    return AlmacenLocal(settings.directorio_comprobantes)
