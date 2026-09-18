"""Permisos por rol a nivel de API: el servidor es la autoridad (D6/RNF-02)."""
from app.core.security import crear_token
from app.models import Rol, Usuario
from app.schemas import MaterialEstimado
from app.services import ordenes_service
from tests.apoyo import cabecera_token, datos_orden


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
