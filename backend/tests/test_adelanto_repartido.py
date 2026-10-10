"""El adelanto repartido en varios métodos de pago (issue #124).

Un cliente deja, por ejemplo, S/ 150 de adelanto: S/ 100 en efectivo y S/ 50 por
Yape. Cada parte es su propio pago (con su método), así Caja y Finanzas ya las
desglosan bien; lo delicado es que editar la orden no pierda ninguna.
"""
import pytest
from pydantic import ValidationError

from app.core.errores import ErrorDeNegocio
from app.core.fechas import a_fecha_peru, ahora_utc
from app.models import MetodoPago, TipoPago, UnidadNegocio
from app.schemas import AdelantoParteData
from app.services import caja_service, ordenes_service
from tests.apoyo import cabecera_token, datos_orden


def _partes(*partes) -> list[AdelantoParteData]:
    return [AdelantoParteData(metodo=metodo, monto=monto) for metodo, monto in partes]


def _datos(material, cliente, partes, precio_total=300, **cambios):
    return datos_orden(
        material.id,
        cliente_id=cliente.id,
        precio_total=precio_total,
        adelanto_pago=sum(monto for _, monto in partes),
        metodo_pago=MetodoPago.EFECTIVO,
        adelanto_partes=_partes(*partes),
        **cambios,
    )


def _adelantos(orden):
    return [pago for pago in orden.pagos if pago.tipo == TipoPago.ADELANTO]


async def _crear_150(sesion, admin, material, cliente):
    return await ordenes_service.crear_orden(
        sesion,
        _datos(material, cliente, [(MetodoPago.EFECTIVO, 100), (MetodoPago.YAPE_ANGEL, 50)]),
        admin,
    )


async def test_el_adelanto_repartido_crea_un_pago_por_cada_parte(sesion, admin, material, cliente):
    orden = await _crear_150(sesion, admin, material, cliente)

    pagos = {pago.metodo: float(pago.monto) for pago in _adelantos(orden)}
    assert pagos == {MetodoPago.EFECTIVO: 100, MetodoPago.YAPE_ANGEL: 50}
    assert float(orden.adelanto) == 150
    assert float(orden.saldo_pendiente) == 150
    assert orden.pagado_totalmente is False
    # La lista muestra el método de la parte más grande; el detalle está en los pagos.
    assert orden.metodo_pago_adelanto == MetodoPago.EFECTIVO


async def test_caja_muestra_cada_parte_en_su_metodo(sesion, admin, material, cliente):
    await _crear_150(sesion, admin, material, cliente)

    resumen = await caja_service.resumen_dia(sesion, a_fecha_peru(ahora_utc()))

    assert resumen["total"]["efectivo"] == 100
    assert resumen["total"]["yape_angel"] == 50
    assert resumen["total"]["total"] == 150

    cierre = await caja_service.cerrar_caja(
        sesion, a_fecha_peru(ahora_utc()), UnidadNegocio.IMPRENTA, "", admin
    )
    assert float(cierre.monto_efectivo) == 100
    assert float(cierre.monto_yape_angel) == 50


async def test_el_minimo_del_adelanto_se_valida_sobre_la_suma(sesion, admin, material, cliente):
    # Mínimo 50 % de 400 = 200: 100 + 50 no alcanza aunque cada parte sea válida.
    with pytest.raises(ErrorDeNegocio, match="adelanto mínimo"):
        await ordenes_service.crear_orden(
            sesion,
            _datos(material, cliente, [(MetodoPago.EFECTIVO, 100), (MetodoPago.YAPE_ANGEL, 50)], precio_total=400),
            admin,
        )

    orden = await ordenes_service.crear_orden(
        sesion,
        _datos(material, cliente, [(MetodoPago.EFECTIVO, 100), (MetodoPago.YAPE_ANGEL, 100)], precio_total=400),
        admin,
    )
    assert float(orden.adelanto) == 200


def test_no_se_repite_un_metodo_ni_se_admiten_partes_en_cero_ni_sumas_que_no_cuadran(material):
    with pytest.raises(ValidationError, match="repetir"):
        datos_orden(
            material.id, adelanto_pago=100,
            adelanto_partes=_partes((MetodoPago.EFECTIVO, 60), (MetodoPago.EFECTIVO, 40)),
        )
    with pytest.raises(ValidationError, match="mayor a 0"):
        datos_orden(
            material.id, adelanto_pago=100,
            adelanto_partes=_partes((MetodoPago.EFECTIVO, 100), (MetodoPago.YAPE_ANGEL, 0)),
        )
    with pytest.raises(ValidationError, match="suma"):
        datos_orden(
            material.id, adelanto_pago=100,
            adelanto_partes=_partes((MetodoPago.EFECTIVO, 60), (MetodoPago.YAPE_ANGEL, 30)),
        )


async def test_editar_por_partes_conserva_cada_pago_y_sus_capturas(sesion, admin, material, cliente):
    orden = await _crear_150(sesion, admin, material, cliente)
    ids = {pago.metodo: pago.id for pago in _adelantos(orden)}

    await ordenes_service.actualizar(
        sesion,
        orden.id,
        _datos(material, cliente, [(MetodoPago.EFECTIVO, 120), (MetodoPago.YAPE_ANGEL, 50)]),
        admin,
    )

    pagos = {pago.metodo: pago for pago in _adelantos(orden)}
    assert {metodo: float(pago.monto) for metodo, pago in pagos.items()} == {
        MetodoPago.EFECTIVO: 120,
        MetodoPago.YAPE_ANGEL: 50,
    }
    # Siguen siendo los mismos pagos: lo que se les hubiera adjuntado no se pierde.
    assert {metodo: pago.id for metodo, pago in pagos.items()} == ids
    assert float(orden.adelanto) == 170


async def test_editar_puede_agregar_cambiar_y_quitar_partes(sesion, admin, material, cliente):
    orden = await _crear_150(sesion, admin, material, cliente)

    # Se agrega una tercera parte.
    await ordenes_service.actualizar(
        sesion,
        orden.id,
        _datos(
            material, cliente,
            [(MetodoPago.EFECTIVO, 100), (MetodoPago.YAPE_ANGEL, 50), (MetodoPago.TRANSFERENCIA, 30)],
        ),
        admin,
    )
    assert len(_adelantos(orden)) == 3
    assert float(orden.adelanto) == 180

    # Se quita el Yape y la transferencia sube de monto.
    await ordenes_service.actualizar(
        sesion,
        orden.id,
        _datos(material, cliente, [(MetodoPago.EFECTIVO, 100), (MetodoPago.TRANSFERENCIA, 50)]),
        admin,
    )
    assert {pago.metodo for pago in _adelantos(orden)} == {MetodoPago.EFECTIVO, MetodoPago.TRANSFERENCIA}
    assert float(orden.adelanto) == 150

    # Un Yape pasa a ser el otro número: se reutiliza su pago en vez de crear uno aparte.
    await ordenes_service.actualizar(
        sesion,
        orden.id,
        _datos(material, cliente, [(MetodoPago.YAPE_MARCELL, 100), (MetodoPago.TRANSFERENCIA, 50)]),
        admin,
    )
    assert {pago.metodo for pago in _adelantos(orden)} == {MetodoPago.YAPE_MARCELL, MetodoPago.TRANSFERENCIA}
    assert len(_adelantos(orden)) == 2


async def test_un_cliente_que_no_manda_partes_no_borra_el_segundo_adelanto(
    sesion, admin, material, cliente
):
    """
    Antes `_sincronizar_adelanto` conservaba el primer adelanto y quitaba los demás:
    con el adelanto repartido, esa edición habría hecho desaparecer S/ 50 sin avisar.
    """
    orden = await _crear_150(sesion, admin, material, cliente)

    with pytest.raises(ErrorDeNegocio, match="por partes"):
        await ordenes_service.actualizar(
            sesion,
            orden.id,
            datos_orden(
                material.id, cliente_id=cliente.id, precio_total=300,
                adelanto_pago=150, metodo_pago=MetodoPago.EFECTIVO,
            ),
            admin,
        )

    assert len(_adelantos(orden)) == 2
    assert float(orden.adelanto) == 150


async def test_no_se_cambia_una_parte_de_un_cierre_congelado(sesion, admin, material, cliente):
    orden = await _crear_150(sesion, admin, material, cliente)
    hoy = a_fecha_peru(ahora_utc())
    cierre = await caja_service.cerrar_caja(sesion, hoy, UnidadNegocio.IMPRENTA, "", admin)
    await caja_service.congelar_caja(sesion, cierre.id, "Validado", admin)

    with pytest.raises(ErrorDeNegocio, match="congelado"):
        await ordenes_service.actualizar(
            sesion,
            orden.id,
            _datos(material, cliente, [(MetodoPago.EFECTIVO, 100), (MetodoPago.YAPE_ANGEL, 70)]),
            admin,
        )

    assert float(orden.adelanto) == 150


async def test_la_api_acepta_el_adelanto_repartido(cliente_api, admin, material, cliente):
    payload = _datos(
        material, cliente, [(MetodoPago.EFECTIVO, 100), (MetodoPago.YAPE_ANGEL, 50)]
    ).model_dump(mode="json")

    respuesta = await cliente_api.post("/api/ordenes", json=payload, headers=cabecera_token(admin))

    assert respuesta.status_code == 200, respuesta.text
    pagos = respuesta.json()["data"]["finanzas"]["pagos"]
    assert {(p["metodo"], p["monto"]) for p in pagos if p["tipo"] == "adelanto"} == {
        ("efectivo", 100.0),
        ("yape_angel", 50.0),
    }


async def test_la_api_rechaza_partes_que_no_suman_el_adelanto(cliente_api, admin, material, cliente):
    payload = _datos(
        material, cliente, [(MetodoPago.EFECTIVO, 100), (MetodoPago.YAPE_ANGEL, 50)]
    ).model_dump(mode="json")
    payload["adelanto_pago"] = 200

    respuesta = await cliente_api.post("/api/ordenes", json=payload, headers=cabecera_token(admin))

    assert respuesta.status_code == 422
    assert "suma" in respuesta.json()["detail"]
