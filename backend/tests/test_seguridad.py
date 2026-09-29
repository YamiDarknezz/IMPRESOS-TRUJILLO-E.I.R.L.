"""Pruebas de autenticación: hash de contraseñas y tokens JWT."""
from types import SimpleNamespace

import pytest
from fastapi import HTTPException
from sqlalchemy import select

from app.core.config import JWT_SECRET_POR_DEFECTO, validar_jwt_secret
from app.core.security import (
    crear_token,
    decodificar_token,
    hash_password,
    verificar_password,
)
from app.models import Auditoria, Rol, TipoEventoAuditoria


def test_hash_no_guarda_la_contrasena_en_claro():
    hash_generado = hash_password("secreto123")
    assert hash_generado != "secreto123"
    assert hash_generado.startswith("$2")  # prefijo de bcrypt


def test_verificacion_de_contrasena():
    hash_generado = hash_password("secreto123")
    assert verificar_password("secreto123", hash_generado)
    assert not verificar_password("otra-clave", hash_generado)


def test_hash_invalido_no_revienta():
    assert not verificar_password("secreto123", "hash-corrupto")


def test_token_contiene_usuario_rol_y_version_de_sesion():
    usuario = SimpleNamespace(id=7, rol=Rol.ADMIN, sesion_version=2)
    datos = decodificar_token(crear_token(usuario))
    assert datos["sub"] == "7"
    assert datos["rol"] == "admin"
    assert datos["sv"] == 2


def test_token_invalido_es_rechazado():
    with pytest.raises(HTTPException) as exc:
        decodificar_token("esto-no-es-un-token")
    assert exc.value.status_code == 401


# ══ Issue #52: no arrancar en producción con el JWT_SECRET por defecto ═════

def test_rechaza_el_secreto_por_defecto_en_produccion():
    with pytest.raises(RuntimeError, match="JWT_SECRET"):
        validar_jwt_secret("produccion", JWT_SECRET_POR_DEFECTO)


def test_permite_el_secreto_por_defecto_fuera_de_produccion():
    validar_jwt_secret("desarrollo", JWT_SECRET_POR_DEFECTO)
    validar_jwt_secret("pruebas", JWT_SECRET_POR_DEFECTO)


def test_permite_produccion_con_un_secreto_propio():
    validar_jwt_secret("produccion", "una-clave-generada-de-verdad")


# ══ Issue #45: la IP de auditoría no debe salir del X-Forwarded-For ════════

async def test_auditoria_usa_x_real_ip_no_el_primer_x_forwarded_for(cliente_api, sesion, admin):
    """
    nginx fija X-Real-IP con su propio $remote_addr (no lo puede falsificar
    el cliente); X-Forwarded-For en cambio lo amplía sin reemplazarlo, así
    que el primer valor sigue siendo el que el cliente elige mandar.
    """
    respuesta = await cliente_api.post(
        "/api/auth/login",
        json={"email": admin.email, "password": "secreto123"},
        headers={
            "X-Forwarded-For": "1.2.3.4, 9.9.9.9",  # 1.2.3.4: lo que mandaría un atacante
            "X-Real-IP": "9.9.9.9",
        },
    )
    assert respuesta.status_code == 200

    entrada = (
        await sesion.execute(
            select(Auditoria).where(Auditoria.accion == TipoEventoAuditoria.SESION)
        )
    ).scalars().first()
    assert entrada.ip == "9.9.9.9"
