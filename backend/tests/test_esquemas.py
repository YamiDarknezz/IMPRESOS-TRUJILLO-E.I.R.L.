"""Pruebas de validación de los esquemas de entrada."""
from datetime import date

import pytest
from pydantic import ValidationError

from app.models import MetodoPago, TipoDocumento, UnidadNegocio
from app.schemas import (
    LoginData,
    MaterialEstimado,
    OrdenCreateData,
    UsuarioCreateData,
)


def _orden(**overrides) -> OrdenCreateData:
    base = dict(
        descripcion="Banner publicitario",
        fecha_entrega=date(2026, 10, 1),
        precio_total=100,
        adelanto_pago=50,
        metodo_pago=MetodoPago.EFECTIVO,
    )
    base.update(overrides)
    return OrdenCreateData(**base)


def test_orden_valida_toma_valores_por_defecto():
    orden = _orden()
    assert orden.tipo_documento == TipoDocumento.CONTRATO
    assert orden.unidad_negocio == UnidadNegocio.IMPRENTA
    assert orden.incluye_igv is False


def test_descripcion_es_obligatoria():
    with pytest.raises(ValidationError):
        _orden(descripcion="   ")


def test_adelanto_no_puede_ser_negativo():
    with pytest.raises(ValidationError):
        _orden(adelanto_pago=-1)


def test_cantidad_de_material_debe_ser_positiva():
    with pytest.raises(ValidationError):
        MaterialEstimado(material_id=1, cantidad=0)


def test_medidas_del_item_deben_ser_positivas():
    with pytest.raises(ValidationError):
        _orden(
            items=[{"descripcion": "Gigantografía", "ancho_m": 0, "precio_unitario": 10}]
        )


def test_login_exige_correo_y_password():
    with pytest.raises(ValidationError):
        LoginData(email="", password="")


def test_password_minima_de_8_caracteres():
    with pytest.raises(ValidationError):
        UsuarioCreateData(nombre="Prueba", email="p@test.pe", password="corta")
