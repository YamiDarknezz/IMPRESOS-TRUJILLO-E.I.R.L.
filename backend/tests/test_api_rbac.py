"""Permisos por rol a nivel de API: el servidor es la autoridad (D6/RNF-02)."""
from app.core.security import crear_token, hash_password
from app.models import MotivoObservacionPago, Rol, Usuario
from app.schemas import MaterialEstimado
from app.services import ordenes_service
from tests.apoyo import cabecera_token, datos_orden


async def _usuario(sesion, rol: Rol, correo: str) -> Usuario:
    usuario = Usuario(
        nombre=f"{rol.value.title()} Prueba",
        email=correo,
        password_hash=hash_password("secreto123"),
        rol=rol,
    )
    sesion.add(usuario)
    await sesion.flush()
    return usuario


async def test_auditoria_solo_para_admin(cliente_api, admin, operario):
    respuesta = await cliente_api.get("/api/auditoria", headers=cabecera_token(operario))
    assert respuesta.status_code == 403

    respuesta = await cliente_api.get("/api/auditoria", headers=cabecera_token(admin))
    assert respuesta.status_code == 200


async def test_listado_de_usuarios_por_rol(cliente_api, sesion, admin, operario):
    subgerente = Usuario(
        nombre="Subgerente Prueba",
        email="subgerente@impresos.test",
        password_hash="x",
        rol=Rol.SUBGERENTE,
    )
    sesion.add(subgerente)
    await sesion.flush()

    # La supervisión necesita la lista para asignar órdenes.
    assert (await cliente_api.get("/api/usuarios", headers=cabecera_token(subgerente))).status_code == 200
    assert (await cliente_api.get("/api/usuarios", headers=cabecera_token(admin))).status_code == 200
    # Un operario no administra cuentas.
    assert (await cliente_api.get("/api/usuarios", headers=cabecera_token(operario))).status_code == 403


async def test_operario_no_gestiona_catalogos(cliente_api, operario):
    respuesta = await cliente_api.post(
        "/api/clientes", json={"nombre": "Cliente No Permitido"}, headers=cabecera_token(operario)
    )
    assert respuesta.status_code == 403

    respuesta = await cliente_api.post(
        "/api/unidades", json={"nombre": "unidad-prohibida"}, headers=cabecera_token(operario)
    )
    assert respuesta.status_code == 403


async def test_operario_solo_ve_sus_ordenes(cliente_api, sesion, admin, operario, material):
    propia = await ordenes_service.crear_orden(
        sesion, datos_orden(material.id, asignado_a=operario.id), admin
    )
    ajena = await ordenes_service.crear_orden(
        sesion, datos_orden(material.id, asignado_a=admin.id), admin
    )

    respuesta = await cliente_api.get("/api/ordenes", headers=cabecera_token(operario))
    assert respuesta.status_code == 200
    ids = [orden["id"] for orden in respuesta.json()["data"]]
    assert propia.id in ids
    assert ajena.id not in ids

    # El acceso directo por id también se bloquea, no solo el listado.
    respuesta = await cliente_api.get(
        f"/api/ordenes/{ajena.id}", headers=cabecera_token(operario)
    )
    assert respuesta.status_code == 403


async def test_candado_de_entrega_expuesto_en_la_api(cliente_api, sesion, admin, material, cliente):
    orden = await ordenes_service.crear_orden(
        sesion, datos_orden(material.id, cliente_id=cliente.id), admin
    )
    await ordenes_service.completar(
        sesion, orden.id, [MaterialEstimado(material_id=material.id, cantidad=2)], admin
    )

    respuesta = await cliente_api.post(
        f"/api/ordenes/{orden.id}/estado",
        json={"estado": "entregada"},
        headers=cabecera_token(admin),
    )
    assert respuesta.status_code == 400
    assert "pagada" in respuesta.json()["detail"].lower()


async def test_adelanto_minimo_validado_en_la_api(cliente_api, sesion, admin, material, cliente):
    payload = datos_orden(material.id, cliente_id=cliente.id, adelanto_pago=10).model_dump(mode="json")

    respuesta = await cliente_api.post(
        "/api/ordenes", json=payload, headers=cabecera_token(admin)
    )
    assert respuesta.status_code == 400
    assert "adelanto" in respuesta.json()["detail"].lower()


async def test_token_revocado_deja_de_servir(cliente_api, sesion, admin):
    token_viejo = crear_token(admin)
    # Al desactivar la cuenta se revocan sus sesiones de inmediato.
    admin.activo = False
    await sesion.flush()

    respuesta = await cliente_api.get(
        "/api/ordenes", headers={"Authorization": f"Bearer {token_viejo}"}
    )
    assert respuesta.status_code == 401


async def test_clientes_exige_rol_de_gestion(cliente_api, sesion, admin, operario):
    """
    Issue #46: diseñadora y operario no deben poder ver el padrón de clientes
    ni su ficha financiera, aunque estén autenticados.
    """
    disenadora = await _usuario(sesion, Rol.DISENADORA, "disenadora@impresos.test")

    respuesta = await cliente_api.post(
        "/api/clientes", json={"nombre": "Cliente RBAC"}, headers=cabecera_token(admin)
    )
    cliente_id = respuesta.json()["data"]["id"]

    for usuario in (operario, disenadora):
        assert (
            await cliente_api.get("/api/clientes", headers=cabecera_token(usuario))
        ).status_code == 403
        assert (
            await cliente_api.get(
                f"/api/clientes/{cliente_id}", headers=cabecera_token(usuario)
            )
        ).status_code == 403
        assert (
            await cliente_api.get(
                f"/api/clientes/{cliente_id}/resumen", headers=cabecera_token(usuario)
            )
        ).status_code == 403

    # Secretaría sí gestiona clientes (RN de mostrador).
    secretaria = await _usuario(sesion, Rol.SECRETARIA, "secretaria@impresos.test")
    assert (
        await cliente_api.get("/api/clientes", headers=cabecera_token(secretaria))
    ).status_code == 200


async def test_disenadora_solo_gestiona_lo_suyo_no_ve_ni_toca_lo_ajeno(
    cliente_api, sesion, admin, material, cliente
):
    """
    Issue #22: la interfaz le promete a la Diseñadora que gestiona "sus
    órdenes asignadas"; el backend debe conceder exactamente eso, ni más
    (órdenes ajenas) ni menos (403 en lo suyo).
    """
    disenadora = await _usuario(sesion, Rol.DISENADORA, "diseno-rbac@impresos.test")

    propia = await ordenes_service.crear_orden(
        sesion,
        datos_orden(material.id, cliente_id=cliente.id, asignado_a=disenadora.id),
        admin,
    )
    ajena = await ordenes_service.crear_orden(
        sesion, datos_orden(material.id, cliente_id=cliente.id, asignado_a=admin.id), admin
    )

    # Puede avanzar la etapa de la suya...
    respuesta = await cliente_api.post(
        f"/api/ordenes/{propia.id}/estado",
        json={"estado": "en_diseno"},
        headers=cabecera_token(disenadora),
    )
    assert respuesta.status_code == 200

    # ...pero no la de otro trabajador.
    respuesta = await cliente_api.post(
        f"/api/ordenes/{ajena.id}/estado",
        json={"estado": "en_diseno"},
        headers=cabecera_token(disenadora),
    )
    assert respuesta.status_code == 403


async def test_observar_pago_solo_supervision(cliente_api, sesion, admin, material, cliente):
    """Issue #17: observar/anular un cobro es de supervisión, no de cualquier vendedor."""
    operario = await _usuario(sesion, Rol.OPERARIO, "operario-caja@impresos.test")
    orden = await ordenes_service.crear_orden(
        sesion,
        datos_orden(
            material.id, cliente_id=cliente.id, precio_total=100, adelanto_pago=100
        ),
        admin,
    )
    pago_id = orden.pagos[0].id

    respuesta = await cliente_api.post(
        f"/api/caja/pagos/{pago_id}/observar",
        json={"motivo": MotivoObservacionPago.YAPE_FALSO.value, "nota": "no autorizado"},
        headers=cabecera_token(operario),
    )
    assert respuesta.status_code == 403

    respuesta = await cliente_api.post(
        f"/api/caja/pagos/{pago_id}/observar",
        json={"motivo": MotivoObservacionPago.YAPE_FALSO.value, "nota": "autorizado"},
        headers=cabecera_token(admin),
    )
    assert respuesta.status_code == 200


async def test_editar_orden_no_desasigna_al_trabajador(
    cliente_api, sesion, admin, material, cliente
):
    """
    Issue #21: el formulario de Secretaría ni siquiera muestra el campo de
    asignado, así que cada edición mandaba `asignado_a: null` y desasignaba
    la orden sin que nadie lo pidiera.
    """
    operario = await _usuario(sesion, Rol.OPERARIO, "operario-asignado@impresos.test")
    secretaria = await _usuario(sesion, Rol.SECRETARIA, "secretaria-edita@impresos.test")

    orden = await ordenes_service.crear_orden(
        sesion,
        datos_orden(material.id, cliente_id=cliente.id, asignado_a=operario.id),
        admin,
    )
    assert orden.asignado_a == operario.id

    payload = datos_orden(
        material.id, cliente_id=cliente.id, descripcion="Descripción editada"
    ).model_dump(mode="json")
    # Como haría el formulario real: Secretaría no manda asignado_a distinto,
    # pero tampoco tiene forma de mandar "no cambiar" — solo puede omitirlo o
    # mandar null, que es justo lo que rompía la asignación.
    payload["asignado_a"] = None

    respuesta = await cliente_api.patch(
        f"/api/ordenes/{orden.id}", json=payload, headers=cabecera_token(secretaria)
    )
    assert respuesta.status_code == 200
    assert respuesta.json()["data"]["asignado_a"] == operario.id
