"""La sesión del navegador vive en una cookie HttpOnly (#48).

El encabezado `Authorization` sigue funcionando (pruebas, integraciones), pero
el navegador ya no guarda el token en ningún sitio que un script pueda leer: lo
deja el backend en una cookie que el JS no ve.
"""
from app.core.security import COOKIE_SESION

CREDENCIALES = {"email": "admin@impresos.test", "password": "secreto123"}


async def test_login_deja_la_cookie_de_sesion(cliente_api, admin):
    respuesta = await cliente_api.post("/api/auth/login", json=CREDENCIALES)

    assert respuesta.status_code == 200
    cabecera = respuesta.headers["set-cookie"].lower()
    assert f"{COOKIE_SESION}=" in cabecera
    assert "httponly" in cabecera
    assert "samesite=strict" in cabecera
    assert "path=/" in cabecera
    # En pruebas y desarrollo el navegador es http: Secure se activa en
    # producción, donde la cookie no debe viajar en claro.
    assert "secure" not in cabecera


async def test_la_cookie_autentica_igual_que_el_encabezado(cliente_api, admin):
    await cliente_api.post("/api/auth/login", json=CREDENCIALES)

    # Este cliente conserva las cookies, como haría el navegador.
    perfil = await cliente_api.get("/api/auth/me")

    assert perfil.status_code == 200
    assert perfil.json()["data"]["email"] == admin.email


async def test_logout_borra_la_cookie_y_deja_de_valer(cliente_api, admin):
    await cliente_api.post("/api/auth/login", json=CREDENCIALES)

    cierre = await cliente_api.post("/api/auth/logout")

    assert cierre.status_code == 200
    assert COOKIE_SESION in cierre.headers["set-cookie"]
    # El token de esa cookie quedó revocado (sesion_version), así que la
    # misma sesión ya no sirve ni con la cookie puesta.
    assert (await cliente_api.get("/api/auth/me")).status_code == 401


async def test_sin_cookie_ni_encabezado_no_hay_sesion(cliente_api):
    respuesta = await cliente_api.get("/api/auth/me")

    assert respuesta.status_code == 401
