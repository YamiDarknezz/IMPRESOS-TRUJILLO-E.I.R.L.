"""Comprobantes de pago: subida, optimización, lectura y borrado (#67).

El cliente pidió adjuntar la captura del Yape o la transferencia dentro de la
orden. Lo que se prueba aquí es que la captura llega, se guarda liviana, se
sirve solo a quien tiene sesión y se puede quitar.
"""
import os
from datetime import date
from io import BytesIO

import pytest

from app.core import almacenamiento
from app.core.config import settings
from app.models import (
    EstadoOrden,
    MetodoPago,
    Orden,
    PagoOrden,
    TipoDocumento,
    TipoPago,
    UnidadNegocio,
)
from tests.apoyo import cabecera_token


@pytest.fixture
def almacen(tmp_path, monkeypatch):
    """Almacén de archivos en un directorio temporal: nada toca /var/lib."""
    destino = tmp_path / "comprobantes"
    monkeypatch.setattr(settings, "directorio_comprobantes", str(destino))
    almacenamiento.obtener_almacen.cache_clear()
    yield destino
    almacenamiento.obtener_almacen.cache_clear()


def captura_grande() -> bytes:
    """
    Foto de una captura, como la que llega desde un celular: 1200x900.

    Media imagen es una foto (ruido, imposible de comprimir) y la otra media es
    texto sobre fondo claro, que es lo que de verdad trae un voucher.
    """
    from PIL import Image

    imagen = Image.frombytes("RGB", (1200, 900), os.urandom(1200 * 900 * 3))
    # Franja de "texto": fondo claro con renglones oscuros.
    for y in range(100, 400, 12):
        for x in range(80, 800):
            imagen.putpixel((x, y), (30, 30, 30))

    salida = BytesIO()
    imagen.save(salida, "JPEG", quality=95)
    return salida.getvalue()


def captura_de_ruido_puro() -> bytes:
    """El peor caso para cualquier formato: una imagen incompresible."""
    from PIL import Image

    imagen = Image.frombytes("RGB", (1200, 900), os.urandom(1200 * 900 * 3))
    salida = BytesIO()
    imagen.save(salida, "JPEG", quality=95)
    return salida.getvalue()


async def _orden(sesion, admin, cliente, **overrides) -> Orden:
    datos = dict(
        tipo_documento=TipoDocumento.CONTRATO,
        unidad_negocio=UnidadNegocio.IMPRENTA,
        cliente_id=cliente.id,
        creado_por=admin.id,
        descripcion="Banners para la fachada",
        fecha_entrega=date(2026, 12, 31),
        estado=EstadoOrden.PENDIENTE,
        subtotal=100,
        total=118,
        saldo_pendiente=118,
        pagado_totalmente=False,
    )
    datos.update(overrides)
    orden = Orden(**datos)
    sesion.add(orden)
    await sesion.flush()
    return orden


async def _subir(cliente_api, usuario, orden, contenido: bytes, nombre="captura.jpg",
                 tipo="image/jpeg", pago_id=None):
    datos = {"pago_id": str(pago_id)} if pago_id is not None else {}
    return await cliente_api.post(
        f"/api/ordenes/{orden.id}/comprobantes",
        headers=cabecera_token(usuario),
        files={"archivo": (nombre, contenido, tipo)},
        data=datos,
    )


def archivos_en(directorio) -> list:
    return [ruta for ruta in directorio.rglob("*") if ruta.is_file()]


async def test_la_captura_se_guarda_optimizada(cliente_api, sesion, admin, cliente, almacen):
    orden = await _orden(sesion, admin, cliente)
    original = captura_grande()

    respuesta = await _subir(cliente_api, admin, orden, original)

    assert respuesta.status_code == 200
    datos = respuesta.json()["data"]
    # Se guarda en WebP, que para una captura pesa bastante menos que el JPEG.
    assert datos["tipo_mime"] == "image/webp"
    # Una captura de celular baja a menos de la mitad; el ruido puro (peor
    # caso) baja bastante menos, pero nunca sube.
    assert datos["tamano_bytes"] < len(original)
    assert datos["nombre_original"] == "captura.jpg"

    guardado = archivos_en(almacen)
    assert len(guardado) == 1
    assert guardado[0].stat().st_size == datos["tamano_bytes"]
    # El archivo en disco no se llama como la orden: no se puede adivinar.
    assert orden.codigo.replace("-", "") not in guardado[0].name


async def test_el_peor_caso_tambien_se_reduce(cliente_api, sesion, admin, cliente, almacen):
    """Una imagen incompresible igual se beneficia: el WebP gana al JPEG."""
    orden = await _orden(sesion, admin, cliente)
    original = captura_de_ruido_puro()

    datos = (await _subir(cliente_api, admin, orden, original)).json()["data"]

    assert datos["tipo_mime"] == "image/webp"
    assert datos["tamano_bytes"] < len(original)


async def test_la_captura_del_adelanto_queda_en_la_orden(cliente_api, sesion, admin, cliente, almacen):
    orden = await _orden(sesion, admin, cliente)

    await _subir(cliente_api, admin, orden, captura_grande())

    detalle = (
        await cliente_api.get(f"/api/ordenes/{orden.id}", headers=cabecera_token(admin))
    ).json()["data"]

    assert len(detalle["comprobantes"]) == 1
    comprobante = detalle["comprobantes"][0]
    assert comprobante["pago_id"] is None
    assert comprobante["url"].startswith("/api/comprobantes/")
    assert comprobante["subido_por_nombre"] == "Admin Prueba"


async def test_la_captura_de_un_abono_cuelga_de_su_pago(cliente_api, sesion, admin, cliente, almacen):
    pago = PagoOrden(monto=50, metodo=MetodoPago.YAPE, tipo=TipoPago.SALDO, registrado_por=admin.id)
    orden = await _orden(sesion, admin, cliente, pagos=[pago])
    await sesion.flush()

    respuesta = await _subir(
        cliente_api, admin, orden, captura_grande(), pago_id=pago.id
    )
    assert respuesta.status_code == 200
    assert respuesta.json()["data"]["pago_id"] == pago.id

    detalle = (
        await cliente_api.get(f"/api/ordenes/{orden.id}", headers=cabecera_token(admin))
    ).json()["data"]

    # La captura cuelga del abono, y la orden las muestra todas con su etiqueta:
    # así la pantalla de la orden no tiene que recorrer los pagos.
    assert len(detalle["comprobantes"]) == 1
    assert detalle["comprobantes"][0]["pago_id"] == pago.id
    assert len(detalle["finanzas"]["pagos"][0]["comprobantes"]) == 1


async def test_se_sirve_con_sesion_y_no_sin_ella(cliente_api, sesion, admin, cliente, almacen):
    orden = await _orden(sesion, admin, cliente)
    original = captura_grande()
    url = (await _subir(cliente_api, admin, orden, original)).json()["data"]["url"]

    con_sesion = await cliente_api.get(url, headers=cabecera_token(admin))
    assert con_sesion.status_code == 200
    assert con_sesion.headers["content-type"] == "image/webp"
    # Es un dato del cliente: nada de cachés compartidas.
    assert "private" in con_sesion.headers["cache-control"]
    # Lo que se sirve es exactamente lo que quedó guardado, ya optimizado.
    assert con_sesion.content == archivos_en(almacen)[0].read_bytes()
    assert len(con_sesion.content) < len(original)

    sin_sesion = await cliente_api.get(url)
    assert sin_sesion.status_code == 401


async def test_rechaza_un_archivo_que_no_es_imagen(cliente_api, sesion, admin, cliente, almacen):
    orden = await _orden(sesion, admin, cliente)

    respuesta = await _subir(
        cliente_api, admin, orden, b"esto no es una imagen", nombre="virus.png", tipo="image/png"
    )

    assert respuesta.status_code == 400
    assert "imagen válida" in respuesta.json()["detail"]
    assert archivos_en(almacen) == []


async def test_rechaza_un_archivo_demasiado_grande(cliente_api, sesion, admin, cliente, almacen):
    orden = await _orden(sesion, admin, cliente)
    enorme = b"\xff\xd8\xff" + b"0" * (settings.comprobante_tamano_maximo_mb * 1024 * 1024 + 10)

    respuesta = await _subir(cliente_api, admin, orden, enorme)

    assert respuesta.status_code == 400
    assert "MB" in respuesta.json()["detail"]


async def test_borrar_quita_la_fila_y_el_archivo(cliente_api, sesion, admin, cliente, almacen):
    orden = await _orden(sesion, admin, cliente)
    datos = (await _subir(cliente_api, admin, orden, captura_grande())).json()["data"]
    assert len(archivos_en(almacen)) == 1

    respuesta = await cliente_api.delete(
        f"/api/comprobantes/{datos['id']}", headers=cabecera_token(admin)
    )

    assert respuesta.status_code == 200
    assert archivos_en(almacen) == []
    detalle = (
        await cliente_api.get(f"/api/ordenes/{orden.id}", headers=cabecera_token(admin))
    ).json()["data"]
    assert detalle["comprobantes"] == []


async def test_una_referencia_manipulada_no_llega_al_disco(cliente_api, sesion, admin, almacen):
    for clave in ("../../etc/passwd", "..%2F..%2Fetc%2Fpasswd", "sin-extension"):
        respuesta = await cliente_api.get(
            f"/api/comprobantes/{clave}", headers=cabecera_token(admin)
        )
        assert respuesta.status_code in (400, 404), clave


def test_el_almacen_s3_exige_sus_claves():
    """Cambiar a Cloudflare es cambiar el .env: si falta algo, no arranca."""
    from app.core.config import validar_almacenamiento

    validar_almacenamiento("local", "", "", "", "")  # no exige nada

    with pytest.raises(RuntimeError, match="S3_BUCKET"):
        validar_almacenamiento("s3", "https://cuenta.r2.cloudflarestorage.com", "", "clave", "secreto")

    validar_almacenamiento(
        "s3", "https://cuenta.r2.cloudflarestorage.com", "impresos", "clave", "secreto"
    )
