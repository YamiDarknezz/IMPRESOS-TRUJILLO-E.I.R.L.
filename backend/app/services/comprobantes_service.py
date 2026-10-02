"""Comprobantes de pago: subida, optimización y lectura (RF-11, issue #67).

El cliente eligió adjuntar la captura del Yape o la transferencia dentro de la
orden en lugar de integrarse con la API de WhatsApp. Es el respaldo de la
conciliación y de la auditoría de cobros observados ("Yape falso").

Antes de guardar, la imagen se optimiza: una foto de celular de 3 MB queda en
unos 150 KB y, de paso, se van los metadatos EXIF (que incluyen la ubicación
de donde se tomó). El archivo original nunca se guarda.
"""
from io import BytesIO
from typing import Optional

from PIL import Image, ImageOps, UnidentifiedImageError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.almacenamiento import clave_aleatoria, obtener_almacen, validar_clave
from app.core.auditoria import registrar
from app.core.config import settings
from app.core.errores import (
    ErrorDeNegocio,
    NoEncontrado,
    PermisoDenegado,
    logger,
)
from app.models import Comprobante, Orden, PagoOrden, TipoEventoAuditoria, Usuario

# Formatos que se aceptan de entrada. La salida siempre es WebP salvo que el
# archivo ya venga más liviano que lo que podríamos lograr.
EXTENSION_POR_TIPO = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
}
TIPOS_ACEPTADOS = set(EXTENSION_POR_TIPO) | {"application/pdf"}


def optimizar(datos: bytes, tipo_mime: str) -> tuple[bytes, str, str]:
    """
    Deja el comprobante listo para guardarse: legible, liviano y sin EXIF.

    Devuelve (bytes, tipo_mime, extensión). Los PDF se guardan tal cual (el
    cliente firma contratos en papel; una captura pegada en PDF no se puede
    recomprimir sin arruinarla).
    """
    if tipo_mime == "application/pdf":
        if not datos.startswith(b"%PDF-"):
            raise ErrorDeNegocio("El archivo no es un PDF válido.")
        return datos, tipo_mime, "pdf"
    if tipo_mime not in EXTENSION_POR_TIPO:
        raise ErrorDeNegocio("Solo se aceptan capturas en JPG, PNG o WebP, o un PDF.")

    try:
        imagen = Image.open(BytesIO(datos))
        imagen.load()
    except (UnidentifiedImageError, OSError, ValueError, Image.DecompressionBombError):
        raise ErrorDeNegocio(
            "El archivo no es una imagen válida. Sube la captura tal como la "
            "descargaste del banco o de Yape."
        )

    # Respeta la orientación con la que se tomó la foto.
    imagen = ImageOps.exif_transpose(imagen)
    imagen = imagen.convert("RGBA" if imagen.mode in ("RGBA", "LA", "P") else "RGB")
    lado = settings.comprobante_lado_maximo_px
    imagen.thumbnail((lado, lado), Image.Resampling.LANCZOS)

    salida = BytesIO()
    imagen.save(salida, "WEBP", quality=settings.comprobante_calidad, method=4)
    optimizada = salida.getvalue()

    if len(optimizada) >= len(datos):
        # Ya venía más liviana que lo que sabemos lograr: no se toca.
        return datos, tipo_mime, EXTENSION_POR_TIPO[tipo_mime]
    return optimizada, "image/webp", "webp"


async def subir(
    sesion: AsyncSession,
    orden_id: int,
    datos: bytes,
    nombre_original: str,
    tipo_mime: str,
    usuario: Usuario,
    pago_id: Optional[int] = None,
) -> Comprobante:
    """Guarda un comprobante de la orden o de uno de sus pagos."""
    orden = await sesion.get(Orden, orden_id)
    if orden is None:
        raise NoEncontrado("La orden no existe.")

    if pago_id is not None:
        pago = await sesion.get(PagoOrden, pago_id)
        if pago is None or pago.orden_id != orden.id:
            raise NoEncontrado("Ese pago no pertenece a la orden.")

    limite = settings.comprobante_tamano_maximo_mb * 1024 * 1024
    if len(datos) > limite:
        raise ErrorDeNegocio(
            f"La captura pesa más de {settings.comprobante_tamano_maximo_mb} MB. "
            "Súbela en tamaño original o recórtala."
        )
    if not datos:
        raise ErrorDeNegocio("El archivo llegó vacío.")
    if tipo_mime not in TIPOS_ACEPTADOS:
        raise ErrorDeNegocio("Solo se aceptan capturas en JPG, PNG o WebP, o un PDF.")

    contenido, tipo_final, extension = optimizar(datos, tipo_mime)

    clave = clave_aleatoria(extension)
    await obtener_almacen().guardar(clave, contenido, tipo_final)

    comprobante = Comprobante(
        orden_id=orden.id,
        pago_id=pago_id,
        clave=clave,
        nombre_original=nombre_original[:200],
        tipo_mime=tipo_final,
        tamano_bytes=len(contenido),
        subido_por=usuario.id,
    )
    sesion.add(comprobante)
    await sesion.flush()

    ahorro = 100 - round(len(contenido) * 100 / len(datos))
    registrar(
        sesion,
        usuario.id,
        TipoEventoAuditoria.CREAR,
        tabla_afectada="comprobantes",
        registro_id=str(comprobante.id),
        detalle=(
            f"Comprobante adjunto a la orden {orden.codigo}"
            + (f" (abono {pago_id})" if pago_id else " (adelanto)")
            + f": {nombre_original[:60]} — {len(datos) // 1024} KB a {len(contenido) // 1024} KB"
            + (f", {ahorro}% menos" if ahorro > 0 else "")
        ),
    )
    return comprobante


async def listar_de_orden(sesion: AsyncSession, orden_id: int) -> list[Comprobante]:
    consulta = (
        select(Comprobante)
        .where(Comprobante.orden_id == orden_id)
        .order_by(Comprobante.creado_en)
    )
    return list((await sesion.execute(consulta)).scalars())


async def leer(sesion: AsyncSession, clave: str) -> tuple[bytes, str]:
    """Devuelve el contenido del comprobante y su tipo, para servirlo."""
    validar_clave(clave)
    comprobante = (
        await sesion.execute(select(Comprobante).where(Comprobante.clave == clave))
    ).scalar_one_or_none()
    if comprobante is None:
        raise NoEncontrado("Ese comprobante no existe.")

    contenido = await obtener_almacen().leer(comprobante.clave)
    return contenido, comprobante.tipo_mime or "application/octet-stream"


async def borrar(sesion: AsyncSession, id_comprobante: int, usuario: Usuario) -> None:
    """
    Quita el comprobante de la orden y del almacén.

    Son datos de clientes: si el archivo se subió por error, tiene que poder
    desaparecer de verdad, no quedar como fila huérfana.
    """
    comprobante = await sesion.get(Comprobante, id_comprobante)
    if comprobante is None:
        raise NoEncontrado("El comprobante no existe.")
    if comprobante.subido_por not in (None, usuario.id) and usuario.rol.value not in (
        "admin",
        "subgerente",
    ):
        raise PermisoDenegado("Solo quien lo subió o un supervisor puede quitarlo.")

    clave = comprobante.clave
    orden_id = comprobante.orden_id
    # Consulta explícita: `comprobante.orden` es una relación lazy y leerla aquí
    # sería un SELECT implícito (el 500 del alta, #85).
    orden = await sesion.get(Orden, orden_id)
    codigo = orden.codigo if orden else str(orden_id)

    # Primero la fila: si el borrado del archivo falla, lo que queda es un
    # archivo suelto en el almacén, no una captura que la pantalla no puede
    # abrir.
    await sesion.delete(comprobante)
    await sesion.flush()

    try:
        await obtener_almacen().borrar(clave)
    except Exception:  # noqa: BLE001 - el borrado del usuario no se cae por esto
        logger.exception("No se pudo borrar el archivo %s del almacén", clave)

    registrar(
        sesion,
        usuario.id,
        TipoEventoAuditoria.ELIMINAR,
        tabla_afectada="comprobantes",
        registro_id=str(id_comprobante),
        detalle=f"Comprobante quitado de la orden {codigo}",
    )
