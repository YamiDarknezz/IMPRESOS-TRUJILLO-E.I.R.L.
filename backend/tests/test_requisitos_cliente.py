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


# ══ #110 · Historial de adelantos con descripción ═════════════════════════

async def test_el_adelanto_guarda_su_descripcion(cliente_api, admin, material):
    orden = await _crear(cliente_api, admin, material, adelanto_descripcion="Adelanto por los banners")
    [adelanto] = orden["finanzas"]["pagos"]
    assert adelanto["descripcion"] == "Adelanto por los banners"
    assert adelanto["tipo"] == "adelanto"


async def test_editar_la_orden_sin_mandar_descripcion_no_la_borra(cliente_api, admin, material):
    orden = await _crear(cliente_api, admin, material, adelanto_descripcion="Para el diseño")
    cuerpo = _payload(material)
    cuerpo.pop("adelanto_descripcion")

    editada = await cliente_api.patch(
        f"/api/ordenes/{orden['id']}", json=cuerpo, headers=cabecera_token(admin)
    )

    assert editada.json()["data"]["finanzas"]["pagos"][0]["descripcion"] == "Para el diseño"


async def test_editar_la_orden_puede_corregir_la_descripcion(cliente_api, admin, material):
    orden = await _crear(cliente_api, admin, material, adelanto_descripcion="Para el diseño")
    editada = await cliente_api.patch(
        f"/api/ordenes/{orden['id']}",
        json=_payload(material, adelanto_descripcion="Para la impresión"),
        headers=cabecera_token(admin),
    )
    assert editada.json()["data"]["finanzas"]["pagos"][0]["descripcion"] == "Para la impresión"


async def test_el_abono_guarda_su_descripcion(cliente_api, admin, material):
    orden = await _crear(cliente_api, admin, material, precio_total=100, adelanto_pago=50)
    respuesta = await cliente_api.post(
        f"/api/ordenes/{orden['id']}/confirmar-pago",
        json={"monto": 20, "referencia": "OP-77", "descripcion": "Segundo abono, mitad del saldo"},
        headers=cabecera_token(admin),
    )
    pagos = respuesta.json()["data"]["finanzas"]["pagos"]
    abono = next(p for p in pagos if p["tipo"] == "saldo")
    assert abono["descripcion"] == "Segundo abono, mitad del saldo"
    assert abono["referencia"] == "OP-77"


async def test_una_descripcion_demasiado_larga_se_rechaza(cliente_api, admin, material):
    cuerpo = _payload(material) | {"adelanto_descripcion": "x" * 201}
    respuesta = await cliente_api.post("/api/ordenes", json=cuerpo, headers=cabecera_token(admin))
    assert respuesta.status_code == 422


async def test_el_historial_del_cliente_ordena_los_pagos_y_dice_cuanto_falta(
    cliente_api, admin, material, cliente
):
    """Responde "¿cuándo adelantó, cuánto y cuánto le falta?" sin salir del sistema."""
    orden = await _crear(
        cliente_api, admin, material,
        cliente_id=cliente.id, precio_total=100, adelanto_pago=50,
        adelanto_descripcion="Adelanto del banner",
    )
    await cliente_api.post(
        f"/api/ordenes/{orden['id']}/confirmar-pago",
        json={"monto": 25, "descripcion": "Abono de la semana"},
        headers=cabecera_token(admin),
    )

    resumen = (
        await cliente_api.get(f"/api/clientes/{cliente.id}/resumen", headers=cabecera_token(admin))
    ).json()["data"]

    assert resumen["total_adelantado"] == 50
    assert resumen["total_pagado"] == 75
    assert resumen["por_cobrar"] == 25
    historial = resumen["historial_pagos"]
    assert [p["descripcion"] for p in historial] == ["Abono de la semana", "Adelanto del banner"]
    assert [p["saldo_despues"] for p in historial] == [25, 50]
    assert {p["orden_codigo"] for p in historial} == {orden["codigo"]}


async def test_un_pago_observado_aparece_pero_no_cuenta_como_dinero_recibido(
    cliente_api, admin, material, cliente
):
    orden = await _crear(
        cliente_api, admin, material, cliente_id=cliente.id, precio_total=100, adelanto_pago=50
    )
    pago_id = orden["finanzas"]["pagos"][0]["id"]
    observado = await cliente_api.post(
        f"/api/caja/pagos/{pago_id}/observar",
        json={"motivo": "yape_falso", "nota": "No llegó a la cuenta"},
        headers=cabecera_token(admin),
    )
    assert observado.status_code == 200, observado.text

    resumen = (
        await cliente_api.get(f"/api/clientes/{cliente.id}/resumen", headers=cabecera_token(admin))
    ).json()["data"]

    [fila] = resumen["historial_pagos"]
    assert fila["estado_pago"] == "observado"
    assert fila["saldo_despues"] is None
    assert resumen["total_pagado"] == 0
    assert resumen["por_cobrar"] == 100


async def test_el_historial_no_incluye_ordenes_canceladas(cliente_api, admin, material, cliente):
    orden = await _crear(cliente_api, admin, material, cliente_id=cliente.id)
    await cliente_api.post(f"/api/ordenes/{orden['id']}/cancelar", headers=cabecera_token(admin))

    resumen = (
        await cliente_api.get(f"/api/clientes/{cliente.id}/resumen", headers=cabecera_token(admin))
    ).json()["data"]

    assert resumen["historial_pagos"] == []
    assert resumen["total_pagado"] == 0


# ══ #112 · Gastos de caja ═════════════════════════════════════════════════

async def _gasto(cliente_api, usuario, **cambios):
    cuerpo = {"monto": 12.5, "motivo": "Tinta negra", "unidad_negocio": "imprenta"} | cambios
    return await cliente_api.post("/api/caja/gastos", json=cuerpo, headers=cabecera_token(usuario))


async def _resumen_caja(cliente_api, usuario, **params) -> dict:
    respuesta = await cliente_api.get(
        "/api/caja/resumen", params=params, headers=cabecera_token(usuario)
    )
    assert respuesta.status_code == 200, respuesta.text
    return respuesta.json()["data"]


async def test_un_gasto_resta_del_arqueo_y_se_lista(cliente_api, admin, material):
    """Una jornada con cobros y gastos cierra cuadrando: cobrado, gastado y neto."""
    await _crear(cliente_api, admin, material, precio_total=100, adelanto_pago=60)
    creado = await _gasto(cliente_api, admin, monto=15, motivo="Papel bond")
    assert creado.status_code == 200, creado.text
    await _gasto(cliente_api, admin, monto=5, motivo="Banner", unidad_negocio="gigantografias")

    resumen = await _resumen_caja(cliente_api, admin)

    assert resumen["total"]["total"] == 60
    assert resumen["total_gastos"] == 20
    assert resumen["neto"] == 40
    assert resumen["efectivo_neto"] == 40
    assert resumen["por_unidad_negocio"]["imprenta"]["gastos"] == 15
    assert resumen["por_unidad_negocio"]["imprenta"]["neto"] == 45
    assert resumen["por_unidad_negocio"]["gigantografias"]["gastos"] == 5
    assert [(g["motivo"], g["monto"]) for g in resumen["gastos"]] == [("Papel bond", 15), ("Banner", 5)]


async def test_el_efectivo_neto_solo_descuenta_del_efectivo(cliente_api, admin, material):
    await _crear(cliente_api, admin, material, precio_total=100, adelanto_pago=50, metodo_pago="yape")
    await _gasto(cliente_api, admin, monto=10)

    resumen = await _resumen_caja(cliente_api, admin)

    assert resumen["total"]["yape"] == 50
    assert resumen["neto"] == 40
    # No había efectivo cobrado: el gasto deja la caja física en negativo, y eso se ve.
    assert resumen["efectivo_neto"] == -10


async def test_el_gasto_exige_monto_positivo_y_motivo(cliente_api, admin):
    assert (await _gasto(cliente_api, admin, monto=0)).status_code == 422
    assert (await _gasto(cliente_api, admin, monto=-3)).status_code == 422
    assert (await _gasto(cliente_api, admin, motivo="   ")).status_code == 422
    assert (await _gasto(cliente_api, admin, unidad_negocio="otra")).status_code == 422


async def test_no_se_registran_gastos_con_fecha_futura(cliente_api, admin):
    respuesta = await _gasto(cliente_api, admin, fecha="2999-01-01")
    assert respuesta.status_code == 400
    assert "futura" in respuesta.json()["detail"]


async def test_cada_quien_ve_solo_sus_gastos_y_la_supervision_ve_todos(
    cliente_api, sesion, admin, operario
):
    await _gasto(cliente_api, admin, monto=7, motivo="Del admin")
    await _gasto(cliente_api, operario, monto=3, motivo="Del operario")

    del_operario = await _resumen_caja(cliente_api, operario)
    del_admin = await _resumen_caja(cliente_api, admin)

    assert [g["motivo"] for g in del_operario["gastos"]] == ["Del operario"]
    assert del_operario["total_gastos"] == 3
    assert del_admin["total_gastos"] == 10


async def test_el_cierre_guarda_los_gastos_y_calcula_el_neto(cliente_api, admin, material):
    from datetime import date

    from app.core.fechas import a_fecha_peru, ahora_utc

    await _crear(cliente_api, admin, material, precio_total=100, adelanto_pago=80)
    await _gasto(cliente_api, admin, monto=30)

    cierre = await cliente_api.post(
        "/api/caja/cerrar",
        json={"fecha": a_fecha_peru(ahora_utc()).isoformat(), "unidad_negocio": "imprenta"},
        headers=cabecera_token(admin),
    )

    datos = cierre.json()["data"]
    assert datos["total"] == 80
    assert datos["monto_gastos"] == 30
    assert datos["neto"] == 50
    assert isinstance(date.fromisoformat(datos["fecha"]), date)


async def test_con_la_caja_cerrada_no_se_agregan_ni_se_quitan_gastos(cliente_api, admin):
    from app.core.fechas import a_fecha_peru, ahora_utc

    gasto = (await _gasto(cliente_api, admin)).json()["data"]
    await cliente_api.post(
        "/api/caja/cerrar",
        json={"fecha": a_fecha_peru(ahora_utc()).isoformat(), "unidad_negocio": "imprenta"},
        headers=cabecera_token(admin),
    )

    nuevo = await _gasto(cliente_api, admin)
    assert nuevo.status_code == 400
    assert "cerraste tu caja" in nuevo.json()["detail"]

    quitado = await cliente_api.delete(f"/api/caja/gastos/{gasto['id']}", headers=cabecera_token(admin))
    assert quitado.status_code == 400

    # Otra unidad de negocio sigue abierta.
    assert (await _gasto(cliente_api, admin, unidad_negocio="gigantografias")).status_code == 200


async def test_solo_la_supervision_quita_un_gasto_y_queda_en_la_auditoria(
    cliente_api, admin, operario
):
    gasto = (await _gasto(cliente_api, operario, monto=9, motivo="Mal anotado")).json()["data"]

    assert (
        await cliente_api.delete(f"/api/caja/gastos/{gasto['id']}", headers=cabecera_token(operario))
    ).status_code == 403

    quitado = await cliente_api.delete(f"/api/caja/gastos/{gasto['id']}", headers=cabecera_token(admin))
    assert quitado.status_code == 200
    assert (await _resumen_caja(cliente_api, admin))["total_gastos"] == 0

    auditoria = (await cliente_api.get("/api/auditoria", headers=cabecera_token(admin))).json()["data"]
    eliminacion = next(
        e for e in auditoria if e["tabla_afectada"] == "gastos_caja" and e["accion"] == "eliminar"
    )
    assert "Mal anotado" in eliminacion["detalle"]


async def test_quitar_un_gasto_inexistente_da_404(cliente_api, admin):
    respuesta = await cliente_api.delete("/api/caja/gastos/9999", headers=cabecera_token(admin))
    assert respuesta.status_code == 404
