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
from app.core.fechas import rango_dia_peru_a_utc
from app.models import (
    CierreCaja,
    EstadoCierre,
    Orden,
    PagoOrden,
    TipoEventoAuditoria,
    UnidadNegocio,
    Usuario,
)

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
            .where(PagoOrden.fecha >= inicio, PagoOrden.fecha < fin)
            .order_by(PagoOrden.fecha)
        )
    ).all()
    return [(pago, orden) for pago, orden in filas]


async def resumen_dia(
    sesion: AsyncSession,
    fecha: date,
    usuario_id: Optional[int] = None,
    unidad_negocio: Optional[UnidadNegocio] = None,
) -> dict:
    """
    Arqueo del día sin congelar nada: totales por método, por unidad y por
    usuario, más el detalle de cada cobro.
    """
    total = _acumulado()
    por_unidad = {unidad.value: _acumulado() for unidad in UnidadNegocio}
    por_usuario: dict[int, dict] = {}
    detalle = []

    for pago, orden in await _pagos_del_dia(sesion, fecha):
        if usuario_id is not None and pago.registrado_por != usuario_id:
            continue
        if unidad_negocio is not None and orden.unidad_negocio != unidad_negocio:
            continue

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

        detalle.append(
            {
                "orden": orden.codigo,
                "orden_id": orden.id,
                "cliente": orden.cliente.nombre if orden.cliente else "",
                "unidad_negocio": orden.unidad_negocio.value,
                "metodo": pago.metodo.value,
                "tipo": pago.tipo.value,
                "monto": float(pago.monto),
                "fecha": pago.fecha.isoformat() if pago.fecha else None,
                "usuario_id": pago.registrado_por,
            }
        )

    return {
        "fecha": fecha.isoformat(),
        "total": total,
        "por_unidad_negocio": por_unidad,
        "por_usuario": sorted(
            por_usuario.values(), key=lambda fila: fila["total"], reverse=True
        ),
        "detalle": detalle,
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
        if pago.registrado_por == usuario.id and orden.unidad_negocio == unidad_negocio:
            _sumar(acumulado, pago)

    cierre = CierreCaja(
        fecha=fecha,
        unidad_negocio=unidad_negocio,
        usuario=usuario,
        monto_efectivo=acumulado["efectivo"],
        monto_yape=acumulado["yape"],
        monto_transferencia=acumulado["transferencia"],
        total=acumulado["total"],
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
        detalle=f"Cierre {fecha} {unidad_negocio.value}: S/ {acumulado['total']}",
        valores_nuevos={"total": acumulado["total"], "unidad": unidad_negocio.value},
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
