"""Pruebas de humo de la API: salud, login y perfil autenticado."""
from sqlalchemy import select

from app.models import Auditoria, TipoEventoAuditoria
from tests.apoyo import cabecera_token


async def test_health(cliente_api):
    respuesta = await cliente_api.get("/health")
    assert respuesta.status_code == 200
    assert respuesta.json() == {"status": "ok"}


async def test_login_y_perfil(cliente_api, admin):
    respuesta = await cliente_api.post(
        "/api/auth/login",
        json={"email": admin.email, "password": "secreto123"},
    )
    assert respuesta.status_code == 200

    datos = respuesta.json()["data"]
    assert datos["usuario"]["rol"] == "admin"
    assert datos["access_token"]

    perfil = await cliente_api.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {datos['access_token']}"},
    )
    assert perfil.status_code == 200
    assert perfil.json()["data"]["email"] == admin.email


async def test_login_con_password_incorrecta(cliente_api, admin):
    respuesta = await cliente_api.post(
        "/api/auth/login",
        json={"email": admin.email, "password": "incorrecta"},
    )
    assert respuesta.status_code == 401


async def test_endpoint_protegido_sin_token(cliente_api):
    respuesta = await cliente_api.get("/api/ordenes")
    assert respuesta.status_code == 401


async def test_cambio_de_password(cliente_api, admin):
    respuesta = await cliente_api.post(
        "/api/auth/password",
        json={"password_actual": "secreto123", "password_nueva": "nuevaClave123"},
        headers=cabecera_token(admin),
    )
    assert respuesta.status_code == 200
    # El cambio revoca las sesiones anteriores y entrega un token nuevo.
    assert respuesta.json()["data"]["access_token"]


# ══ Issue #44: "Cerrar sesión" debe revocar el token, no solo borrarlo ═════

async def test_logout_revoca_el_token(cliente_api, admin):
    """
    Antes "Cerrar sesión" solo borraba el localStorage: el mismo token
    seguía siendo aceptado por la API hasta su expiración (720 minutos).
    """
    token = (
        await cliente_api.post(
            "/api/auth/login",
            json={"email": admin.email, "password": "secreto123"},
        )
    ).json()["data"]["access_token"]
    encabezado = {"Authorization": f"Bearer {token}"}

    assert (await cliente_api.get("/api/auth/me", headers=encabezado)).status_code == 200

    respuesta = await cliente_api.post("/api/auth/logout", headers=encabezado)
    assert respuesta.status_code == 200

    # El mismo token, emitido antes del logout, ya no sirve.
    respuesta_tras_logout = await cliente_api.get("/api/auth/me", headers=encabezado)
    assert respuesta_tras_logout.status_code == 401
    assert "revocada" in respuesta_tras_logout.json()["detail"].lower()


async def test_logout_sin_token_es_rechazado(cliente_api):
    respuesta = await cliente_api.post("/api/auth/logout")
    assert respuesta.status_code == 401


# ══ Issue #43: límite de intentos de login y auditoría de los fallidos ═════

async def test_login_fallido_queda_auditado(cliente_api, sesion, admin):
    respuesta = await cliente_api.post(
        "/api/auth/login",
        json={"email": admin.email, "password": "incorrecta"},
    )
    assert respuesta.status_code == 401

    entrada = (
        await sesion.execute(
            select(Auditoria).where(Auditoria.accion == TipoEventoAuditoria.SESION_FALLIDA)
        )
    ).scalars().first()
    assert entrada is not None
    assert entrada.registro_id == admin.email.lower()
    assert entrada.usuario_id == admin.id


async def test_login_fallido_con_correo_inexistente_tambien_queda_auditado(cliente_api, sesion):
    """
    Antes del fix, `verificar_password` (y por lo tanto el registro) nunca
    se ejecutaba cuando el correo no existía: el cortocircuito del `or`
    saltaba directo al 401 sin dejar rastro.
    """
    respuesta = await cliente_api.post(
        "/api/auth/login",
        json={"email": "no-existe@impresos.test", "password": "lo-que-sea"},
    )
    assert respuesta.status_code == 401

    entrada = (
        await sesion.execute(
            select(Auditoria).where(Auditoria.accion == TipoEventoAuditoria.SESION_FALLIDA)
        )
    ).scalars().first()
    assert entrada is not None
    assert entrada.registro_id == "no-existe@impresos.test"
    assert entrada.usuario_id is None


async def test_login_se_bloquea_tras_repetidos_intentos_fallidos(cliente_api, admin):
    for _ in range(5):  # MAX_INTENTOS_POR_CORREO
        respuesta = await cliente_api.post(
            "/api/auth/login",
            json={"email": admin.email, "password": "incorrecta"},
        )
        assert respuesta.status_code == 401

    # El sexto intento se bloquea aunque esta vez la contraseña sí sea correcta.
    respuesta = await cliente_api.post(
        "/api/auth/login",
        json={"email": admin.email, "password": "secreto123"},
    )
    assert respuesta.status_code == 429
