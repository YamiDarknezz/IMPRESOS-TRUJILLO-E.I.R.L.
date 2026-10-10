"""El rollo se descuenta solo al crear la orden (issue #127).

Antes había que salir de la orden, ir a Inventario → Control de Rollos y registrar
el corte a mano. Ahora la línea de material trae el rollo elegido y la orden le
descuenta los metros. Lo delicado: el material ya se RESERVA al crear la orden, así
que el rollo no puede volver a restarlo.
"""
import pytest

from app.core.errores import ErrorDeNegocio
from app.models import EstadoPieza, Material, TipoFormatoMaterial
from app.schemas import MaterialEstimado
from app.schemas.inventario import ConsumoPiezaCreateData, PiezaLoteCreateData
from app.services import inventario_service, ordenes_service
from tests.apoyo import cabecera_token, datos_orden


async def _rollo(sesion, admin, material, capacidad=20, codigo="R-1"):
    """Un rollo del material; su capacidad entra al stock del material (#56)."""
    return await inventario_service.registrar_pieza(
        sesion,
        PiezaLoteCreateData(
            material_id=material.id,
            codigo_identificador=codigo,
            capacidad_inicial=capacidad,
            unidad_medida="ml",
        ),
        admin,
    )


def _datos(material, cliente, cantidad=2, pieza_id=None, **cambios):
    return datos_orden(
        material.id,
        cliente_id=cliente.id,
        materiales_estimados=[
            MaterialEstimado(material_id=material.id, cantidad=cantidad, pieza_id=pieza_id)
        ],
        **cambios,
    )


def _automaticos(pieza):
    return [c for c in pieza.consumos if c.automatico]


async def test_crear_la_orden_descuenta_el_rollo_y_deja_el_corte_ligado(
    sesion, admin, material, cliente
):
    rollo = await _rollo(sesion, admin, material)

    orden = await ordenes_service.crear_orden(sesion, _datos(material, cliente, 2, rollo.id), admin)

    assert float(rollo.saldo_restante) == 18
    assert rollo.estado == EstadoPieza.EN_USO
    (corte,) = _automaticos(rollo)
    assert corte.orden_id == orden.id
    assert float(corte.cantidad_consumida) == 2
    assert float(corte.monto_cobrado) == 0
    assert orden.materiales[0].pieza_id == rollo.id


async def test_el_material_baja_una_sola_vez(sesion, admin, material, cliente):
    """La reserva ya descontó esos metros del material: el rollo no los resta otra vez."""
    rollo = await _rollo(sesion, admin, material)  # stock del material: 10 + 20
    antes = float(material.stock_actual)

    await ordenes_service.crear_orden(sesion, _datos(material, cliente, 2, rollo.id), admin)

    assert float(material.stock_actual) == antes - 2


async def test_sin_rollo_la_orden_solo_reserva_como_siempre(sesion, admin, material, cliente):
    rollo = await _rollo(sesion, admin, material)

    await ordenes_service.crear_orden(sesion, _datos(material, cliente, 2), admin)

    assert float(rollo.saldo_restante) == 20
    assert rollo.consumos == []


async def test_si_el_rollo_no_alcanza_la_orden_no_pasa(sesion, admin, material, cliente):
    rollo = await _rollo(sesion, admin, material, capacidad=1)

    with pytest.raises(ErrorDeNegocio, match="disponibles"):
        await ordenes_service.crear_orden(sesion, _datos(material, cliente, 2, rollo.id), admin)

    assert float(rollo.saldo_restante) == 1
    assert _automaticos(rollo) == []


async def test_el_rollo_debe_ser_del_material_de_la_linea_y_no_estar_agotado(
    sesion, admin, material, cliente, unidad
):
    otro = Material(
        nombre="Vinil", unidad=unidad, stock_actual=5, alerta_minima=1,
        tipo_formato=TipoFormatoMaterial.CONTINUO_ROLLO,
    )
    sesion.add(otro)
    await sesion.flush()
    rollo_de_otro = await _rollo(sesion, admin, otro, codigo="V-1")

    with pytest.raises(ErrorDeNegocio, match="no es del material"):
        await ordenes_service.crear_orden(
            sesion, _datos(material, cliente, 2, rollo_de_otro.id), admin
        )

    agotado = await _rollo(sesion, admin, material, capacidad=2, codigo="R-2")
    await ordenes_service.crear_orden(sesion, _datos(material, cliente, 2, agotado.id), admin)
    assert agotado.estado == EstadoPieza.AGOTADO
    with pytest.raises(ErrorDeNegocio, match="agotado"):
        await ordenes_service.crear_orden(sesion, _datos(material, cliente, 1, agotado.id), admin)


async def test_editar_la_cantidad_ajusta_el_rollo_y_deja_un_solo_corte(
    sesion, admin, material, cliente
):
    rollo = await _rollo(sesion, admin, material)
    orden = await ordenes_service.crear_orden(sesion, _datos(material, cliente, 2, rollo.id), admin)
    antes = float(material.stock_actual)  # ya con la reserva de 2

    await ordenes_service.actualizar(sesion, orden.id, _datos(material, cliente, 5, rollo.id), admin)

    assert float(rollo.saldo_restante) == 15
    (corte,) = _automaticos(rollo)
    assert float(corte.cantidad_consumida) == 5
    assert float(material.stock_actual) == antes - 3  # el material, 3 más: una sola vez


async def test_editar_puede_cambiar_de_rollo_o_quitarlo(sesion, admin, material, cliente):
    uno = await _rollo(sesion, admin, material, codigo="R-1")
    dos = await _rollo(sesion, admin, material, codigo="R-2")
    orden = await ordenes_service.crear_orden(sesion, _datos(material, cliente, 2, uno.id), admin)

    await ordenes_service.actualizar(sesion, orden.id, _datos(material, cliente, 2, dos.id), admin)
    assert float(uno.saldo_restante) == 20
    assert float(dos.saldo_restante) == 18

    await ordenes_service.actualizar(sesion, orden.id, _datos(material, cliente, 2), admin)
    assert float(dos.saldo_restante) == 20
    assert _automaticos(dos) == []
    assert orden.materiales[0].pieza_id is None


async def test_cancelar_devuelve_los_metros_al_rollo(sesion, admin, material, cliente):
    rollo = await _rollo(sesion, admin, material)
    orden = await ordenes_service.crear_orden(sesion, _datos(material, cliente, 2, rollo.id), admin)
    assert rollo.estado == EstadoPieza.EN_USO

    await ordenes_service.cancelar(sesion, orden.id, admin)

    assert float(rollo.saldo_restante) == 20
    assert rollo.estado == EstadoPieza.DISPONIBLE
    assert _automaticos(rollo) == []


async def test_reportar_el_uso_real_ajusta_el_rollo_por_la_diferencia(
    sesion, admin, material, cliente
):
    rollo = await _rollo(sesion, admin, material)
    orden = await ordenes_service.crear_orden(sesion, _datos(material, cliente, 2, rollo.id), admin)

    await ordenes_service.completar(
        sesion, orden.id, [MaterialEstimado(material_id=material.id, cantidad=3)], admin
    )

    assert float(rollo.saldo_restante) == 17
    assert float(_automaticos(rollo)[0].cantidad_consumida) == 3


async def test_reportar_que_se_uso_menos_devuelve_al_rollo(sesion, admin, material, cliente):
    rollo = await _rollo(sesion, admin, material)
    orden = await ordenes_service.crear_orden(sesion, _datos(material, cliente, 2, rollo.id), admin)

    await ordenes_service.completar(
        sesion, orden.id, [MaterialEstimado(material_id=material.id, cantidad=1)], admin
    )

    assert float(rollo.saldo_restante) == 19


async def test_los_cortes_manuales_de_la_orden_no_se_tocan(sesion, admin, material, cliente):
    rollo = await _rollo(sesion, admin, material)
    orden = await ordenes_service.crear_orden(sesion, _datos(material, cliente, 2, rollo.id), admin)
    # Un corte registrado a mano en Inventario para esta misma orden (p. ej. desperdicio).
    await inventario_service.registrar_consumo_pieza(
        sesion,
        rollo.id,
        ConsumoPiezaCreateData(
            trabajo_descripcion="Corte aparte", cantidad_consumida=1, orden_id=orden.id
        ),
        admin,
    )
    assert float(rollo.saldo_restante) == 17

    await ordenes_service.cancelar(sesion, orden.id, admin)

    # Solo se devolvió lo automático (2); el manual (1) queda.
    assert float(rollo.saldo_restante) == 19
    assert len(rollo.consumos) == 1 and not rollo.consumos[0].automatico


async def test_la_api_descuenta_el_rollo_y_lo_muestra_en_los_rollos_del_pedido(
    cliente_api, sesion, admin, material, cliente
):
    rollo = await _rollo(sesion, admin, material)
    payload = _datos(material, cliente, 2, rollo.id).model_dump(mode="json")

    respuesta = await cliente_api.post("/api/ordenes", json=payload, headers=cabecera_token(admin))

    assert respuesta.status_code == 200, respuesta.text
    orden = respuesta.json()["data"]
    assert orden["materiales"]["estimados"][0]["pieza_id"] == rollo.id

    rollos = await cliente_api.get(
        f"/api/ordenes/{orden['id']}/rollos", headers=cabecera_token(admin)
    )
    (corte,) = rollos.json()["data"]
    assert corte["automatico"] is True
    assert corte["cantidad_consumida"] == 2
    assert corte["saldo_restante_pieza"] == 18
