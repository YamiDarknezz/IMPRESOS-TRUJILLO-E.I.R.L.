"""Cierre y arqueo diario de caja dual (RF-12 a RF-14).

El arqueo se arma con los eventos de pago reales: cada usuario liquida lo que
cobró en el día, por unidad de negocio y por método (efectivo, Yape,
transferencia). La Gerencia valida y congela el cierre del día.
"""
from datetime import date
from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auditoria import registrar
from app.core.errores import Conflicto, ErrorDeNegocio, NoEncontrado
from app.core.fechas import a_fecha_peru, ahora_utc, rango_dia_peru_a_utc
from app.models import (
    CierreCaja,
    EstadoCierre,
    EstadoOrden,
    EstadoPago,
    GastoCaja,
    MotivoObservacionPago,
    Orden,
    PagoOrden,
    TipoEventoAuditoria,
    UnidadNegocio,
    Usuario,
)
# Caja y Finanzas no deben poder divergir sobre qué es una orden "cerrada" y
# cómo se recalcula su saldo: se reutiliza la misma fuente de verdad que usa
# confirmar_pago (bloqueo de fila incluido), en vez de reimplementarla aquí.
from app.schemas.caja import GastoCajaData
from app.services.ordenes_service import _obtener_para_escritura, _recalcular_finanzas

METODOS = ("efectivo", "yape", "transferencia")


def _acumulado() -> dict:
    return {"efectivo": 0.0, "yape": 0.0, "transferencia": 0.0, "total": 0.0}


def _sumar(acumulado: dict, pago: PagoOrden) -> None:
    monto = float(pago.monto)
    acumulado[pago.metodo.value] = round(acumulado.get(pago.metodo.value, 0.0) + monto, 2)
    acumulado["total"] = round(acumulado["total"] + monto, 2)


async def _pagos_del_dia(sesion: AsyncSession, fecha: date) -> list[tuple[PagoOrden, Orden]]:
    """Pagos registrados en un día peruano, con su orden para saber la unidad."""
    inicio, fin = rango_dia_peru_a_utc(fecha)
    filas = (
        await sesion.execute(
            select(PagoOrden, Orden)
            .join(Orden, PagoOrden.orden_id == Orden.id)
            # Finanzas ya excluye las órdenes canceladas (issue #18): sin
            # este filtro los dos reportes del mismo día no cuadran, y Caja
            # sigue mostrando como efectivo del día un cobro cuya orden ya
            # no existe para el negocio.
            .where(
                PagoOrden.fecha >= inicio,
                PagoOrden.fecha < fin,
                Orden.estado != EstadoOrden.CANCELADA,
            )
            .order_by(PagoOrden.fecha)
        )
    ).all()
    return [(pago, orden) for pago, orden in filas]


async def _gastos_del_dia(
    sesion: AsyncSession,
    fecha: date,
    usuario_id: Optional[int] = None,
    unidad_negocio: Optional[UnidadNegocio] = None,
) -> list[GastoCaja]:
    consulta = select(GastoCaja).where(GastoCaja.fecha == fecha).order_by(GastoCaja.id)
    if usuario_id is not None:
        consulta = consulta.where(GastoCaja.registrado_por == usuario_id)
    if unidad_negocio is not None:
        consulta = consulta.where(GastoCaja.unidad_negocio == unidad_negocio)
    return list((await sesion.execute(consulta)).scalars())


def serializar_gasto(gasto: GastoCaja) -> dict:
    return {
        "id": gasto.id,
        "fecha": gasto.fecha.isoformat(),
        "unidad_negocio": gasto.unidad_negocio.value,
        "monto": round(float(gasto.monto), 2),
        "motivo": gasto.motivo,
        "usuario_id": gasto.registrado_por,
        "usuario_nombre": gasto.usuario.nombre if gasto.usuario else "Sin registrar",
    }


async def resumen_dia(
    sesion: AsyncSession,
    fecha: date,
    usuario_id: Optional[int] = None,
    unidad_negocio: Optional[UnidadNegocio] = None,
) -> dict:
    """
    Arqueo del día sin congelar nada: totales por método, por unidad y por
    usuario, más el detalle de cada cobro y pagos observados.
    """
    total = _acumulado()
    total_observado = 0.0
    por_unidad = {unidad.value: _acumulado() for unidad in UnidadNegocio}
    por_usuario: dict[int, dict] = {}
    detalle = []
    observados = []

    for pago, orden in await _pagos_del_dia(sesion, fecha):
        if usuario_id is not None and pago.registrado_por != usuario_id:
            continue
        if unidad_negocio is not None and orden.unidad_negocio != unidad_negocio:
            continue

        monto = float(pago.monto)

        if pago.es_conforme:
            _sumar(total, pago)
            _sumar(por_unidad[orden.unidad_negocio.value], pago)

            clave = pago.registrado_por or 0
            registro = por_usuario.setdefault(
                clave,
                {
                    "usuario_id": pago.registrado_por,
                    "nombre": pago.usuario.nombre if pago.usuario else "Sin registrar",
                    **_acumulado(),
                },
            )
            _sumar(registro, pago)
        else:
            total_observado = round(total_observado + monto, 2)
            observados.append(
                {
                    "pago_id": pago.id,
                    "orden": orden.codigo,
                    "orden_id": orden.id,
                    "cliente": orden.cliente.nombre if orden.cliente else "",
                    "unidad_negocio": orden.unidad_negocio.value,
                    "metodo": pago.metodo.value,
                    "monto": monto,
                    "estado_pago": pago.estado_pago.value if pago.estado_pago else "observado",
                    "motivo": pago.motivo_observacion.value if pago.motivo_observacion else "otro",
                    "nota": pago.nota_observacion or "",
                    "observado_por": pago.observador.nombre if pago.observador else None,
                    "observado_en": pago.observado_en.isoformat() if pago.observado_en else None,
                }
            )

        detalle.append(
            {
                "pago_id": pago.id,
                "orden": orden.codigo,
                "orden_id": orden.id,
                "cliente": orden.cliente.nombre if orden.cliente else "",
                "unidad_negocio": orden.unidad_negocio.value,
                "metodo": pago.metodo.value,
                "tipo": pago.tipo.value,
                "monto": monto,
                "fecha": pago.fecha.isoformat() if pago.fecha else None,
                "usuario_id": pago.registrado_por,
                "usuario_nombre": pago.usuario.nombre if pago.usuario else "Sin registrar",
                "estado_pago": pago.estado_pago.value if pago.estado_pago else "conforme",
                "motivo_observacion": pago.motivo_observacion.value if pago.motivo_observacion else None,
                "nota_observacion": pago.nota_observacion or "",
                "observado_por": pago.observador.nombre if pago.observador else None,
                "observado_en": pago.observado_en.isoformat() if pago.observado_en else None,
            }
        )

    # ── Gastos (#112): lo que salió de la caja y el neto que debería quedar ──
    gastos = await _gastos_del_dia(sesion, fecha, usuario_id, unidad_negocio)
    total_gastos = 0.0
    for unidad_clave, acumulado in por_unidad.items():
        acumulado["gastos"] = 0.0
    for fila in por_usuario.values():
        fila["gastos"] = 0.0
    for gasto in gastos:
        monto_gasto = float(gasto.monto)
        total_gastos = round(total_gastos + monto_gasto, 2)
        por_unidad[gasto.unidad_negocio.value]["gastos"] = round(
            por_unidad[gasto.unidad_negocio.value]["gastos"] + monto_gasto, 2
        )
        # Un gasto de alguien que no cobró nada ese día también debe verse.
        fila = por_usuario.setdefault(
            gasto.registrado_por,
            {
                "usuario_id": gasto.registrado_por,
                "nombre": gasto.usuario.nombre if gasto.usuario else "Sin registrar",
                **_acumulado(),
                "gastos": 0.0,
            },
        )
        fila["gastos"] = round(fila["gastos"] + monto_gasto, 2)
    for acumulado in (*por_unidad.values(), *por_usuario.values()):
        acumulado["neto"] = round(acumulado["total"] - acumulado["gastos"], 2)

    return {
        "fecha": fecha.isoformat(),
        "total": total,
        "total_observado": total_observado,
        "total_gastos": total_gastos,
        # Lo cobrado menos lo gastado; el efectivo es lo único que sale de la caja física.
        "neto": round(total["total"] - total_gastos, 2),
        "efectivo_neto": round(total["efectivo"] - total_gastos, 2),
        "por_unidad_negocio": por_unidad,
        "por_usuario": sorted(
            por_usuario.values(), key=lambda fila: fila["total"], reverse=True
        ),
        "detalle": detalle,
        "observados": observados,
        "gastos": [serializar_gasto(gasto) for gasto in gastos],
    }


async def _cierre_del_usuario(
    sesion: AsyncSession, fecha: date, unidad_negocio: UnidadNegocio, usuario_id: int
) -> Optional[CierreCaja]:
    return (
        await sesion.execute(
            select(CierreCaja).where(
                CierreCaja.fecha == fecha,
                CierreCaja.unidad_negocio == unidad_negocio,
                CierreCaja.usuario_id == usuario_id,
            )
        )
    ).scalar_one_or_none()


async def registrar_gasto(sesion: AsyncSession, data: GastoCajaData, usuario: Usuario) -> GastoCaja:
    """
    Anota un gasto que salió de la caja (#112).

    No se admite en un día cuya caja esa persona ya cerró: el cierre guarda el
    monto de gastos de ese momento y cambiarlo después lo dejaría desfasado
    (el mismo cuidado que el adelanto con el cierre congelado, issue #19).
    """
    hoy = a_fecha_peru(ahora_utc())
    fecha = data.fecha or hoy
    if fecha > hoy:
        raise ErrorDeNegocio("No se puede registrar un gasto con fecha futura.")
    if await _cierre_del_usuario(sesion, fecha, data.unidad_negocio, usuario.id) is not None:
        raise ErrorDeNegocio(
            "Ya cerraste tu caja de esa fecha y unidad: el gasto ya no se puede agregar."
        )

    gasto = GastoCaja(
        fecha=fecha,
        unidad_negocio=data.unidad_negocio,
        monto=round(data.monto, 2),
        motivo=data.motivo,
        usuario=usuario,
    )
    sesion.add(gasto)
    await sesion.flush()

    registrar(
        sesion,
        usuario.id,
        TipoEventoAuditoria.CREAR,
        tabla_afectada="gastos_caja",
        registro_id=gasto.id,
        detalle=f"Gasto de caja {fecha} {data.unidad_negocio.value}: S/ {gasto.monto} ({data.motivo})",
        valores_nuevos={"monto": float(gasto.monto), "motivo": data.motivo},
    )
    return gasto


async def eliminar_gasto(sesion: AsyncSession, gasto_id: int, usuario: Usuario) -> dict:
    """Corrige un gasto mal anotado (solo supervisión); queda en la auditoría."""
    gasto = await sesion.get(GastoCaja, gasto_id)
    if gasto is None:
        raise NoEncontrado("Gasto no encontrado.")
    if await _cierre_del_usuario(
        sesion, gasto.fecha, gasto.unidad_negocio, gasto.registrado_por
    ) is not None:
        raise ErrorDeNegocio(
            "No se puede quitar un gasto de una caja que ya se cerró."
        )

    resultado = serializar_gasto(gasto)
    registrar(
        sesion,
        usuario.id,
        TipoEventoAuditoria.ELIMINAR,
        tabla_afectada="gastos_caja",
        registro_id=gasto.id,
        detalle=(
            f"Gasto de caja eliminado ({gasto.fecha} {gasto.unidad_negocio.value}): "
            f"S/ {gasto.monto} ({gasto.motivo}), anotado por "
            f"{gasto.usuario.nombre if gasto.usuario else 'usuario desconocido'}"
        ),
        valores_anteriores={"monto": float(gasto.monto), "motivo": gasto.motivo},
    )
    await sesion.delete(gasto)
    await sesion.flush()
    return resultado


async def observar_pago(
    sesion: AsyncSession,
    pago_id: int,
    motivo: MotivoObservacionPago,
    nota: str,
    usuario: Usuario,
) -> dict:
    """
    Audita y observa/anula un cobro erróneo o fraudulento (p. ej. Yape falso, billete falso).
    Recalcula el saldo desde el historial de pagos conformes, la misma fuente
    de verdad que usa `confirmar_pago` (issue #20): nada de sumas manuales.
    """
    pago = await sesion.get(PagoOrden, pago_id)
    if pago is None:
        raise NoEncontrado("Pago no encontrado.")

    if pago.estado_pago and pago.estado_pago != EstadoPago.CONFORME:
        raise ErrorDeNegocio(f"Este pago ya se encuentra en estado '{pago.estado_pago.value}'.")

    # Bloquea la fila de la orden (igual que confirmar_pago): dos operaciones
    # financieras sobre la misma orden no deben poder pisarse entre sí.
    orden = await _obtener_para_escritura(sesion, pago.orden_id)

    if orden.estado == EstadoOrden.ENTREGADA:
        # El resto del sistema trata la entrega como definitiva (no admite
        # más cambios de estado); reabrir su deuda sería la única excepción.
        raise ErrorDeNegocio(
            "No se puede observar un pago de una orden ya entregada: "
            "la entrega es definitiva."
        )

    # El cierre congelado es el documento de control de gerencia: si el pago
    # ya quedó dentro de uno, no se toca más (issue #19 trata el resto de ese
    # problema; aquí solo se cierra esta puerta puntual).
    cierre_del_dia = (
        await sesion.execute(
            select(CierreCaja).where(
                CierreCaja.fecha == a_fecha_peru(pago.fecha),
                CierreCaja.unidad_negocio == orden.unidad_negocio,
                CierreCaja.usuario_id == pago.registrado_por,
            )
        )
    ).scalar_one_or_none()
    if cierre_del_dia is not None and cierre_del_dia.estado == EstadoCierre.CONGELADO:
        raise ErrorDeNegocio(
            "No se puede observar un pago de un cierre de caja ya congelado."
        )

    cajero = await sesion.get(Usuario, pago.registrado_por) if pago.registrado_por else None

    pago.estado_pago = EstadoPago.OBSERVADO
    pago.motivo_observacion = motivo
    pago.nota_observacion = nota
    pago.observado_por = usuario.id
    pago.observado_en = ahora_utc()

    # Recalcula saldo, adelanto y pagado_totalmente desde el historial
    # conforme: no una suma manual que ya se había desincronizado antes.
    _recalcular_finanzas(orden)

    registrar(
        sesion,
        usuario.id,
        TipoEventoAuditoria.OBSERVACION_PAGO,
        tabla_afectada="pagos_orden",
        registro_id=pago.id,
        detalle=(
            f"Pago #{pago.id} de {orden.codigo}, cobrado por "
            f"{cajero.nombre if cajero else 'usuario desconocido'}, "
            f"observado por {motivo.value}: S/ {pago.monto}. {nota}"
        ),
        valores_anteriores={"estado_pago": "conforme"},
        valores_nuevos={
            "estado_pago": pago.estado_pago.value,
            "motivo": motivo.value,
            "nota": nota,
            "orden_id": orden.id,
            "registrado_por": pago.registrado_por,
            "nuevo_saldo_pendiente": float(orden.saldo_pendiente),
        },
    )
    await sesion.flush()

    return {
        "pago_id": pago.id,
        "orden_id": orden.id,
        "orden_codigo": orden.codigo,
        "monto": float(pago.monto),
        "estado_pago": pago.estado_pago.value,
        "motivo": motivo.value,
        "nota": nota,
        "nuevo_saldo_pendiente": float(orden.saldo_pendiente),
        "observado_por": usuario.nombre,
        "observado_en": pago.observado_en.isoformat(),
    }


async def cerrar_caja(
    sesion: AsyncSession,
    fecha: date,
    unidad_negocio: UnidadNegocio,
    observacion: str,
    usuario: Usuario,
) -> CierreCaja:
    """Registra el arqueo del usuario para una fecha y unidad de negocio."""
    existente = (
        await sesion.execute(
            select(CierreCaja).where(
                CierreCaja.fecha == fecha,
                CierreCaja.unidad_negocio == unidad_negocio,
                CierreCaja.usuario_id == usuario.id,
            )
        )
    ).scalar_one_or_none()
    if existente is not None:
        raise Conflicto(
            "Ya registraste un cierre para esa fecha y unidad de negocio."
        )

    acumulado = _acumulado()
    for pago, orden in await _pagos_del_dia(sesion, fecha):
        if (
            pago.registrado_por == usuario.id
            and orden.unidad_negocio == unidad_negocio
            and (pago.estado_pago is None or pago.estado_pago == EstadoPago.CONFORME)
        ):
            _sumar(acumulado, pago)

    gastos_del_usuario = round(
        sum(
            float(g.monto)
            for g in await _gastos_del_dia(sesion, fecha, usuario.id, unidad_negocio)
        ),
        2,
    )

    cierre = CierreCaja(
        fecha=fecha,
        unidad_negocio=unidad_negocio,
        usuario=usuario,
        monto_efectivo=acumulado["efectivo"],
        monto_yape=acumulado["yape"],
        monto_transferencia=acumulado["transferencia"],
        total=acumulado["total"],
        monto_gastos=gastos_del_usuario,
        estado=EstadoCierre.CERRADO,
        observacion=observacion,
    )
    sesion.add(cierre)
    await sesion.flush()

    registrar(
        sesion,
        usuario.id,
        TipoEventoAuditoria.CIERRE_CAJA,
        tabla_afectada="cierres_caja",
        registro_id=cierre.id,
        detalle=(
            f"Cierre {fecha} {unidad_negocio.value}: S/ {acumulado['total']} cobrado, "
            f"S/ {gastos_del_usuario} en gastos"
        ),
        valores_nuevos={
            "total": acumulado["total"],
            "gastos": gastos_del_usuario,
            "unidad": unidad_negocio.value,
        },
    )
    return cierre


async def congelar_caja(
    sesion: AsyncSession, cierre_id: int, observacion: str, usuario: Usuario
) -> CierreCaja:
    """La Gerencia valida el arqueo y congela el cierre del día."""
    cierre = await sesion.get(CierreCaja, cierre_id)
    if cierre is None:
        raise NoEncontrado("Cierre de caja no encontrado.")
    if cierre.estado == EstadoCierre.CONGELADO:
        raise ErrorDeNegocio("Este cierre ya está congelado.")

    cierre.estado = EstadoCierre.CONGELADO
    # Se asigna la relación (no solo el id) para que la respuesta pueda
    # mostrar el nombre de quien validó sin provocar una carga perezosa.
    cierre.validador = usuario
    if observacion:
        cierre.observacion = (cierre.observacion + " | " if cierre.observacion else "") + observacion

    registrar(
        sesion,
        usuario.id,
        TipoEventoAuditoria.CIERRE_CAJA,
        tabla_afectada="cierres_caja",
        registro_id=cierre.id,
        detalle=f"Cierre congelado: {cierre.fecha} {cierre.unidad_negocio.value}",
        valores_nuevos={"estado": cierre.estado.value},
    )
    await sesion.flush()
    return cierre


async def listar_cierres(
    sesion: AsyncSession,
    fecha: Optional[date] = None,
    unidad_negocio: Optional[UnidadNegocio] = None,
) -> list[CierreCaja]:
    consulta = select(CierreCaja).order_by(CierreCaja.fecha.desc(), CierreCaja.id.desc())
    if fecha is not None:
        consulta = consulta.where(CierreCaja.fecha == fecha)
    if unidad_negocio is not None:
        consulta = consulta.where(CierreCaja.unidad_negocio == unidad_negocio)
    return list((await sesion.execute(consulta)).scalars())
