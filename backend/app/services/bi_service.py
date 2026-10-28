"""BI gerencial v1: flujos por fecha de evento y pendientes al corte actual.

Solo columnas y agregaciones SQL: no se hidrata el grafo de relaciones de Orden.
Los saldos y estados son actuales, nunca una reconstrucción histórica.
"""
from datetime import date, datetime, time, timedelta, timezone
from decimal import Decimal

from sqlalchemy import case, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.errores import ErrorDeNegocio
from app.core.fechas import ZONA_PERU, a_fecha_peru, ahora_utc
from app.models import Cliente, EstadoOrden, EstadoPago, Orden, PagoOrden


def _monto(valor) -> float:
    return float(Decimal(str(valor or 0)).quantize(Decimal("0.01")))


def _contar(condicion):
    return func.coalesce(func.sum(case((condicion, 1), else_=0)), 0)


def _rango(columna, desde: date, hasta: date):
    inicio = datetime.combine(desde, time.min, ZONA_PERU).astimezone(timezone.utc)
    fin = datetime.combine(hasta + timedelta(days=1), time.min, ZONA_PERU).astimezone(timezone.utc)
    return columna >= inicio, columna < fin


async def resumen(sesion: AsyncSession, desde: date, hasta: date, unidad=None, canal=None) -> dict:
    ahora = ahora_utc()
    hoy = a_fecha_peru(ahora)
    if desde > hasta:
        raise ErrorDeNegocio("La fecha inicial no puede ser posterior a la final.")
    if (hasta - desde).days >= 366:
        raise ErrorDeNegocio("Selecciona un período de hasta 366 días.")
    if hasta > hoy:
        raise ErrorDeNegocio("La fecha final no puede ser posterior a hoy en Perú.")

    alcance = []
    if unidad:
        alcance.append(Orden.unidad_negocio == unidad)
    if canal:
        alcance.append(Orden.canal_ingreso == canal)
    vigentes = [*alcance, Orden.estado != EstadoOrden.CANCELADA]
    conformes = PagoOrden.estado_pago == EstadoPago.CONFORME

    async def periodo(inicio, fin):
        fila = (await sesion.execute(select(
            func.count(Orden.id), func.coalesce(func.sum(Orden.total), 0),
            _contar(Orden.pagado_totalmente.is_(True)),
        ).where(*vigentes, *_rango(Orden.creado_en, inicio, fin)))).one()
        cobros = await sesion.scalar(select(func.coalesce(func.sum(PagoOrden.monto), 0))
            .join(Orden, Orden.id == PagoOrden.orden_id)
            .where(*vigentes, conformes, *_rango(PagoOrden.fecha, inicio, fin)))
        return {
            "ordenes": fila[0], "valor_ordenes": _monto(fila[1]), "cobros": _monto(cobros),
            "ticket_promedio": _monto(fila[1] / fila[0]) if fila[0] else 0,
            "liquidadas": int(fila[2]),
            "porcentaje_liquidadas": round(100 * fila[2] / fila[0], 1) if fila[0] else None,
        }

    actual = await periodo(desde, hasta)
    dias = (hasta - desde).days + 1
    anterior_hasta = desde - timedelta(days=1)
    anterior_desde = desde - timedelta(days=dias)
    anterior = await periodo(anterior_desde, anterior_hasta)
    primera = await sesion.scalar(select(func.min(Orden.creado_en)).where(*alcance))
    primera_fecha = a_fecha_peru(primera)

    # Agrupar en el calendario peruano; SQLite se usa solo en pruebas aisladas.
    def dia_local(columna):
        if sesion.get_bind().dialect.name == "sqlite":
            horas = int(ZONA_PERU.utcoffset(None).total_seconds() / 3600)
            return func.date(columna, f"{horas:+d} hours")
        return func.date(func.timezone("America/Lima", columna))

    dia_orden, dia_pago = dia_local(Orden.creado_en), dia_local(PagoOrden.fecha)
    ventas = (await sesion.execute(select(dia_orden, func.sum(Orden.total))
        .where(*vigentes, *_rango(Orden.creado_en, desde, hasta)).group_by(dia_orden))).all()
    cobros = (await sesion.execute(select(dia_pago, func.sum(PagoOrden.monto))
        .join(Orden, Orden.id == PagoOrden.orden_id)
        .where(*vigentes, conformes, *_rango(PagoOrden.fecha, desde, hasta)).group_by(dia_pago))).all()
    venta_dia = {str(f): _monto(m) for f, m in ventas}
    cobro_dia = {str(f): _monto(m) for f, m in cobros}
    serie = []
    for i in range(dias):
        dia = (desde + timedelta(days=i)).isoformat()
        serie.append({"fecha": dia, "ventas": venta_dia.get(dia, 0), "cobros": cobro_dia.get(dia, 0)})

    async def desglose(columna):
        filas = (await sesion.execute(select(
            columna, func.count(Orden.id), func.sum(Orden.total),
        ).where(*vigentes, *_rango(Orden.creado_en, desde, hasta)).group_by(columna))).all()
        return [{"clave": str(k), "ordenes": n, "ventas": _monto(v),
                 "ticket": _monto(v / n)} for k, n, v in filas]

    metodos = (await sesion.execute(select(PagoOrden.metodo, func.sum(PagoOrden.monto))
        .join(Orden, Orden.id == PagoOrden.orden_id)
        .where(*vigentes, conformes, *_rango(PagoOrden.fecha, desde, hasta))
        .group_by(PagoOrden.metodo))).all()

    # El stock de deuda y el tablero operativo NO reciben filtros de fechas.
    saldo = await sesion.scalar(select(func.coalesce(func.sum(Orden.saldo_pendiente), 0))
        .where(*vigentes, Orden.saldo_pendiente > 0))
    deuda_lineas = (await sesion.execute(select(Orden.unidad_negocio,
        func.count(Orden.id), func.sum(Orden.saldo_pendiente))
        .where(*vigentes, Orden.saldo_pendiente > 0).group_by(Orden.unidad_negocio))).all()
    deuda_clientes = (await sesion.execute(select(Cliente.id, Cliente.nombre,
        func.count(Orden.id), func.sum(Orden.saldo_pendiente))
        .join(Orden, Orden.cliente_id == Cliente.id)
        .where(*vigentes, Orden.saldo_pendiente > 0).group_by(Cliente.id, Cliente.nombre)
        .order_by(func.sum(Orden.saldo_pendiente).desc(), Cliente.id).limit(10))).all()
    edad = case(
        (Orden.fecha_entrega >= hoy - timedelta(days=7), "hasta_7"),
        (Orden.fecha_entrega >= hoy - timedelta(days=30), "d8_30"),
        else_="mas_30",
    )
    deuda_vencida = (await sesion.execute(select(edad, func.sum(Orden.saldo_pendiente))
        .where(*vigentes, Orden.saldo_pendiente > 0, Orden.fecha_entrega < hoy)
        .group_by(edad))).all()
    autorizada = await sesion.scalar(select(func.coalesce(func.sum(Orden.saldo_pendiente), 0))
        .where(*vigentes, Orden.estado == EstadoOrden.ENTREGADA, Orden.saldo_pendiente > 0,
               Orden.entrega_autorizada_por.is_not(None)))
    estados = (await sesion.execute(select(Orden.estado, func.count(Orden.id))
        .where(*vigentes).group_by(Orden.estado))).all()
    abierta = Orden.estado != EstadoOrden.ENTREGADA
    vencida = (Orden.fecha_entrega < hoy) & abierta
    lista_pagada = (Orden.estado == EstadoOrden.FINALIZADA) & (Orden.saldo_pendiente == 0)
    lista_deuda = (Orden.estado == EstadoOrden.FINALIZADA) & (Orden.saldo_pendiente > 0)
    operacion = (await sesion.execute(select(
        func.count(Orden.id), _contar(vencida), _contar(lista_pagada), _contar(lista_deuda),
        _contar(Orden.asignado_a.is_(None)),
        func.coalesce(func.sum(case((lista_deuda, Orden.saldo_pendiente), else_=0)), 0),
    ).where(*vigentes))).one()

    async def pendientes(condicion):
        filas = (await sesion.execute(select(Orden.id, Cliente.nombre, Orden.estado,
            Orden.fecha_entrega, Orden.total, Orden.saldo_pendiente)
            .join(Cliente, Cliente.id == Orden.cliente_id).where(*vigentes, condicion)
            .order_by(Orden.fecha_entrega, Orden.id).limit(10))).all()
        return [{"id": i, "codigo": f"ORD-{i:06d}", "cliente": n, "estado": str(e),
                 "fecha_entrega": f.isoformat(), "total": _monto(t), "saldo": _monto(s)}
                for i, n, e, f, t, s in filas]

    # Las duraciones solo usan registros coherentes y se informa su cobertura.
    if sesion.get_bind().dialect.name == "sqlite":
        duracion = (func.julianday(Orden.finalizada_en) - func.julianday(Orden.creado_en)) * 24
    else:
        duracion = func.extract("epoch", Orden.finalizada_en - Orden.creado_en) / 3600
    tiempos = (await sesion.execute(select(func.count(Orden.id), func.avg(duracion))
        .where(*vigentes, Orden.finalizada_en >= Orden.creado_en,
               *_rango(Orden.finalizada_en, desde, hasta)))).one()

    clientes_periodo = select(Orden.cliente_id.label("cliente_id"),
        func.count(Orden.id).label("n"), func.sum(Orden.total).label("ventas"))\
        .where(*vigentes, *_rango(Orden.creado_en, desde, hasta)).group_by(Orden.cliente_id).subquery()
    clientes = (await sesion.execute(select(func.count(),
        _contar(clientes_periodo.c.n > 1),
        func.coalesce(func.sum(case((clientes_periodo.c.n > 1, clientes_periodo.c.ventas), else_=0)), 0),
    ).select_from(clientes_periodo))).one()
    principales = (await sesion.execute(select(Cliente.id, Cliente.nombre,
        clientes_periodo.c.n, clientes_periodo.c.ventas)
        .join(clientes_periodo, clientes_periodo.c.cliente_id == Cliente.id)
        .order_by(clientes_periodo.c.ventas.desc(), Cliente.id).limit(5))).all()

    pagos_orden = select(PagoOrden.orden_id.label("id"), func.sum(PagoOrden.monto).label("pagado"))\
        .where(conformes).group_by(PagoOrden.orden_id).subquery()
    diferencias_query = select(Orden.id)
    diferencias_query = diferencias_query\
        .outerjoin(pagos_orden, pagos_orden.c.id == Orden.id).where(*vigentes,
            func.abs(Orden.total - Orden.saldo_pendiente - func.coalesce(pagos_orden.c.pagado, 0)) > Decimal("0.01"))
    total_diferencias = await sesion.scalar(select(func.count()).select_from(diferencias_query.subquery()))
    diferencias = (await sesion.execute(diferencias_query.order_by(Orden.id).limit(10))).scalars().all()
    pagos_cancelados = await sesion.scalar(select(func.coalesce(func.sum(PagoOrden.monto), 0))
        .join(Orden, Orden.id == PagoOrden.orden_id).where(*alcance, conformes,
            Orden.estado == EstadoOrden.CANCELADA, *_rango(PagoOrden.fecha, desde, hasta)))

    return {
        "generado_en": ahora.isoformat(), "fecha_corte": hoy.isoformat(),
        "periodo": {"desde": desde.isoformat(), "hasta": hasta.isoformat(), "dia_parcial": hasta == hoy},
        "primera_orden": primera_fecha.isoformat() if primera_fecha else None,
        "indicadores": actual,
        "comparacion": {
            "desde": anterior_desde.isoformat(), "hasta": anterior_hasta.isoformat(),
            "disponible": bool(primera_fecha and primera_fecha <= anterior_desde and hasta < hoy),
            "indicadores": anterior,
        },
        "serie_diaria": serie, "por_linea": await desglose(Orden.unidad_negocio),
        "por_canal": await desglose(Orden.canal_ingreso),
        "cobros_por_metodo": [{"metodo": str(k), "monto": _monto(v)} for k, v in metodos],
        "cobranza": {
            "saldo_actual": _monto(saldo), "entregado_autorizado_con_deuda": _monto(autorizada),
            "por_linea": [{"clave": str(k), "ordenes": n, "saldo": _monto(s)} for k, n, s in deuda_lineas],
            "clientes": [{"id": i, "nombre": n, "ordenes": c, "saldo": _monto(s)} for i, n, c, s in deuda_clientes],
            "vencida_por_entrega": {str(k): _monto(s) for k, s in deuda_vencida},
        },
        "operacion": {
            "ordenes": operacion[0], "fecha_vencida": int(operacion[1]),
            "listas_pagadas": int(operacion[2]), "listas_con_deuda": int(operacion[3]),
            "sin_asignar": int(operacion[4]), "saldo_finalizadas": _monto(operacion[5]),
            "por_estado": [{"estado": str(k), "ordenes": n} for k, n in estados],
            "para_entregar": await pendientes(lista_pagada),
            "para_cobrar": await pendientes(lista_deuda), "vencidas": await pendientes(vencida),
            "horas_hasta_finalizar": _monto(tiempos[1]) if tiempos[0] else None,
            "finalizadas_con_fecha": tiempos[0],
        },
        "clientes": {
            "total": clientes[0], "recurrentes": int(clientes[1]), "ventas_recurrentes": _monto(clientes[2]),
            "principales": [{"id": i, "nombre": n, "ordenes": c, "ventas": _monto(v)} for i, n, c, v in principales],
        },
        "calidad": {
            "pagos_en_canceladas": _monto(pagos_cancelados),
            "ordenes_descuadradas": total_diferencias, "ids_descuadradas": diferencias,
        },
    }
