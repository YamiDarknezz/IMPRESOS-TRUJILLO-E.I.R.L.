"""Pruebas de validación de los esquemas de entrada."""
from datetime import date

import pytest
from pydantic import ValidationError

from app.models import MetodoPago, TipoCliente, TipoDocumento, UnidadNegocio
from app.schemas import (
    ClienteCreateData,
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


# ══ Issue #47: NaN/Infinity no deben colar como monto válido ═══════════════

@pytest.mark.parametrize("valor", [float("nan"), float("inf"), float("-inf")])
def test_adelanto_rechaza_nan_e_infinito(valor):
    """`NaN < 0` y `NaN <= 0` son ambas falsas: sin el chequeo de finitud,
    esto pasaba como adelanto válido y eludía el mínimo del 50% (RN-01)."""
    with pytest.raises(ValidationError):
        _orden(adelanto_pago=valor)


@pytest.mark.parametrize("valor", [float("nan"), float("inf")])
def test_cantidad_de_material_rechaza_nan_e_infinito(valor):
    with pytest.raises(ValidationError):
        MaterialEstimado(material_id=1, cantidad=valor)


@pytest.mark.parametrize("valor", [float("nan"), float("inf")])
def test_medida_del_item_rechaza_nan_e_infinito(valor):
    with pytest.raises(ValidationError):
        _orden(items=[{"descripcion": "Gigantografía", "ancho_m": valor, "precio_unitario": 10}])


def test_precio_total_rechaza_nan():
    with pytest.raises(ValidationError):
        _orden(precio_total=float("nan"))


# ══ Issue #49: topes de longitud en los esquemas ════════════════════════════

def test_descripcion_de_item_respeta_el_tope_de_la_columna():
    """`orden_items.descripcion` es `String(300)`; sin el tope, esto pasaba
    la validación y recién reventaba al insertar (`StringDataRightTruncation`)."""
    with pytest.raises(ValidationError):
        _orden(
            items=[
                {"descripcion": "x" * 301, "ancho_m": 1, "precio_unitario": 10},
            ]
        )


def test_nombre_de_cliente_respeta_el_tope_de_la_columna():
    with pytest.raises(ValidationError):
        ClienteCreateData(nombre="x" * 151)


# ══ Issue #59: el documento de cliente valida formato por tipo ══════════════

def test_documento_de_persona_exige_8_digitos():
    with pytest.raises(ValidationError):
        ClienteCreateData(nombre="Juan Pérez", tipo=TipoCliente.PERSONA, documento="123")


def test_documento_de_empresa_exige_11_digitos():
    with pytest.raises(ValidationError):
        ClienteCreateData(nombre="Empresa SAC", tipo=TipoCliente.EMPRESA, documento="12345678")


def test_documento_no_puede_tener_letras():
    with pytest.raises(ValidationError):
        ClienteCreateData(nombre="Juan Pérez", tipo=TipoCliente.PERSONA, documento="1234567X")


def test_documento_vacio_es_valido_no_es_obligatorio():
    cliente = ClienteCreateData(nombre="Juan Pérez")
    assert cliente.documento == ""


def test_documento_valido_segun_el_tipo():
    persona = ClienteCreateData(nombre="Juan Pérez", tipo=TipoCliente.PERSONA, documento="12345678")
    assert persona.documento == "12345678"
    empresa = ClienteCreateData(nombre="Empresa SAC", tipo=TipoCliente.EMPRESA, documento="12345678901")
    assert empresa.documento == "12345678901"
