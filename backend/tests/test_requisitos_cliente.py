"""Requisitos que pidió el cliente en la reunión 5 (issues #69, #71, #72, #109, #110, #112).

Cada bloque verifica el comportamiento a nivel de API, que es lo que consume la
pantalla; las reglas de fondo se prueban en sus archivos específicos.
"""
from tests.apoyo import cabecera_token, datos_orden


def _payload(material, **cambios) -> dict:
    return datos_orden(material.id, **cambios).model_dump(mode="json")


async def _crear(cliente_api, usuario, material, **cambios) -> dict:
    respuesta = await cliente_api.post(
        "/api/ordenes", json=_payload(material, **cambios), headers=cabecera_token(usuario)
    )
    assert respuesta.status_code == 200, respuesta.text
    return respuesta.json()["data"]


# ══ #69 · Canal por el que entra el contrato ══════════════════════════════

async def test_canal_de_ingreso_se_guarda_y_se_devuelve(cliente_api, admin, material):
    orden = await _crear(cliente_api, admin, material, canal_ingreso="whatsapp")
    assert orden["canal_ingreso"] == "whatsapp"

    detalle = await cliente_api.get(f"/api/ordenes/{orden['id']}", headers=cabecera_token(admin))
    assert detalle.json()["data"]["canal_ingreso"] == "whatsapp"


async def test_sin_canal_la_orden_queda_como_otro(cliente_api, admin, material):
    orden = await _crear(cliente_api, admin, material)
    assert orden["canal_ingreso"] == "otro"


async def test_un_canal_inexistente_se_rechaza(cliente_api, admin, material):
    cuerpo = _payload(material) | {"canal_ingreso": "paloma_mensajera"}
    respuesta = await cliente_api.post("/api/ordenes", json=cuerpo, headers=cabecera_token(admin))
    assert respuesta.status_code == 422


async def test_editar_la_orden_puede_corregir_el_canal(cliente_api, admin, material):
    orden = await _crear(cliente_api, admin, material, canal_ingreso="llamada")
    editada = await cliente_api.patch(
        f"/api/ordenes/{orden['id']}",
        json=_payload(material, canal_ingreso="correo"),
        headers=cabecera_token(admin),
    )
    assert editada.json()["data"]["canal_ingreso"] == "correo"


async def test_editar_sin_mandar_canal_no_lo_pisa(cliente_api, admin, material):
    """Un cliente de la API anterior a #69 no conoce el campo: no debe borrarlo."""
    orden = await _crear(cliente_api, admin, material, canal_ingreso="whatsapp")
    cuerpo = _payload(material)
    cuerpo.pop("canal_ingreso")

    editada = await cliente_api.patch(
        f"/api/ordenes/{orden['id']}", json=cuerpo, headers=cabecera_token(admin)
    )

    assert editada.json()["data"]["canal_ingreso"] == "whatsapp"


async def test_la_venta_rapida_entra_como_presencial(cliente_api, admin):
    respuesta = await cliente_api.post(
        "/api/ordenes/caja-rapida",
        json={"descripcion": "10 copias", "monto_total": 5},
        headers=cabecera_token(admin),
    )
    assert respuesta.json()["data"]["canal_ingreso"] == "presencial"


async def test_el_listado_filtra_por_canal_y_el_total_acompana(cliente_api, admin, material):
    for canal in ("whatsapp", "whatsapp", "llamada"):
        await _crear(cliente_api, admin, material, canal_ingreso=canal)

    respuesta = await cliente_api.get(
        "/api/ordenes", params={"canal_ingreso": "whatsapp"}, headers=cabecera_token(admin)
    )
    cuerpo = respuesta.json()

    assert cuerpo["total"] == 2
    assert {o["canal_ingreso"] for o in cuerpo["data"]} == {"whatsapp"}


async def test_finanzas_filtra_y_desglosa_por_canal(cliente_api, admin, material):
    await _crear(cliente_api, admin, material, canal_ingreso="whatsapp", precio_total=100)
    await _crear(cliente_api, admin, material, canal_ingreso="llamada", precio_total=40, adelanto_pago=20)

    todo = (await cliente_api.get("/api/finanzas/resumen", headers=cabecera_token(admin))).json()["data"]
    assert todo["por_canal_ingreso"]["whatsapp"]["contratos"] == 100
    assert todo["por_canal_ingreso"]["llamada"]["contratos"] == 40
    assert todo["por_canal_ingreso"]["presencial"]["contratos"] == 0

    solo_llamada = (
        await cliente_api.get(
            "/api/finanzas/resumen", params={"canal_ingreso": "llamada"}, headers=cabecera_token(admin)
        )
    ).json()["data"]
    assert solo_llamada["total_contratos"] == 40
    assert solo_llamada["total_ordenes"] == 1


async def test_el_catalogo_publica_los_canales_con_su_nombre(cliente_api, admin):
    respuesta = await cliente_api.get("/api/configuracion", headers=cabecera_token(admin))
    canales = {c["valor"]: c["etiqueta"] for c in respuesta.json()["data"]["catalogos"]["canales_ingreso"]}
    assert canales == {
        "whatsapp": "WhatsApp",
        "llamada": "Llamada",
        "presencial": "Presencial",
        "correo": "Correo",
        "otro": "Otro",
    }
