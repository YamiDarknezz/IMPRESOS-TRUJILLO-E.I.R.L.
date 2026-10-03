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


# ══ #71 · Seguimiento de rollos por pedido ════════════════════════════════

async def _rollo(cliente_api, usuario, material, codigo="ROLL-71", capacidad=50):
    respuesta = await cliente_api.post(
        "/api/inventario/piezas",
        json={
            "material_id": material.id, "codigo_identificador": codigo,
            "capacidad_inicial": capacidad, "unidad_medida": "m", "costo_adquisicion": 100,
        },
        headers=cabecera_token(usuario),
    )
    assert respuesta.status_code == 200, respuesta.text
    return respuesta.json()["data"]


async def _corte(cliente_api, usuario, pieza, cantidad=5, **extra):
    return await cliente_api.post(
        f"/api/inventario/piezas/{pieza['id']}/consumos",
        json={"trabajo_descripcion": "Banner 2x1", "cantidad_consumida": cantidad} | extra,
        headers=cabecera_token(usuario),
    )


async def test_un_corte_se_asigna_a_un_pedido_y_se_ve_en_la_orden(cliente_api, admin, material):
    orden = await _crear(cliente_api, admin, material)
    rollo = await _rollo(cliente_api, admin, material)

    corte = await _corte(cliente_api, admin, rollo, cantidad=8, orden_id=orden["id"])
    assert corte.status_code == 200, corte.text
    assert corte.json()["data"]["orden_codigo"] == orden["codigo"]

    respuesta = await cliente_api.get(f"/api/ordenes/{orden['id']}/rollos", headers=cabecera_token(admin))
    cuerpo = respuesta.json()
    [fila] = cuerpo["data"]
    assert fila["pieza_codigo"] == "ROLL-71"
    assert fila["material_nombre"] == material.nombre
    assert fila["cantidad_consumida"] == 8
    assert fila["saldo_restante_pieza"] == 42
    assert cuerpo["resumen"] == [{"material": material.nombre, "unidad": "m", "cantidad": 8}]


async def test_el_resumen_suma_los_cortes_del_mismo_material(cliente_api, admin, material):
    orden = await _crear(cliente_api, admin, material)
    rollo = await _rollo(cliente_api, admin, material)
    await _corte(cliente_api, admin, rollo, cantidad=3, orden_id=orden["id"])
    await _corte(cliente_api, admin, rollo, cantidad=4.5, orden_id=orden["id"])
    # Un corte de otro pedido no se mezcla.
    await _corte(cliente_api, admin, rollo, cantidad=10)

    cuerpo = (
        await cliente_api.get(f"/api/ordenes/{orden['id']}/rollos", headers=cabecera_token(admin))
    ).json()

    assert len(cuerpo["data"]) == 2
    assert cuerpo["resumen"][0]["cantidad"] == 7.5


async def test_un_pedido_sin_cortes_devuelve_una_lista_vacia(cliente_api, admin, material):
    orden = await _crear(cliente_api, admin, material)
    cuerpo = (
        await cliente_api.get(f"/api/ordenes/{orden['id']}/rollos", headers=cabecera_token(admin))
    ).json()
    assert cuerpo["data"] == []
    assert cuerpo["resumen"] == []


async def test_el_corte_con_una_orden_inexistente_se_rechaza_con_un_mensaje(
    cliente_api, admin, material
):
    rollo = await _rollo(cliente_api, admin, material)
    respuesta = await _corte(cliente_api, admin, rollo, orden_id=9999)
    assert respuesta.status_code == 400
    assert "no existe" in respuesta.json()["detail"]


async def test_no_se_asigna_un_corte_a_un_pedido_cancelado(cliente_api, admin, material):
    orden = await _crear(cliente_api, admin, material)
    await cliente_api.post(f"/api/ordenes/{orden['id']}/cancelar", headers=cabecera_token(admin))
    rollo = await _rollo(cliente_api, admin, material)

    respuesta = await _corte(cliente_api, admin, rollo, orden_id=orden["id"])

    assert respuesta.status_code == 400
    assert "cancelada" in respuesta.json()["detail"]
    # Y el rollo no perdió material por el intento.
    detalle = await cliente_api.get(f"/api/inventario/piezas/{rollo['id']}", headers=cabecera_token(admin))
    assert detalle.json()["data"]["saldo_restante"] == 50


async def test_el_corte_sin_pedido_sigue_funcionando(cliente_api, admin, material):
    rollo = await _rollo(cliente_api, admin, material)
    corte = await _corte(cliente_api, admin, rollo, cantidad=2)
    assert corte.status_code == 200
    assert corte.json()["data"]["orden_codigo"] is None


async def test_un_operario_no_ve_los_rollos_de_un_pedido_ajeno(
    cliente_api, sesion, admin, operario, material
):
    ajena = await _crear(cliente_api, admin, material, asignado_a=admin.id)
    respuesta = await cliente_api.get(f"/api/ordenes/{ajena['id']}/rollos", headers=cabecera_token(operario))
    assert respuesta.status_code == 403


# ══ #72 · Proformas: entrega antes de pagar y cuenta por cobrar ═══════════
#
# La proforma es el documento de los clientes de confianza y de las empresas
# que pagan a plazo (p. ej. por cheque): no exige adelanto y, con la
# autorización de un supervisor, se entrega antes de cobrar. El contrato
# conserva las reglas de siempre.

async def _orden_lista_para_entregar(
    cliente_api, admin, material, tipo="proforma", cliente_id=None, **cambios
):
    """Una orden finalizada con saldo pendiente (adelanto de 50 sobre 100)."""
    orden = await _crear(
        cliente_api, admin, material, cliente_id=cliente_id, tipo_documento=tipo,
        precio_total=100, adelanto_pago=50, **cambios,
    )
    completada = await cliente_api.post(
        "/api/ordenes/completar",
        json={"id_orden": orden["id"], "materiales_reales": [{"material_id": material.id, "cantidad": 2}]},
        headers=cabecera_token(admin),
    )
    assert completada.status_code == 200, completada.text
    return orden


async def _entregar(cliente_api, usuario, orden, **extra):
    return await cliente_api.post(
        f"/api/ordenes/{orden['id']}/estado",
        json={"estado": "entregada"} | extra,
        headers=cabecera_token(usuario),
    )


async def test_la_proforma_no_exige_adelanto_y_el_contrato_si(cliente_api, admin, material):
    proforma = await cliente_api.post(
        "/api/ordenes",
        json=_payload(material, tipo_documento="proforma", adelanto_pago=0),
        headers=cabecera_token(admin),
    )
    assert proforma.status_code == 200, proforma.text
    assert proforma.json()["data"]["finanzas"]["saldo_pendiente"] == 100

    contrato = await cliente_api.post(
        "/api/ordenes",
        json=_payload(material, tipo_documento="contrato", adelanto_pago=10),
        headers=cabecera_token(admin),
    )
    assert contrato.status_code == 400
    assert "adelanto mínimo" in contrato.json()["detail"]


async def test_editar_a_proforma_tambien_quita_el_adelanto_minimo(cliente_api, admin, material):
    orden = await _crear(cliente_api, admin, material, tipo_documento="contrato")
    editada = await cliente_api.patch(
        f"/api/ordenes/{orden['id']}",
        json=_payload(material, tipo_documento="proforma", adelanto_pago=0),
        headers=cabecera_token(admin),
    )
    assert editada.status_code == 200, editada.text


async def test_sin_autorizacion_la_entrega_con_saldo_sigue_prohibida_aun_en_una_proforma(
    cliente_api, admin, material
):
    orden = await _orden_lista_para_entregar(cliente_api, admin, material)

    respuesta = await _entregar(cliente_api, admin, orden)

    assert respuesta.status_code == 400
    assert "no está pagada en su totalidad" in respuesta.json()["detail"]


async def test_un_supervisor_autoriza_la_entrega_con_saldo_de_una_proforma(
    cliente_api, admin, material
):
    orden = await _orden_lista_para_entregar(cliente_api, admin, material)

    respuesta = await _entregar(
        cliente_api, admin, orden, autorizar_saldo=True, motivo="Paga con cheque a 30 días"
    )

    assert respuesta.status_code == 200, respuesta.text
    datos = respuesta.json()["data"]
    assert datos["estado"] == "entregada"
    assert datos["entregada_con_saldo"] is True
    assert datos["finanzas"]["saldo_pendiente"] == 50
    assert datos["entrega_autorizada"]["por"] == admin.nombre
    assert datos["entrega_autorizada"]["motivo"] == "Paga con cheque a 30 días"
    assert datos["tipo_documento"] == "proforma"


async def test_la_autorizacion_exige_el_motivo(cliente_api, admin, material):
    orden = await _orden_lista_para_entregar(cliente_api, admin, material)

    respuesta = await _entregar(cliente_api, admin, orden, autorizar_saldo=True, motivo="   ")

    assert respuesta.status_code == 400
    assert "motivo" in respuesta.json()["detail"]


async def test_un_contrato_no_se_entrega_antes_de_pagar_ni_con_autorizacion_ni_a_un_corporativo(
    cliente_api, admin, material, cliente_corporativo
):
    orden = await _orden_lista_para_entregar(
        cliente_api, admin, material, tipo="contrato", cliente_id=cliente_corporativo.id
    )

    respuesta = await _entregar(cliente_api, admin, orden, autorizar_saldo=True, motivo="Es conocido")

    assert respuesta.status_code == 400
    assert "proformas" in respuesta.json()["detail"]


async def test_solo_un_supervisor_autoriza(cliente_api, sesion, admin, operario, material):
    orden = await _orden_lista_para_entregar(cliente_api, admin, material, asignado_a=operario.id)

    respuesta = await _entregar(cliente_api, operario, orden, autorizar_saldo=True, motivo="Pidió el cliente")

    assert respuesta.status_code == 403
    estado = (
        await cliente_api.get(f"/api/ordenes/{orden['id']}", headers=cabecera_token(admin))
    ).json()["data"]["estado"]
    assert estado == "finalizada"


async def test_la_entrega_con_saldo_queda_en_la_auditoria(cliente_api, admin, material):
    orden = await _orden_lista_para_entregar(cliente_api, admin, material)
    await _entregar(cliente_api, admin, orden, autorizar_saldo=True, motivo="Paga con cheque a 30 días")

    auditoria = (await cliente_api.get("/api/auditoria", headers=cabecera_token(admin))).json()["data"]
    entrada = next(e for e in auditoria if "ENTREGA CON SALDO" in (e["detalle"] or ""))

    assert entrada["registro_id"] == orden["codigo"]
    assert "Paga con cheque a 30 días" in entrada["detalle"]
    assert entrada["valores_nuevos"]["entrega_con_saldo"] is True
    assert entrada["valores_nuevos"]["saldo_pendiente"] == 50


async def test_autorizar_una_proforma_ya_pagada_no_deja_rastro_de_excepcion(
    cliente_api, admin, material
):
    orden = await _orden_lista_para_entregar(cliente_api, admin, material)
    await cliente_api.post(
        f"/api/ordenes/{orden['id']}/confirmar-pago", json={}, headers=cabecera_token(admin)
    )

    datos = (await _entregar(cliente_api, admin, orden, autorizar_saldo=True, motivo="x")).json()["data"]

    assert datos["estado"] == "entregada"
    assert datos["entregada_con_saldo"] is False
    assert datos["entrega_autorizada"] is None


async def test_despues_de_entregar_con_saldo_el_cliente_todavia_puede_pagar(cliente_api, admin, material):
    orden = await _orden_lista_para_entregar(cliente_api, admin, material)
    await _entregar(cliente_api, admin, orden, autorizar_saldo=True, motivo="Cheque a 30 días")

    abono = await cliente_api.post(
        f"/api/ordenes/{orden['id']}/confirmar-pago", json={"monto": 20}, headers=cabecera_token(admin)
    )
    assert abono.status_code == 200, abono.text
    assert abono.json()["data"]["entregada_con_saldo"] is True

    saldo = await cliente_api.post(
        f"/api/ordenes/{orden['id']}/confirmar-pago", json={}, headers=cabecera_token(admin)
    )
    datos = saldo.json()["data"]
    assert datos["entregada_con_saldo"] is False
    assert datos["finanzas"]["pagado_totalmente"] is True
    # La autorización queda como historia aunque la deuda ya se saldó.
    assert datos["entrega_autorizada"]["motivo"] == "Cheque a 30 días"


async def test_cuentas_por_cobrar_agrupa_por_cliente_y_separa_por_antiguedad(
    cliente_api, sesion, admin, material, cliente_corporativo, cliente
):
    from datetime import timedelta

    from app.core.fechas import ahora_utc
    from app.models import Orden

    o1 = await _orden_lista_para_entregar(cliente_api, admin, material, cliente_id=cliente_corporativo.id)
    o2 = await _orden_lista_para_entregar(cliente_api, admin, material, cliente_id=cliente_corporativo.id)
    o3 = await _orden_lista_para_entregar(cliente_api, admin, material, cliente_id=cliente_corporativo.id)
    for orden in (o1, o2, o3):
        await _entregar(cliente_api, admin, orden, autorizar_saldo=True, motivo="Cheque a plazo")

    # Se retrocede la fecha de entrega: 10, 45 y 120 días de deuda.
    for orden, dias in ((o1, 10), (o2, 45), (o3, 120)):
        fila = await sesion.get(Orden, orden["id"])
        fila.entregada_en = ahora_utc() - timedelta(days=dias)
    await sesion.flush()
    # Un contrato con saldo no entra en la vista de proformas.
    await _orden_lista_para_entregar(cliente_api, admin, material, tipo="contrato", cliente_id=cliente.id)

    respuesta = await cliente_api.get("/api/finanzas/cuentas-por-cobrar", headers=cabecera_token(admin))
    assert respuesta.status_code == 200, respuesta.text
    datos = respuesta.json()["data"]

    assert datos["solo_proformas"] is True
    assert datos["total_pendiente"] == 150
    assert datos["tramos"] == {"d0_30": 50, "d31_60": 50, "d61_90": 0, "d90_mas": 50}
    [fila] = datos["clientes"]
    assert fila["cliente"] == cliente_corporativo.nombre
    assert fila["saldo_pendiente"] == 150
    assert fila["dias_mayor_antiguedad"] == 120
    assert [(o["codigo"], o["dias"], o["tramo"]) for o in fila["ordenes"]] == [
        (o3["codigo"], 120, "d90_mas"),
        (o2["codigo"], 45, "d31_60"),
        (o1["codigo"], 10, "d0_30"),
    ]
    assert fila["ordenes"][0]["entrega_motivo"] == "Cheque a plazo"


async def test_cuentas_por_cobrar_puede_incluir_tambien_los_contratos(
    cliente_api, admin, material, cliente_corporativo, cliente
):
    await _orden_lista_para_entregar(cliente_api, admin, material, cliente_id=cliente_corporativo.id)
    await _orden_lista_para_entregar(cliente_api, admin, material, tipo="contrato", cliente_id=cliente.id)

    todos = (
        await cliente_api.get(
            "/api/finanzas/cuentas-por-cobrar",
            params={"solo_proformas": False},
            headers=cabecera_token(admin),
        )
    ).json()["data"]

    assert {f["cliente"] for f in todos["clientes"]} == {cliente_corporativo.nombre, cliente.nombre}
    assert todos["total_pendiente"] == 100


async def test_cuentas_por_cobrar_ignora_lo_pagado_y_lo_cancelado(cliente_api, admin, material):
    pagada = await _orden_lista_para_entregar(cliente_api, admin, material)
    await cliente_api.post(
        f"/api/ordenes/{pagada['id']}/confirmar-pago", json={}, headers=cabecera_token(admin)
    )
    cancelada = await _crear(cliente_api, admin, material, tipo_documento="proforma")
    await cliente_api.post(f"/api/ordenes/{cancelada['id']}/cancelar", headers=cabecera_token(admin))

    datos = (
        await cliente_api.get("/api/finanzas/cuentas-por-cobrar", headers=cabecera_token(admin))
    ).json()["data"]

    assert datos["clientes"] == []
    assert datos["total_pendiente"] == 0


async def test_cuentas_por_cobrar_es_solo_de_supervision(cliente_api, operario):
    respuesta = await cliente_api.get("/api/finanzas/cuentas-por-cobrar", headers=cabecera_token(operario))
    assert respuesta.status_code == 403


def test_tramo_de_respeta_los_limites_de_30_60_y_90_dias():
    from app.services.finanzas_service import tramo_de

    assert [tramo_de(d) for d in (0, 30, 31, 60, 61, 90, 91, 400)] == [
        "d0_30", "d0_30", "d31_60", "d31_60", "d61_90", "d61_90", "d90_mas", "d90_mas",
    ]
