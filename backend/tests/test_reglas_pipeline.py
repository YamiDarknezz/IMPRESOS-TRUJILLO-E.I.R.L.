"""Pruebas de las reglas del pipeline de estados (sin base de datos).

    pendiente -> en_diseno -> aprobado -> en_produccion -> finalizada -> entregada

Las reglas que protegen el inventario y el cobro:
  - A 'finalizada' solo se llega reportando el consumo real.
  - Cancelar tiene su propio endpoint (devuelve el stock reservado).
  - No se entrega sin haber cobrado el total, y la entrega es definitiva.
"""
from types import SimpleNamespace

import pytest

from app.core.errores import ErrorDeNegocio
from app.models import EstadoOrden, Rol
from app.services.ordenes_service import (
    calcular_saldo,
    calcular_totales,
    puede_avanzar_etapa,
    puede_gestionar,
    validar_adelanto,
    validar_transicion,
)

P = EstadoOrden


# ══ Reglas puras de transición ══════════════════════════════════════════════

@pytest.mark.parametrize(
    "desde,hasta",
    [
        (P.PENDIENTE, P.EN_DISENO),
        (P.EN_DISENO, P.APROBADO),
        (P.APROBADO, P.EN_PRODUCCION),
        (P.EN_PRODUCCION, P.APROBADO),  # dentro del pipeline se puede corregir
        (P.FINALIZADA, P.ENTREGADA),
    ],
)
def test_transiciones_validas(desde, hasta):
    validar_transicion(desde, hasta, pagado_totalmente=True)


def test_no_se_puede_saltar_a_finalizada_sin_reportar_uso():
    """La más importante: si se pudiera, el stock nunca se ajustaría a lo real."""
    with pytest.raises(ErrorDeNegocio) as exc:
        validar_transicion(P.EN_PRODUCCION, P.FINALIZADA, pagado_totalmente=True)
    assert exc.value.estado_http == 400
    assert "Reportar uso" in str(exc.value)


def test_no_se_puede_cancelar_por_esta_via():
    """Cancelar devuelve el stock reservado, por eso tiene su propio endpoint."""
    with pytest.raises(ErrorDeNegocio):
        validar_transicion(P.PENDIENTE, P.CANCELADA, pagado_totalmente=True)


def test_una_orden_cancelada_no_cambia_de_estado():
    with pytest.raises(ErrorDeNegocio):
        validar_transicion(P.CANCELADA, P.PENDIENTE, pagado_totalmente=True)


def test_una_orden_finalizada_no_vuelve_a_produccion():
    with pytest.raises(ErrorDeNegocio):
        validar_transicion(P.FINALIZADA, P.EN_PRODUCCION, pagado_totalmente=True)


def test_la_entrega_es_definitiva():
    """Una vez entregada, el trabajo salió del taller: no se deshace."""
    with pytest.raises(ErrorDeNegocio) as exc:
        validar_transicion(P.ENTREGADA, P.FINALIZADA, pagado_totalmente=True)
    assert "entregada" in str(exc.value).lower()


def test_no_se_puede_entregar_sin_pago_completo():
    """El cliente no se lleva el trabajo sin pagar el total."""
    with pytest.raises(ErrorDeNegocio) as exc:
        validar_transicion(P.FINALIZADA, P.ENTREGADA, pagado_totalmente=False)
    assert "pagada" in str(exc.value).lower()


def test_si_se_puede_entregar_una_orden_pagada():
    validar_transicion(P.FINALIZADA, P.ENTREGADA, pagado_totalmente=True)


# ══ Cálculo financiero ══════════════════════════════════════════════════════

def test_calcular_saldo():
    assert calcular_saldo(200, 50) == 150
    assert calcular_saldo(200, 200) == 0
    assert calcular_saldo(200, 250) == 0  # nunca queda negativo


def test_calcular_totales_sin_igv():
    igv, total = calcular_totales(100, incluye_igv=False)
    assert float(igv) == 0
    assert float(total) == 100


def test_calcular_totales_con_igv_y_descuento():
    igv, total = calcular_totales(100, incluye_igv=True, descuento=20)
    assert float(igv) == 18
    assert float(total) == 98  # 100 + 18 - 20


def test_descuento_no_puede_superar_el_subtotal():
    with pytest.raises(ErrorDeNegocio):
        calcular_totales(100, incluye_igv=False, descuento=120)


# ══ RN-01: adelanto obligatorio ═════════════════════════════════════════════

def test_adelanto_obligatorio():
    with pytest.raises(ErrorDeNegocio) as exc:
        validar_adelanto(100, 0, es_corporativo=False)
    assert exc.value.estado_http == 400


def test_adelanto_minimo_del_50_por_ciento():
    validar_adelanto(100, 50, es_corporativo=False)
    with pytest.raises(ErrorDeNegocio) as exc:
        validar_adelanto(100, 49, es_corporativo=False)
    assert "adelanto mínimo" in str(exc.value).lower()


def test_orden_corporativa_se_exceptua_del_minimo():
    validar_adelanto(100, 0, es_corporativo=True)


# ══ Permisos ════════════════════════════════════════════════════════════════

def _usuario(rol, id=1):
    return SimpleNamespace(rol=rol, id=id)


def _orden(asignado_a):
    return SimpleNamespace(asignado_a=asignado_a)


def test_admin_gestiona_cualquier_orden():
    assert puede_gestionar(_orden(asignado_a=99), _usuario(Rol.ADMIN))


def test_secretaria_gestiona_cualquier_orden():
    assert puede_gestionar(_orden(asignado_a=99), _usuario(Rol.SECRETARIA))


def test_operario_solo_gestiona_las_suyas():
    assert puede_gestionar(_orden(asignado_a=1), _usuario(Rol.OPERARIO, id=1))
    assert not puede_gestionar(_orden(asignado_a=2), _usuario(Rol.OPERARIO, id=1))


def test_secretaria_no_avanza_etapas_de_produccion():
    """Avanzar el pipeline es del taller o de la supervisión, no de mostrador."""
    assert not puede_avanzar_etapa(_orden(asignado_a=2), _usuario(Rol.SECRETARIA, id=1))


def test_operario_avanza_las_suyas():
    assert puede_avanzar_etapa(_orden(asignado_a=1), _usuario(Rol.OPERARIO, id=1))
    assert not puede_avanzar_etapa(_orden(asignado_a=2), _usuario(Rol.OPERARIO, id=1))
