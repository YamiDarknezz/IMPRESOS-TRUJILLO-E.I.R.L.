"""Parámetros y catálogos del negocio en un solo lugar (#54).

Lo que se prueba aquí no es el endpoint sino que no vuelva a pasar lo de antes:
el frontend tenía copiadas las listas y quedaron desactualizadas, así que en
`/auditoria` las acciones nuevas se mostraban con su texto crudo.
"""
from app.core import catalogos as mod_catalogos
from app.models.enums import (
    EstadoPago,
    MetodoPago,
    MotivoMovimiento,
    MotivoObservacionPago,
    TipoEventoAuditoria,
    TipoPago,
)
from tests.apoyo import cabecera_token


async def test_los_catalogos_cubren_todos_los_valores(cliente_api, admin):
    """
    Cada valor de cada enum tiene su nombre legible.

    Si mañana se agrega una acción de auditoría y nadie le pone etiqueta, esta
    prueba falla: es más barato que descubrirlo en la pantalla.
    """
    respuesta = await cliente_api.get("/api/configuracion", headers=cabecera_token(admin))
    assert respuesta.status_code == 200
    datos = respuesta.json()["data"]["catalogos"]

    esperado = {
        "metodos_pago": MetodoPago,
        "tipos_pago": TipoPago,
        "estados_pago": EstadoPago,
        "motivos_observacion": MotivoObservacionPago,
        "motivos_movimiento": MotivoMovimiento,
        "acciones_auditoria": TipoEventoAuditoria,
    }

    for nombre, enum in esperado.items():
        valores = [item["valor"] for item in datos[nombre]]
        assert valores == [miembro.value for miembro in enum], nombre
        # Y ninguna etiqueta quedó con el texto crudo del valor.
        for item in datos[nombre]:
            assert item["etiqueta"] and item["etiqueta"] != item["valor"], (
                f"{nombre}: {item['valor']} sin nombre legible"
            )


async def test_las_etiquetas_no_estan_vacias_ni_repetidas(cliente_api, admin):
    datos = (
        await cliente_api.get("/api/configuracion", headers=cabecera_token(admin))
    ).json()["data"]["catalogos"]

    for nombre, lista in datos.items():
        etiquetas = [item["etiqueta"] for item in lista]
        assert len(etiquetas) == len(set(etiquetas)), f"{nombre}: etiquetas repetidas"


async def test_los_parametros_son_los_de_la_configuracion(cliente_api, admin):
    from app.core.config import settings

    datos = (
        await cliente_api.get("/api/configuracion", headers=cabecera_token(admin))
    ).json()["data"]["parametros"]

    assert datos["igv_porcentaje"] == settings.igv_porcentaje
    assert datos["adelanto_minimo_porcentaje"] == settings.adelanto_minimo_porcentaje


async def test_la_configuracion_pide_sesion(cliente_api):
    """Los porcentajes del negocio no son públicos."""
    assert (await cliente_api.get("/api/configuracion")).status_code == 401


def test_cada_etiqueta_declarada_corresponde_a_un_valor_real():
    """
    Al revés también: una etiqueta de un valor que ya no existe es código muerto
    que confunde (y hace pensar que el catálogo cubre más de lo que cubre).
    """
    pares = [
        (mod_catalogos.ETIQUETA_METODO_PAGO, MetodoPago, "metodos_pago"),
        (mod_catalogos.ETIQUETA_TIPO_PAGO, TipoPago, "tipos_pago"),
        (mod_catalogos.ETIQUETA_ESTADO_PAGO, EstadoPago, "estados_pago"),
        (mod_catalogos.ETIQUETA_MOTIVO_OBSERVACION, MotivoObservacionPago, "motivos_observacion"),
        (mod_catalogos.ETIQUETA_MOTIVO_MOVIMIENTO, MotivoMovimiento, "motivos_movimiento"),
        (mod_catalogos.ETIQUETA_ACCION, TipoEventoAuditoria, "acciones_auditoria"),
    ]

    for etiquetas, enum, nombre in pares:
        sobrantes = set(etiquetas) - set(enum)
        assert not sobrantes, f"{nombre}: etiquetas de valores inexistentes {sobrantes}"
        faltantes = set(enum) - set(etiquetas)
        assert not faltantes, f"{nombre}: valores sin etiqueta {faltantes}"
