"""Catálogo de unidades: edición y borrado lógico visible (#58).

El borrado de una unidad es lógico (los materiales que ya la usan siguen
apuntando a ella), así que el listado tiene que distinguir las activas de las
desactivadas: los formularios que eligen unidad ofrecen solo las activas y la
pantalla del catálogo las muestra todas.
"""
from sqlalchemy import select

from app.models import Auditoria, TipoEventoAuditoria, Unidad
from tests.apoyo import cabecera_token


async def test_listado_por_defecto_ofrece_solo_activas(cliente_api, sesion, admin, unidad):
    sesion.add(Unidad(nombre="kilogramo", abreviatura="kg", activo=False))
    await sesion.flush()

    respuesta = await cliente_api.get("/api/unidades", headers=cabecera_token(admin))

    nombres = [u["nombre"] for u in respuesta.json()["data"]]
    assert "metros cuadrados" in nombres
    assert "kilogramo" not in nombres


async def test_listado_con_inactivas_las_incluye_marcadas(cliente_api, sesion, admin, unidad):
    sesion.add(Unidad(nombre="kilogramo", abreviatura="kg", activo=False))
    await sesion.flush()

    respuesta = await cliente_api.get(
        "/api/unidades?incluir_inactivas=true", headers=cabecera_token(admin)
    )

    datos = respuesta.json()["data"]
    nombres = [u["nombre"] for u in datos]
    assert {"metros cuadrados", "kilogramo"} <= set(nombres)
    kilogramo = next(u for u in datos if u["nombre"] == "kilogramo")
    assert kilogramo["activo"] is False


async def test_editar_nombre_y_abreviatura(cliente_api, sesion, admin, unidad):
    respuesta = await cliente_api.patch(
        f"/api/unidades/{unidad.id}",
        json={"nombre": "metros", "abreviatura": "m"},
        headers=cabecera_token(admin),
    )

    assert respuesta.status_code == 200
    assert respuesta.json()["data"] == {
        "id": unidad.id, "nombre": "metros", "abreviatura": "m", "activo": True,
    }

    entradas = (
        await sesion.execute(
            select(Auditoria).where(
                Auditoria.tabla_afectada == "unidades",
                Auditoria.accion == TipoEventoAuditoria.EDITAR,
            )
        )
    ).scalars().all()
    assert len(entradas) == 1


async def test_desactivar_la_deja_fuera_de_los_formularios_sin_romper_lo_que_la_usa(
    cliente_api, sesion, admin, unidad, material
):
    respuesta = await cliente_api.delete(f"/api/unidades/{unidad.id}", headers=cabecera_token(admin))
    assert respuesta.status_code == 200

    await sesion.refresh(unidad)
    assert unidad.activo is False
    # El material que ya la usaba sigue apuntando a ella (borrado lógico)...
    assert material.unidad_id == unidad.id
    # ...pero deja de ofrecerse al registrar materiales nuevos.
    ofrecidas = (await cliente_api.get("/api/unidades", headers=cabecera_token(admin))).json()["data"]
    assert all(u["id"] != unidad.id for u in ofrecidas)
    todas = (
        await cliente_api.get("/api/unidades?incluir_inactivas=true", headers=cabecera_token(admin))
    ).json()["data"]
    assert any(u["id"] == unidad.id for u in todas)


async def test_editar_exige_administrador(cliente_api, operario, unidad):
    respuesta = await cliente_api.patch(
        f"/api/unidades/{unidad.id}",
        json={"nombre": "metros", "abreviatura": "m"},
        headers=cabecera_token(operario),
    )
    assert respuesta.status_code == 403
