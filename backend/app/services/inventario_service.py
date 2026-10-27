"""Ajuste de stock dentro de una transacción.

Toda operación que mueve inventario (crear, editar, cancelar y completar una
orden, o un ajuste manual) pasa por aquí. El patrón es siempre el mismo: se
leen y validan TODOS los materiales antes de escribir, y cada movimiento queda
registrado en `movimientos_stock` con su motivo.

Intercalar lecturas y escrituras en un bucle falla con dos o más materiales:
por eso las fases de este módulo están separadas y el código vive en un solo
lugar en vez de repetirse en cada operación.
"""
from dataclasses import dataclass
from decimal import Decimal
from typing import Iterable, Optional

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auditoria import registrar
from app.core.errores import Conflicto, ErrorDeNegocio, NoEncontrado, PermisoDenegado
from app.core.fechas import ahora_utc
from app.models import (
    ConsumoPieza,
    EstadoOrden,
    EstadoPieza,
    Material,
    MetodoPago,
    MotivoMovimiento,
    MovimientoStock,
    Orden,
    PiezaLoteMaterial,
    Rol,
    TipoEventoAuditoria,
    Usuario,
)
from app.schemas.inventario import ConsumoPiezaCreateData, PiezaLoteCreateData
from app.schemas.orden import VentaRapidaData


@dataclass(frozen=True)
class AjusteStock:
    """
    Un cambio pendiente sobre el stock de un material.

    `delta` negativo descuenta del inventario (se consume material) y positivo
    lo devuelve (se cancela una orden o sobró material).
    """

    material_id: int
    delta: float
    nombre: str = ""
    motivo: MotivoMovimiento = MotivoMovimiento.RESERVA
    nota: str = ""


def _decimal(valor: float | Decimal) -> Decimal:
    return Decimal(str(valor))


def _redondear(valor: Decimal) -> Decimal:
    return valor.quantize(Decimal("0.01"))


async def aplicar_ajustes(
    sesion: AsyncSession,
    ajustes: Iterable[AjusteStock],
    *,
    orden_id: Optional[int] = None,
    usuario_id: Optional[int] = None,
    exigir_material: bool = True,
) -> list[MovimientoStock]:
    """
    Aplica los ajustes de stock y registra cada movimiento.

    `exigir_material=True` falla si el material ya no existe en el inventario;
    con False se ignora en silencio (al devolver stock de una orden vieja no
    tiene sentido bloquear por un material que se borró del catálogo).

    Lanza ErrorDeNegocio si el stock no alcanza, sin haber escrito nada.
    """
    pendientes = [ajuste for ajuste in ajustes if ajuste.delta != 0]
    if not pendientes:
        return []

    # Se bloquean las filas para que dos órdenes simultáneas no reserven el
    # mismo material por encima de lo disponible. `of=Material` limita el
    # bloqueo a esta tabla (PostgreSQL rechaza FOR UPDATE con joins externos).
    ids = {ajuste.material_id for ajuste in pendientes}
    filas = (
        await sesion.execute(
            select(Material).where(Material.id.in_(ids)).with_for_update(of=Material)
        )
    ).scalars()
    materiales = {material.id: material for material in filas}

    # ── Fase 1: simular y validar todo ──────────────────────────────────────
    simulado: dict[int, Decimal] = {}
    for ajuste in pendientes:
        material = materiales.get(ajuste.material_id)
        if material is None:
            if exigir_material and ajuste.delta < 0:
                raise ErrorDeNegocio(
                    f"Material '{ajuste.nombre or ajuste.material_id}' no existe en inventario."
                )
            continue

        disponible = simulado.get(material.id, _decimal(material.stock_actual))
        resultado = disponible + _decimal(ajuste.delta)
        if resultado < 0:
            raise ErrorDeNegocio(
                f"Stock insuficiente para '{material.nombre}' "
                f"(disponible: {_redondear(disponible)}, requerido: {abs(_decimal(ajuste.delta))})."
            )
        simulado[material.id] = resultado

    # ── Fase 2: recién ahora se escribe ─────────────────────────────────────
    movimientos: list[MovimientoStock] = []
    for ajuste in pendientes:
        material = materiales.get(ajuste.material_id)
        if material is None:
            continue

        material.stock_actual = _redondear(_decimal(material.stock_actual) + _decimal(ajuste.delta))
        movimiento = MovimientoStock(
            material_id=material.id,
            orden_id=orden_id,
            usuario_id=usuario_id,
            delta=_redondear(_decimal(ajuste.delta)),
            stock_resultante=material.stock_actual,
            motivo=ajuste.motivo,
            nota=ajuste.nota,
        )
        sesion.add(movimiento)
        movimientos.append(movimiento)

    await sesion.flush()
    return movimientos


def calcular_delta_reserva(
    estimados_anteriores: dict[int, float],
    estimados_nuevos: dict[int, float],
) -> list[AjusteStock]:
    """
    Diferencia entre dos estimaciones: lo que sobra se devuelve y lo que falta
    se reserva, sin tocar lo que no cambió.
    """
    ajustes = []
    for material_id in set(estimados_anteriores) | set(estimados_nuevos):
        antes = estimados_anteriores.get(material_id, 0)
        ahora = estimados_nuevos.get(material_id, 0)
        if antes == ahora:
            continue
        delta = antes - ahora  # >0 devuelve, <0 reserva más
        ajustes.append(
            AjusteStock(
                material_id=material_id,
                delta=delta,
                motivo=(
                    MotivoMovimiento.LIBERACION if delta > 0 else MotivoMovimiento.RESERVA
                ),
            )
        )
    return ajustes


# ══ Gestión de Rollos y Planchas Pre-dimensionadas ════════════════════════

async def registrar_pieza(
    sesion: AsyncSession,
    data: PiezaLoteCreateData,
    usuario: Usuario,
) -> PiezaLoteMaterial:
    """Registra un nuevo rollo continuo o plancha rígida pre-dimensionada."""
    material = await sesion.get(Material, data.material_id)
    if material is None:
        raise NoEncontrado("Material no encontrado.")

    existente = (
        await sesion.execute(
            select(PiezaLoteMaterial).where(
                PiezaLoteMaterial.codigo_identificador == data.codigo_identificador.strip()
            )
        )
    ).scalar_one_or_none()
    if existente is not None:
        raise Conflicto(f"Ya existe una pieza o rollo con el código '{data.codigo_identificador}'.")

    ahora = ahora_utc()
    capacidad = _redondear(_decimal(data.capacidad_inicial))
    pieza = PiezaLoteMaterial(
        material_id=data.material_id,
        codigo_identificador=data.codigo_identificador.strip(),
        ancho_m=_decimal(data.ancho_m) if data.ancho_m is not None else material.ancho_predeterminado_m,
        largo_m=_decimal(data.largo_m) if data.largo_m is not None else material.largo_predeterminado_m,
        espesor_mm=_decimal(data.espesor_mm) if data.espesor_mm is not None else material.espesor_mm,
        capacidad_inicial=capacidad,
        saldo_restante=capacidad,
        unidad_medida=data.unidad_medida,
        costo_adquisicion=_redondear(_decimal(data.costo_adquisicion)),
        estado=EstadoPieza.DISPONIBLE,
        ubicacion=data.ubicacion or material.ubicacion_estante,
        maquina_asignada=data.maquina_asignada,
        fecha_ingreso=ahora,
        nota=data.nota,
        consumos=[],
    )
    sesion.add(pieza)
    try:
        await sesion.flush()
    except IntegrityError as error:
        # El SELECT de arriba no cierra la carrera entre dos peticiones
        # concurrentes; el UNIQUE de la base sí. Si dos llegan a la vez, una
        # gana el INSERT y la otra cae aquí en vez de romperse con un 500.
        await sesion.rollback()
        raise Conflicto(f"Ya existe una pieza o rollo con el código '{data.codigo_identificador}'.") from error

    # El rollo/plancha es un desglose del material, no un inventario aparte:
    # su capacidad entra al stock del material para que ambos números cuadren.
    await aplicar_ajustes(
        sesion,
        [
            AjusteStock(
                material_id=material.id,
                delta=float(capacidad),
                nombre=material.nombre,
                motivo=MotivoMovimiento.AJUSTE_MANUAL,
                nota=f"Alta de rollo/plancha {pieza.codigo_identificador}",
            )
        ],
        usuario_id=usuario.id,
    )

    registrar(
        sesion,
        usuario.id,
        TipoEventoAuditoria.CREAR,
        tabla_afectada="piezas_lote_material",
        registro_id=pieza.codigo_identificador,
        detalle=(
            f"Rollo/plancha {pieza.codigo_identificador} de material {material.nombre}, "
            f"capacidad {capacidad} {data.unidad_medida}"
        ),
        valores_nuevos={"capacidad_inicial": float(capacidad)},
    )

    # `PiezaLoteMaterial.material` es una relación lazy: al crear la pieza con
    # solo `material_id` queda sin cargar, y `serializar_pieza()` la lee para
    # armar la respuesta del POST. Sin esta carga explícita ese acceso es un
    # SELECT implícito (IO en contexto async) y la petición muere con
    # MissingGreenlet (500) en vez de dar de alta el rollo.
    await sesion.refresh(pieza, ["material"])
    return pieza


async def listar_piezas(
    sesion: AsyncSession,
    material_id: Optional[int] = None,
    estado: Optional[EstadoPieza] = None,
) -> list[PiezaLoteMaterial]:
    """Lista las piezas/rollos filtrados opcionalmente por material o estado."""
    consulta = (
        select(PiezaLoteMaterial)
        .order_by(PiezaLoteMaterial.fecha_ingreso.desc(), PiezaLoteMaterial.id.desc())
    )
    if material_id is not None:
        consulta = consulta.where(PiezaLoteMaterial.material_id == material_id)
    if estado is not None:
        consulta = consulta.where(PiezaLoteMaterial.estado == estado)
    return list((await sesion.execute(consulta)).scalars())


async def obtener_pieza(sesion: AsyncSession, pieza_id: int) -> PiezaLoteMaterial:
    """Devuelve la pieza o rollo con su historial completo de consumos y cortes."""
    pieza = await sesion.get(PiezaLoteMaterial, pieza_id)
    if pieza is None:
        raise NoEncontrado("Pieza o rollo no encontrado.")
    return pieza


async def _cobrar_corte(
    sesion: AsyncSession,
    pieza: PiezaLoteMaterial,
    orden: Optional[Orden],
    data: ConsumoPiezaCreateData,
    monto: Decimal,
    usuario: Usuario,
) -> Orden:
    """
    Registra el cobro de un corte como dinero real (#57).

    Con orden asociada se registra como pago de esa orden (baja su saldo); sin
    orden, como venta rápida de mostrador. En ambos casos el monto entra UNA
    sola vez a Caja y Finanzas, en vez de quedar solo como "Recaudado".
    """
    if usuario.rol not in (Rol.ADMIN, Rol.SUBGERENTE, Rol.SECRETARIA, Rol.OPERARIO):
        raise PermisoDenegado(
            "Solo el personal de venta o mostrador puede registrar un cobro en un corte."
        )

    # Import local: `ordenes_service` importa este módulo; arriba sería circular.
    from app.services import ordenes_service

    if orden is not None:
        await ordenes_service.confirmar_pago(
            sesion,
            orden.id,
            data.metodo_pago,
            data.referencia,
            usuario,
            monto=float(monto),
            descripcion=f"Corte de {pieza.codigo_identificador}: {data.trabajo_descripcion}"[:200],
        )
        return orden

    return await ordenes_service.crear_venta_rapida(
        sesion,
        VentaRapidaData(
            descripcion=data.trabajo_descripcion,
            monto_total=float(monto),
            metodo_pago=data.metodo_pago or MetodoPago.EFECTIVO,
            referencia=data.referencia,
        ),
        usuario,
    )


async def registrar_consumo_pieza(
    sesion: AsyncSession,
    pieza_id: int,
    data: ConsumoPiezaCreateData,
    usuario: Usuario,
) -> ConsumoPieza:
    """
    Registra un corte o uso de rollo/plancha (como en CONTROL ROLLOS A+B).
    Deduce el saldo restante y recalcula el estado y la ganancia.
    """
    pieza = (
        await sesion.execute(
            select(PiezaLoteMaterial)
            .where(PiezaLoteMaterial.id == pieza_id)
            .with_for_update(of=PiezaLoteMaterial)
        )
    ).scalar_one_or_none()
    if pieza is None:
        raise NoEncontrado("Pieza o rollo no encontrado.")

    if pieza.estado == EstadoPieza.AGOTADO:
        raise ErrorDeNegocio("Esta pieza o rollo ya se encuentra agotado.")

    # El vínculo con el pedido (#71) se valida: un id que no existe reventaba
    # contra la llave foránea y un pedido cancelado no consume material.
    orden = None
    if data.orden_id is not None:
        orden = await sesion.get(Orden, data.orden_id)
        if orden is None:
            raise ErrorDeNegocio("La orden indicada no existe.")
        if orden.estado == EstadoOrden.CANCELADA:
            raise ErrorDeNegocio(
                f"La orden {orden.codigo} está cancelada: no se le puede asignar un corte."
            )

    cantidad = _redondear(_decimal(data.cantidad_consumida))
    if cantidad > _decimal(pieza.saldo_restante):
        raise ErrorDeNegocio(
            f"El consumo solicitado ({cantidad} {pieza.unidad_medida}) supera el saldo disponible "
            f"({pieza.saldo_restante} {pieza.unidad_medida})."
        )

    # Un corte cobrado es dinero real: se registra antes de mover el saldo para
    # que un rechazo (orden ya pagada, monto mayor al saldo, sin permiso) no
    # deje el inventario descontado sin su cobro.
    monto_cobrado = _redondear(_decimal(data.monto_cobrado))
    if monto_cobrado > 0:
        orden = await _cobrar_corte(sesion, pieza, orden, data, monto_cobrado, usuario)

    saldo_anterior = _decimal(pieza.saldo_restante)
    saldo_nuevo = _redondear(saldo_anterior - cantidad)
    pieza.saldo_restante = saldo_nuevo

    ahora = ahora_utc()
    if saldo_nuevo == Decimal("0.00"):
        pieza.estado = EstadoPieza.AGOTADO
        pieza.fecha_termino = ahora
    else:
        pieza.estado = EstadoPieza.EN_USO

    consumo = ConsumoPieza(
        pieza=pieza,
        # Se asigna la relación (no solo el id): serializar el corte nuevo lee
        # `consumo.orden`, y una carga perezosa en async revienta.
        orden=orden,
        usuario_id=usuario.id,
        trabajo_descripcion=data.trabajo_descripcion,
        cantidad_consumida=cantidad,
        saldo_anterior=saldo_anterior,
        saldo_nuevo=saldo_nuevo,
        monto_cobrado=monto_cobrado,
        merma_desperdicio=_redondear(_decimal(data.merma_desperdicio)),
        fecha=ahora,
        nota=data.nota,
    )
    if consumo not in pieza.consumos:
        pieza.consumos.append(consumo)
    sesion.add(consumo)
    try:
        await sesion.flush()
    except IntegrityError as error:
        # El `SELECT ... FOR UPDATE` de arriba serializa los consumos de esta
        # misma pieza; el CHECK de la base queda como respaldo final ante
        # cualquier otra vía de escritura. Si de todos modos revienta, se
        # traduce al mismo error de negocio en vez de un 500 crudo.
        await sesion.rollback()
        raise ErrorDeNegocio(
            "No se pudo registrar el consumo: el saldo de la pieza cambió por una "
            "operación concurrente. Vuelve a intentarlo."
        ) from error

    # El corte también descuenta del material: la pieza es su desglose, no un
    # inventario aparte (issue #56).
    await aplicar_ajustes(
        sesion,
        [
            AjusteStock(
                material_id=pieza.material_id,
                delta=float(-cantidad),
                nombre=pieza.material.nombre if pieza.material else "",
                motivo=MotivoMovimiento.MERMA,
                nota=f"Corte de {pieza.codigo_identificador}: {data.trabajo_descripcion}",
            )
        ],
        usuario_id=usuario.id,
    )

    registrar(
        sesion,
        usuario.id,
        TipoEventoAuditoria.CREAR,
        tabla_afectada="consumos_pieza",
        registro_id=pieza.codigo_identificador,
        detalle=f"Consumo de {cantidad} {pieza.unidad_medida} en {pieza.codigo_identificador}: {data.trabajo_descripcion}",
        valores_anteriores={"saldo_restante": float(saldo_anterior)},
        valores_nuevos={"saldo_restante": float(saldo_nuevo)},
    )
    return consumo


# ══ Cortes que descuenta la orden sola (#127) ══════════════════════════════
#
# Crear una orden con un material de rollo ya RESERVA ese material
# (`Material.stock_actual`). Descontar también el rollo no debe volver a restar
# el material: por eso estas funciones mueven solo `PiezaLoteMaterial` y
# `ConsumoPieza`, y nunca llaman a `aplicar_ajustes`.

async def _bloquear_piezas(sesion: AsyncSession, ids: Iterable[int]) -> dict[int, PiezaLoteMaterial]:
    """Las piezas, con su fila bloqueada y en orden de id (dos órdenes a la vez no se cruzan)."""
    ids = sorted(set(ids))
    if not ids:
        return {}
    filas = (
        await sesion.execute(
            select(PiezaLoteMaterial)
            .where(PiezaLoteMaterial.id.in_(ids))
            .order_by(PiezaLoteMaterial.id)
            .with_for_update(of=PiezaLoteMaterial)
        )
    ).scalars()
    return {pieza.id: pieza for pieza in filas}


def _estado_segun_saldo(pieza: PiezaLoteMaterial) -> None:
    """Deja el estado y la fecha de término del rollo coherentes con su saldo."""
    saldo = _decimal(pieza.saldo_restante)
    if saldo <= 0:
        pieza.estado = EstadoPieza.AGOTADO
        pieza.fecha_termino = pieza.fecha_termino or ahora_utc()
        return
    pieza.fecha_termino = None
    pieza.estado = (
        EstadoPieza.DISPONIBLE if saldo >= _decimal(pieza.capacidad_inicial) else EstadoPieza.EN_USO
    )


async def descontar_cortes_de_orden(
    sesion: AsyncSession, orden: Orden, lineas: Iterable, usuario: Usuario
) -> None:
    """
    Resta del rollo los metros de cada línea que trae `pieza_id` y deja el corte
    registrado, ligado a la orden. Todo o nada: si un rollo no alcanza, la
    petición entera se revierte y la orden no se crea.
    """
    con_pieza = [linea for linea in lineas if getattr(linea, "pieza_id", None) is not None]
    if not con_pieza:
        return

    piezas = await _bloquear_piezas(sesion, (linea.pieza_id for linea in con_pieza))
    # Lo que la propia orden pide de cada rollo (dos líneas no pueden pasarse juntas del saldo).
    pedido: dict[int, Decimal] = {}

    for linea in con_pieza:
        pieza = piezas.get(linea.pieza_id)
        if pieza is None:
            raise NoEncontrado(f"El rollo o plancha {linea.pieza_id} no existe.")
        if pieza.material_id != linea.material_id:
            raise ErrorDeNegocio(
                f"El rollo {pieza.codigo_identificador} no es del material de esa línea."
            )
        if pieza.estado == EstadoPieza.AGOTADO:
            raise ErrorDeNegocio(f"El rollo {pieza.codigo_identificador} ya está agotado.")

        cantidad = _redondear(_decimal(linea.cantidad))
        pedido[pieza.id] = pedido.get(pieza.id, Decimal("0")) + cantidad
        if pedido[pieza.id] > _decimal(pieza.saldo_restante):
            raise ErrorDeNegocio(
                f"El rollo {pieza.codigo_identificador} tiene {pieza.saldo_restante} "
                f"{pieza.unidad_medida} disponibles y la orden pide {pedido[pieza.id]}."
            )

    ahora = ahora_utc()
    for linea in con_pieza:
        pieza = piezas[linea.pieza_id]
        cantidad = _redondear(_decimal(linea.cantidad))
        anterior = _decimal(pieza.saldo_restante)
        pieza.saldo_restante = _redondear(anterior - cantidad)
        _estado_segun_saldo(pieza)

        consumo = ConsumoPieza(
            pieza=pieza,
            # Se asigna la relación (no solo el id): serializar el corte nuevo la lee.
            orden=orden,
            usuario_id=usuario.id,
            trabajo_descripcion=f"{orden.codigo}: {orden.descripcion}"[:250],
            cantidad_consumida=cantidad,
            saldo_anterior=anterior,
            saldo_nuevo=pieza.saldo_restante,
            monto_cobrado=Decimal("0.00"),
            merma_desperdicio=Decimal("0.00"),
            fecha=ahora,
            nota="Descontado al crear la orden",
            automatico=True,
        )
        # `pieza=pieza` ya lo agrega a `pieza.consumos` (back_populates).
        sesion.add(consumo)
    await sesion.flush()


async def _cortes_automaticos(sesion: AsyncSession, orden_id: int) -> list[ConsumoPieza]:
    return list(
        (
            await sesion.execute(
                select(ConsumoPieza).where(
                    ConsumoPieza.orden_id == orden_id, ConsumoPieza.automatico.is_(True)
                )
            )
        ).scalars()
    )


async def devolver_cortes_de_orden(sesion: AsyncSession, orden_id: int) -> None:
    """
    Devuelve a cada rollo lo que la orden le había descontado y borra esos cortes.

    Se usa al cancelar (RN-06, igual que el material) y al editar la orden, que
    vuelve a descontar según lo nuevo. Los cortes manuales no se tocan.
    """
    cortes = await _cortes_automaticos(sesion, orden_id)
    if not cortes:
        return
    piezas = await _bloquear_piezas(sesion, (corte.pieza_id for corte in cortes))
    for corte in cortes:
        pieza = piezas[corte.pieza_id]
        pieza.saldo_restante = min(
            _redondear(_decimal(pieza.saldo_restante) + _decimal(corte.cantidad_consumida)),
            _decimal(pieza.capacidad_inicial),
        )
        pieza.consumos.remove(corte)
        _estado_segun_saldo(pieza)
    await sesion.flush()


async def ajustar_corte_de_orden(
    sesion: AsyncSession, orden_id: int, pieza_id: int, diferencia: Decimal
) -> None:
    """
    Al reportar el uso real (#127): si la orden usó más (`diferencia` > 0) se le
    descuenta más al rollo; si usó menos, se le devuelve. Sin corte automático de
    esa orden en ese rollo no hace nada.
    """
    if diferencia == 0:
        return
    corte = next(
        (c for c in await _cortes_automaticos(sesion, orden_id) if c.pieza_id == pieza_id), None
    )
    if corte is None:
        return
    pieza = (await _bloquear_piezas(sesion, [pieza_id]))[pieza_id]

    nueva = _redondear(_decimal(corte.cantidad_consumida) + diferencia)
    if nueva <= 0:
        raise ErrorDeNegocio("El uso real no puede dejar el corte de la orden en cero o menos.")
    if diferencia > 0 and diferencia > _decimal(pieza.saldo_restante):
        raise ErrorDeNegocio(
            f"El rollo {pieza.codigo_identificador} tiene {pieza.saldo_restante} "
            f"{pieza.unidad_medida} disponibles y faltan {diferencia} del uso real."
        )

    pieza.saldo_restante = _redondear(_decimal(pieza.saldo_restante) - diferencia)
    corte.cantidad_consumida = nueva
    corte.saldo_nuevo = _redondear(_decimal(corte.saldo_anterior) - nueva)
    _estado_segun_saldo(pieza)
    await sesion.flush()


async def consumos_de_orden(sesion: AsyncSession, orden_id: int) -> list[ConsumoPieza]:
    """Los cortes de rollo o plancha asignados a un pedido, del más antiguo al más reciente (#71)."""
    return list(
        (
            await sesion.execute(
                select(ConsumoPieza)
                .where(ConsumoPieza.orden_id == orden_id)
                .order_by(ConsumoPieza.fecha, ConsumoPieza.id)
            )
        ).scalars()
    )

