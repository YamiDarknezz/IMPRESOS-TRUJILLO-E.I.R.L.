"""Cálculo de los reportes financieros.

Dos preguntas distintas, con dos fechas distintas (decisión D5) — y
confundirlas es el error más fácil de cometer aquí:

* "¿Cuánto vendí?"  → contratos y por cobrar, por fecha de CREACIÓN de la orden.
* "¿Cuánto entró?"  → ingresos, por la fecha REAL de cada pago.

Una orden creada en junio y cobrada en julio pesa en los contratos de junio y
en los ingresos de julio. Además se desglosa por unidad de negocio (Imprenta /
Gigantografías) para el cierre de caja dual.
"""
from datetime import date
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.fechas import dentro_del_rango
from app.models import EstadoOrden, Orden, Rol, TipoPago, UnidadNegocio, Usuario

METODO_SIN_ESPECIFICAR = "—"
NOMBRE_SIN_ASIGNAR = "Sin asignar"
CLAVE_SIN_ASIGNAR = "sin_asignar"


def _redondear(valor: float) -> float:
    return round(valor, 2)


def _fila_vacia(uid: Optional[int], nombre: str) -> dict:
    return {
        "uid": uid,
        "nombre": nombre,
        "contratos": 0.0,
        "ingresos": 0.0,
        "por_cobrar": 0.0,
        "ordenes": 0,
    }


def _unidad_vacia() -> dict:
    return {"contratos": 0.0, "ingresos": 0.0, "por_cobrar": 0.0}


async def resumen(
    sesion: AsyncSession,
    usuario: Usuario,
    desde: Optional[date] = None,
    hasta: Optional[date] = None,
    trabajador_id: Optional[int] = None,
    unidad_negocio: Optional[UnidadNegocio] = None,
) -> dict:
    """
    Arma el resumen financiero del rango pedido.

    Un trabajador siempre queda restringido a sus propias órdenes: el filtro
    se fuerza aquí, en el servidor, y no depende de lo que mande el cliente.
    """
    es_supervisor = usuario.rol in (Rol.ADMIN, Rol.SUBGERENTE)
    if not es_supervisor:
        trabajador_id = usuario.id

    ordenes = list(
        (
            await sesion.execute(select(Orden).where(Orden.estado != EstadoOrden.CANCELADA))
        ).scalars()
    )
    nombres = {
        u.id: u.nombre for u in (await sesion.execute(select(Usuario))).scalars()
    }

    por_trabajador: dict = {}
    por_unidad = {unidad.value: _unidad_vacia() for unidad in UnidadNegocio}
    por_metodo: dict[str, float] = {}

    total_contratos = total_por_cobrar = total_adelantos = total_ingresos = 0.0
    total_ordenes = 0

    for orden in ordenes:
        if trabajador_id is not None and orden.asignado_a != trabajador_id:
            continue
        if unidad_negocio is not None and orden.unidad_negocio != unidad_negocio:
            continue

        clave = orden.asignado_a or CLAVE_SIN_ASIGNAR
        fila = por_trabajador.setdefault(
            clave,
            _fila_vacia(
                orden.asignado_a,
                nombres.get(orden.asignado_a, NOMBRE_SIN_ASIGNAR)
                if orden.asignado_a
                else NOMBRE_SIN_ASIGNAR,
            ),
        )
        unidad = por_unidad[orden.unidad_negocio.value]

        # ── Lo vendido: se mide por la fecha en que se creó la orden ───────
        if dentro_del_rango(orden.creado_en, desde, hasta):
            neto = float(orden.total)
            total_contratos += neto
            total_ordenes += 1
            fila["contratos"] += neto
            fila["ordenes"] += 1
            unidad["contratos"] += neto

            if not orden.pagado_totalmente:
                saldo = float(orden.saldo_pendiente)
                total_por_cobrar += saldo
                fila["por_cobrar"] += saldo
                unidad["por_cobrar"] += saldo

        # ── Lo cobrado: se mide por la fecha real de cada pago ─────────────
        for pago in orden.pagos:
            if not dentro_del_rango(pago.fecha, desde, hasta):
                continue

            monto = float(pago.monto)
            metodo = pago.metodo.value if pago.metodo else METODO_SIN_ESPECIFICAR

            total_ingresos += monto
            if pago.tipo == TipoPago.ADELANTO:
                total_adelantos += monto
            por_metodo[metodo] = por_metodo.get(metodo, 0.0) + monto
            fila["ingresos"] += monto
            unidad["ingresos"] += monto

    return {
        "es_supervisor": es_supervisor,
        "total_contratos": _redondear(total_contratos),
        "total_adelantos": _redondear(total_adelantos),
        "total_ingresos": _redondear(total_ingresos),
        "total_por_cobrar": _redondear(total_por_cobrar),
        "total_ordenes": total_ordenes,
        "por_metodo": {k: _redondear(v) for k, v in por_metodo.items()},
        "por_unidad_negocio": {
            clave: {k: _redondear(v) for k, v in valores.items()}
            for clave, valores in por_unidad.items()
        },
        "por_trabajador": sorted(
            (
                {
                    **fila,
                    **{
                        campo: _redondear(fila[campo])
                        for campo in ("contratos", "ingresos", "por_cobrar")
                    },
                }
                for fila in por_trabajador.values()
            ),
            key=lambda fila: fila["contratos"],
            reverse=True,
        ),
    }
