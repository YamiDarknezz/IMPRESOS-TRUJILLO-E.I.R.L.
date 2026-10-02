"""Métricas del panel de órdenes y paginación del historial (#27, #28).

Lo que se prueba aquí no es la aritmética sino la fuente de los números: con
más registros que el bloque que devuelve el listado, el panel tiene que seguir
diciendo la verdad y la pantalla tiene que poder saber cuántos hay.
"""
from datetime import date, timedelta

from app.core.fechas import ahora_utc
from app.models import Auditoria, EstadoOrden, Orden, TipoEventoAuditoria
from tests.apoyo import cabecera_token


def _orden(admin, cliente, indice: int, **overrides) -> Orden:
    datos = dict(
        tipo_documento="contrato",
        cliente_id=cliente.id,
        creado_por=admin.id,
        descripcion=f"Trabajo {indice}",
        fecha_entrega=date(2026, 12, 31),
        estado=EstadoOrden.PENDIENTE,
        subtotal=100,
        total=100,
        saldo_pendiente=50,
        pagado_totalmente=False,
    )
    datos.update(overrides)
    return Orden(**datos)


async def test_metricas_cuentan_todas_las_ordenes_no_solo_el_primer_bloque(
    cliente_api, sesion, admin, cliente
):
    # 120 órdenes: más que el límite por defecto del listado (100).
    sesion.add_all([_orden(admin, cliente, i) for i in range(120)])
    await sesion.flush()

    listado = (await cliente_api.get("/api/ordenes", headers=cabecera_token(admin))).json()
    assert len(listado["data"]) == 100  # el bloque sigue igual...
    assert listado["total"] == 120      # ...pero ahora se sabe cuántas hay

    metricas = (
        await cliente_api.get("/api/ordenes/metricas", headers=cabecera_token(admin))
    ).json()["data"]

    assert metricas["total"] == 120
    assert metricas["en_proceso"] == 120
    # La suma incluye las 20 que quedan fuera del bloque: antes eran invisibles.
    assert metricas["por_cobrar"] == 120 * 50


async def test_metricas_separan_vencidas_finalizadas_y_canceladas(
    cliente_api, sesion, admin, cliente
):
    sesion.add_all(
        [
            _orden(admin, cliente, 1, fecha_entrega=date(2020, 1, 1)),  # vencida
            _orden(
                admin, cliente, 2,
                estado=EstadoOrden.ENTREGADA, saldo_pendiente=0, pagado_totalmente=True,
            ),
            _orden(admin, cliente, 3, estado=EstadoOrden.CANCELADA),
            _orden(admin, cliente, 4),
        ]
    )
    await sesion.flush()

    metricas = (
        await cliente_api.get("/api/ordenes/metricas", headers=cabecera_token(admin))
    ).json()["data"]

    assert metricas["total"] == 4
    assert metricas["vencidas"] == 1
    assert metricas["finalizadas"] == 1
    # La cancelada no se cobra y la entregada ya está pagada.
    assert metricas["por_cobrar"] == 100


async def test_metricas_respetan_el_alcance_de_cada_rol(
    cliente_api, sesion, admin, operario, cliente
):
    sesion.add_all(
        [
            _orden(admin, cliente, 1, asignado_a=operario.id),
            _orden(admin, cliente, 2),  # sin dueño: la ve cualquiera
            _orden(admin, cliente, 3, asignado_a=admin.id),
        ]
    )
    await sesion.flush()

    todas = (
        await cliente_api.get("/api/ordenes/metricas", headers=cabecera_token(admin))
    ).json()["data"]
    propias = (
        await cliente_api.get("/api/ordenes/metricas", headers=cabecera_token(operario))
    ).json()["data"]

    assert todas["total"] == 3
    # El operario cuenta solo las suyas y las que no tienen dueño.
    assert propias["total"] == 2
    assert propias["por_cobrar"] == 100


async def test_el_listado_pagina_por_offset(cliente_api, sesion, admin, cliente):
    sesion.add_all([_orden(admin, cliente, i) for i in range(120)])
    await sesion.flush()

    primera = (await cliente_api.get("/api/ordenes?limit=5", headers=cabecera_token(admin))).json()
    ultima = (
        await cliente_api.get("/api/ordenes?limit=5&offset=115", headers=cabecera_token(admin))
    ).json()
    vacia = (
        await cliente_api.get("/api/ordenes?limit=5&offset=120", headers=cabecera_token(admin))
    ).json()

    assert len(primera["data"]) == 5
    assert len(ultima["data"]) == 5
    assert vacia["data"] == []
    assert primera["total"] == ultima["total"] == vacia["total"] == 120
    # Los bloques no se solapan.
    assert not ({o["id"] for o in primera["data"]} & {o["id"] for o in ultima["data"]})


async def test_auditoria_informa_total_y_pagina(cliente_api, sesion, admin):
    sesion.add_all(
        [
            Auditoria(
                usuario_id=admin.id,
                accion=TipoEventoAuditoria.CREAR,
                tabla_afectada="ordenes",
                registro_id=str(i),
                detalle=f"alta {i}",
            )
            for i in range(5)
        ]
    )
    await sesion.flush()

    primera = (await cliente_api.get("/api/auditoria?limit=2", headers=cabecera_token(admin))).json()
    segunda = (
        await cliente_api.get("/api/auditoria?limit=2&offset=2", headers=cabecera_token(admin))
    ).json()

    assert len(primera["data"]) == 2
    assert primera["total"] == 5
    assert len(segunda["data"]) == 2
    assert not ({e["id"] for e in primera["data"]} & {e["id"] for e in segunda["data"]})


async def test_auditoria_filtra_por_accion(cliente_api, sesion, admin):
    sesion.add_all(
        [
            Auditoria(
                usuario_id=admin.id,
                accion=TipoEventoAuditoria.CREAR,
                tabla_afectada="ordenes",
                detalle="alta",
            ),
            Auditoria(
                usuario_id=admin.id,
                accion=TipoEventoAuditoria.EDITAR,
                tabla_afectada="ordenes",
                detalle="edicion",
            ),
            Auditoria(
                usuario_id=admin.id,
                accion=TipoEventoAuditoria.EDITAR,
                tabla_afectada="clientes",
                detalle="edicion",
            ),
        ]
    )
    await sesion.flush()

    solo_editar = (
        await cliente_api.get("/api/auditoria?accion=editar", headers=cabecera_token(admin))
    ).json()

    assert solo_editar["total"] == 2
    assert all(e["accion"] == "editar" for e in solo_editar["data"])


async def test_auditoria_filtra_por_dia_peruano(cliente_api, sesion, admin):
    ayer = ahora_utc() - timedelta(days=1)
    sesion.add_all(
        [
            Auditoria(
                usuario_id=admin.id,
                accion=TipoEventoAuditoria.SESION,
                tabla_afectada="usuarios",
                detalle="hoy",
                fecha=ahora_utc(),
            ),
            Auditoria(
                usuario_id=admin.id,
                accion=TipoEventoAuditoria.SESION,
                tabla_afectada="usuarios",
                detalle="ayer",
                fecha=ayer,
            ),
        ]
    )
    await sesion.flush()

    rango_ayer = (
        await cliente_api.get(
            f"/api/auditoria?desde={ayer.date().isoformat()}&hasta={ayer.date().isoformat()}",
            headers=cabecera_token(admin),
        )
    ).json()

    assert rango_ayer["total"] == 1
    assert rango_ayer["data"][0]["detalle"] == "ayer"
