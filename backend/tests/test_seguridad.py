"""Pruebas de autenticación: hash de contraseñas y tokens JWT."""
from types import SimpleNamespace

import pytest
from fastapi import HTTPException

from app.core.security import (
    crear_token,
    decodificar_token,
    hash_password,
    verificar_password,
)
from app.models import Rol


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
