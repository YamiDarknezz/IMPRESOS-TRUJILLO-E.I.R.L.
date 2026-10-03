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

from app.core.fechas import a_fecha_peru, ahora_utc, dentro_del_rango
from app.models import (
    CanalIngreso,
    EstadoOrden,
    Orden,
    Rol,
    TipoDocumento,
    TipoPago,
    UnidadNegocio,
    Usuario,
)

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
    canal_ingreso: Optional[CanalIngreso] = None,
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
    ordenes_canceladas = list(
        (
            await sesion.execute(select(Orden).where(Orden.estado == EstadoOrden.CANCELADA))
        ).scalars()
    )
    nombres = {
        u.id: u.nombre for u in (await sesion.execute(select(Usuario))).scalars()
    }

    por_trabajador: dict = {}
    por_unidad = {unidad.value: _unidad_vacia() for unidad in UnidadNegocio}
    por_canal = {canal.value: _unidad_vacia() for canal in CanalIngreso}
    por_metodo: dict[str, float] = {}

    total_contratos = total_por_cobrar = total_adelantos = total_ingresos = 0.0
    total_ordenes = 0

    for orden in ordenes:
        if trabajador_id is not None and orden.asignado_a != trabajador_id:
            continue
        if unidad_negocio is not None and orden.unidad_negocio != unidad_negocio:
            continue
        if canal_ingreso is not None and orden.canal_ingreso != canal_ingreso:
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
        canal = por_canal[orden.canal_ingreso.value]

        # ── Lo vendido: se mide por la fecha en que se creó la orden ───────
        if dentro_del_rango(orden.creado_en, desde, hasta):
            neto = float(orden.total)
            total_contratos += neto
            total_ordenes += 1
            fila["contratos"] += neto
            fila["ordenes"] += 1
            unidad["contratos"] += neto
            canal["contratos"] += neto

            if not orden.pagado_totalmente:
                saldo = float(orden.saldo_pendiente)
                total_por_cobrar += saldo
                fila["por_cobrar"] += saldo
                unidad["por_cobrar"] += saldo
                canal["por_cobrar"] += saldo

        # ── Lo cobrado: se mide por la fecha real de cada pago ─────────────
        for pago in orden.pagos:
            if not dentro_del_rango(pago.fecha, desde, hasta):
                continue
            if not pago.es_conforme:
                # Un pago observado/anulado es dinero que el negocio ya sabe
                # que no existe; Caja lo excluye del arqueo (issue #16), y
                # Finanzas no puede seguir contándolo como ingreso recibido.
                continue

            monto = float(pago.monto)
            metodo = pago.metodo.value if pago.metodo else METODO_SIN_ESPECIFICAR

            total_ingresos += monto
            if pago.tipo == TipoPago.ADELANTO:
                total_adelantos += monto
            por_metodo[metodo] = por_metodo.get(metodo, 0.0) + monto
            fila["ingresos"] += monto
            unidad["ingresos"] += monto
            canal["ingresos"] += monto

    total_canceladas = 0
    for orden in ordenes_canceladas:
        if trabajador_id is not None and orden.asignado_a != trabajador_id:
            continue
        if unidad_negocio is not None and orden.unidad_negocio != unidad_negocio:
            continue
        if canal_ingreso is not None and orden.canal_ingreso != canal_ingreso:
            continue
        if dentro_del_rango(orden.creado_en, desde, hasta):
            total_canceladas += 1

    return {
        "es_supervisor": es_supervisor,
        "total_contratos": _redondear(total_contratos),
        "total_adelantos": _redondear(total_adelantos),
        "total_ingresos": _redondear(total_ingresos),
        "total_por_cobrar": _redondear(total_por_cobrar),
        "total_ordenes": total_ordenes,
        "total_ordenes_canceladas": total_canceladas,
        "por_metodo": {k: _redondear(v) for k, v in por_metodo.items()},
        "por_unidad_negocio": {
            clave: {k: _redondear(v) for k, v in valores.items()}
            for clave, valores in por_unidad.items()
        },
        "por_canal_ingreso": {
            clave: {k: _redondear(v) for k, v in valores.items()}
            for clave, valores in por_canal.items()
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


# ── Cuentas por cobrar (#72) ────────────────────────────────────────────────

# Tramos de antigüedad de la deuda, en días: (clave, desde, hasta inclusive).
TRAMOS_ANTIGUEDAD = (
    ("d0_30", 0, 30),
    ("d31_60", 31, 60),
    ("d61_90", 61, 90),
    ("d90_mas", 91, None),
)


def tramo_de(dias: int) -> str:
    """Tramo de antigüedad al que pertenece una deuda de `dias` días."""
    for clave, desde, hasta in TRAMOS_ANTIGUEDAD:
        if dias >= desde and (hasta is None or dias <= hasta):
            return clave
    return TRAMOS_ANTIGUEDAD[0][0]


def _tramos_vacios() -> dict[str, float]:
    return {clave: 0.0 for clave, _, _ in TRAMOS_ANTIGUEDAD}


async def cuentas_por_cobrar(
    sesion: AsyncSession,
    solo_proformas: bool = True,
    hoy: Optional[date] = None,
) -> dict:
    """
    Lo que cada cliente debe, con la antigüedad de la deuda (#72).

    La deuda se cuenta desde que se entregó el trabajo (lo que de verdad la
    genera); si todavía no se entregó, desde que se creó la orden. Las órdenes
    canceladas no deben nada. Por defecto solo se listan las PROFORMAS, que
    son las que se entregan antes de pagar (clientes de confianza y empresas
    que pagan a plazo).
    """
    hoy = hoy or a_fecha_peru(ahora_utc())
    ordenes = list(
        (
            await sesion.execute(
                select(Orden).where(
                    Orden.estado != EstadoOrden.CANCELADA,
                    Orden.pagado_totalmente.is_(False),
                    Orden.saldo_pendiente > 0,
                )
            )
        ).scalars()
    )

    por_cliente: dict[int, dict] = {}
    total = 0.0
    tramos_totales = _tramos_vacios()

    for orden in ordenes:
        cliente = orden.cliente
        if solo_proformas and orden.tipo_documento != TipoDocumento.PROFORMA:
            continue

        referencia = orden.entregada_en or orden.creado_en
        dias = max((hoy - a_fecha_peru(referencia)).days, 0)
        tramo = tramo_de(dias)
        saldo = float(orden.saldo_pendiente)

        fila = por_cliente.setdefault(
            orden.cliente_id,
            {
                "cliente_id": orden.cliente_id,
                "cliente": cliente.nombre if cliente else "",
                "es_corporativo": bool(cliente and cliente.es_corporativo),
                "saldo_pendiente": 0.0,
                "dias_mayor_antiguedad": 0,
                "tramos": _tramos_vacios(),
                "ordenes": [],
            },
        )
        fila["saldo_pendiente"] = round(fila["saldo_pendiente"] + saldo, 2)
        fila["tramos"][tramo] = round(fila["tramos"][tramo] + saldo, 2)
        fila["dias_mayor_antiguedad"] = max(fila["dias_mayor_antiguedad"], dias)
        fila["ordenes"].append(
            {
                "orden_id": orden.id,
                "codigo": orden.codigo,
                "estado": orden.estado.value,
                "total": round(float(orden.total), 2),
                "saldo_pendiente": round(saldo, 2),
                "fecha_referencia": a_fecha_peru(referencia).isoformat(),
                "dias": dias,
                "tramo": tramo,
                "entregada_con_saldo": orden.estado == EstadoOrden.ENTREGADA,
                "entrega_autorizada_por": orden.autorizador_entrega.nombre
                if orden.autorizador_entrega
                else None,
                "entrega_motivo": orden.entrega_motivo or "",
            }
        )
        total = round(total + saldo, 2)
        tramos_totales[tramo] = round(tramos_totales[tramo] + saldo, 2)

    clientes = sorted(por_cliente.values(), key=lambda f: f["saldo_pendiente"], reverse=True)
    for fila in clientes:
        fila["ordenes"].sort(key=lambda o: o["dias"], reverse=True)

    return {
        "fecha_corte": hoy.isoformat(),
        "solo_proformas": solo_proformas,
        "total_pendiente": total,
        "tramos": tramos_totales,
        "clientes": clientes,
    }

