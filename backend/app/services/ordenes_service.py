"""Reglas de negocio de las órdenes de trabajo.

Concentra las decisiones que definen el sistema (SRS, Reglas de Negocio):

1. RN-01: sin adelanto no se arranca el trabajo (mínimo del 50% para clientes
   generales; los corporativos con orden de compra formal quedan exceptuados).
2. RN-02: sin pago completo no se entrega (candado digital).
3. RN-03: el stock se reserva al crear la orden, no al producirla.
4. RN-06: cancelar devuelve el stock reservado.
5. RN-07: lo entregado/cancelado es inmutable; a "finalizada" solo se llega
   reportando el consumo real.
"""
from datetime import date
from decimal import Decimal
from typing import Optional

from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auditoria import registrar
from app.core.config import settings
from app.core.errores import Conflicto, ErrorDeNegocio, NoEncontrado, PermisoDenegado
from app.core.fechas import ahora_utc
from app.models import (
    Cliente,
    EstadoOrden,
    EstadoPago,
    Material,
    MetodoPago,
    MotivoMovimiento,
    Orden,
    OrdenItem,
    OrdenMaterial,
    PagoOrden,
    Producto,
    Rol,
    TipoDocumento,
    TipoPago,
    Usuario,
)
from app.schemas.orden import MaterialEstimado, OrdenCreateData, VentaRapidaData
from app.services import inventario_service
from app.services.inventario_service import AjusteStock

# Etapas con el trabajo aún en curso: el stock sigue reservado con las
# cantidades ESTIMADAS, así que aquí todavía se puede editar y cancelar.
ESTADOS_PIPELINE = (
    EstadoOrden.PENDIENTE,
    EstadoOrden.EN_DISENO,
    EstadoOrden.APROBADO,
    EstadoOrden.EN_PRODUCCION,
)

# Etapas posteriores a reportar el consumo real: el stock ya se ajustó.
ESTADOS_CERRADOS = (EstadoOrden.FINALIZADA, EstadoOrden.ENTREGADA)


def _decimal(valor: float | Decimal) -> Decimal:
    return Decimal(str(valor))


def _redondear(valor: Decimal) -> Decimal:
    return valor.quantize(Decimal("0.01"))


# ══ Reglas puras (sin acceso a datos: fáciles de probar) ══════════════════

def calcular_totales(
    subtotal: float | Decimal,
    incluye_igv: bool,
    descuento: float | Decimal = 0,
    igv_porcentaje: float | None = None,
) -> tuple[Decimal, Decimal]:
    """Devuelve (igv, total). El total es subtotal + IGV - descuento."""
    subtotal_d = _decimal(subtotal)
    descuento_d = _decimal(descuento)
    if descuento_d > subtotal_d:
        raise ErrorDeNegocio("El descuento no puede superar el subtotal.")

    porcentaje = _decimal(igv_porcentaje if igv_porcentaje is not None else settings.igv_porcentaje)
    igv = _redondear(subtotal_d * porcentaje / Decimal("100")) if incluye_igv else Decimal("0.00")
    return igv, _redondear(subtotal_d + igv - descuento_d)


def calcular_saldo(total: float | Decimal, pagado: float | Decimal) -> Decimal:
    """Lo que el cliente todavía debe por esta orden (nunca negativo)."""
    saldo = _decimal(total) - _decimal(pagado)
    return _redondear(saldo if saldo > 0 else Decimal("0"))


def validar_adelanto(
    total: float | Decimal,
    adelanto: float | Decimal,
    es_corporativo: bool,
    porcentaje_minimo: float | None = None,
) -> None:
    """
    RN-01. Los clientes generales deben adelantar al menos el porcentaje
    configurado; las órdenes corporativas se autorizan sin ese mínimo.
    """
    if es_corporativo:
        return

    total_d = _decimal(total)
    adelanto_d = _decimal(adelanto)

    if adelanto_d <= 0:
        raise ErrorDeNegocio("Se requiere un adelanto para iniciar el trabajo.")

    porcentaje = _decimal(
        porcentaje_minimo if porcentaje_minimo is not None else settings.adelanto_minimo_porcentaje
    )
    minimo = _redondear(total_d * porcentaje / Decimal("100"))
    if adelanto_d < minimo:
        raise ErrorDeNegocio(
            f"El adelanto mínimo para clientes generales es S/ {minimo} "
            f"({porcentaje}% de S/ {_redondear(total_d)})."
        )


def esta_en_pipeline(estado: Optional[EstadoOrden | str]) -> bool:
    return estado in ESTADOS_PIPELINE


def puede_gestionar(orden: Orden, usuario: Usuario) -> bool:
    """
    El admin, subgerente y secretaría gestionan todo; el resto, solo lo suyo
    (cobrar y reportar uso incluidos).
    """
    if usuario.rol in (Rol.ADMIN, Rol.SUBGERENTE, Rol.SECRETARIA):
        return True
    return orden.asignado_a == usuario.id


def puede_avanzar_etapa(orden: Orden, usuario: Usuario) -> bool:
    """Avanzar el pipeline es del admin/subgerente o del responsable asignado."""
    if usuario.rol in (Rol.ADMIN, Rol.SUBGERENTE):
        return True
    return orden.asignado_a == usuario.id


def ve_todas_las_ordenes(usuario: Usuario) -> bool:
    """Mostrador y supervisión necesitan ver todas; taller solo las suyas."""
    return usuario.rol in (Rol.ADMIN, Rol.SUBGERENTE, Rol.SECRETARIA)


def exigir_gestion(orden: Orden, usuario: Usuario) -> None:
    if not puede_gestionar(orden, usuario):
        raise PermisoDenegado("Solo puedes gestionar órdenes asignadas a ti.")


def exigir_etapa(orden: Orden, usuario: Usuario) -> None:
    if not puede_avanzar_etapa(orden, usuario):
        raise PermisoDenegado("Solo puedes avanzar órdenes asignadas a ti.")


def validar_transicion(actual: EstadoOrden, nuevo: EstadoOrden, pagado_totalmente: bool) -> None:
    """
    Verifica que mover la orden de `actual` a `nuevo` sea legítimo.

    Las prohibiciones no son arbitrarias: cada una protege el inventario o una
    regla de cobro. Lanza ErrorDeNegocio con el motivo si no vale.
    """
    if actual == EstadoOrden.CANCELADA:
        raise ErrorDeNegocio("Una orden cancelada no puede cambiar de estado.")

    if actual == EstadoOrden.ENTREGADA:
        # La entrega es definitiva: el trabajo ya salió del taller.
        raise ErrorDeNegocio("Una orden entregada no puede cambiar de estado.")

    if nuevo == EstadoOrden.CANCELADA:
        raise ErrorDeNegocio(
            "Para cancelar usa la acción Cancelar (devuelve el stock reservado)."
        )

    if nuevo == EstadoOrden.FINALIZADA and actual not in ESTADOS_CERRADOS:
        raise ErrorDeNegocio(
            "Para finalizar usa 'Reportar uso' e ingresa las cantidades reales de material."
        )

    if esta_en_pipeline(actual) and not esta_en_pipeline(nuevo):
        raise ErrorDeNegocio(
            "Una orden en proceso solo puede moverse entre etapas de producción."
        )

    if actual in ESTADOS_CERRADOS and nuevo not in ESTADOS_CERRADOS:
        raise ErrorDeNegocio(
            "Una orden ya finalizada no puede volver al proceso de producción."
        )

    if nuevo == EstadoOrden.ENTREGADA and not pagado_totalmente:
        # El cliente no se lleva el trabajo sin haber pagado el total.
        raise ErrorDeNegocio(
            "No se puede entregar una orden que no está pagada en su totalidad. "
            "Registra el pago con 'Pago recibido' antes de marcarla como entregada."
        )


# ══ Helpers de datos ═══════════════════════════════════════════════════════

async def _obtener_para_escritura(sesion: AsyncSession, id_orden: int) -> Orden:
    orden = (
        await sesion.execute(
            select(Orden).where(Orden.id == id_orden).with_for_update(of=Orden)
        )
    ).scalar_one_or_none()
    if orden is None:
        raise NoEncontrado("Orden no encontrada.")
    return orden


async def obtener(sesion: AsyncSession, id_orden: int, usuario: Usuario) -> Orden:
    orden = (
        await sesion.execute(select(Orden).where(Orden.id == id_orden))
    ).scalar_one_or_none()
    if orden is None:
        raise NoEncontrado("Orden no encontrada.")
    if not ve_todas_las_ordenes(usuario) and orden.asignado_a not in (None, usuario.id):
        raise PermisoDenegado("Solo puedes ver órdenes asignadas a ti.")
    return orden


async def listar(
    sesion: AsyncSession,
    usuario: Usuario,
    estado: Optional[EstadoOrden] = None,
    limite: int = 200,
) -> list[Orden]:
    consulta = select(Orden).order_by(Orden.creado_en.desc()).limit(limite)

    if estado is not None:
        consulta = consulta.where(Orden.estado == estado)

    if not ve_todas_las_ordenes(usuario):
        # El trabajador solo ve sus órdenes asignadas y las que no tienen dueño.
        consulta = consulta.where(
            or_(Orden.asignado_a == usuario.id, Orden.asignado_a.is_(None))
        )

    return list((await sesion.execute(consulta)).scalars())


async def _resolver_cliente(sesion: AsyncSession, data: OrdenCreateData) -> Cliente:
    if data.cliente_id:
        cliente = await sesion.get(Cliente, data.cliente_id)
        if cliente is None or not cliente.activo:
            raise NoEncontrado("Cliente no encontrado.")
        return cliente

    nombre = (data.cliente or "").strip()
    if not nombre:
        raise ErrorDeNegocio("Indica el cliente de la orden.")

    existente = (
        await sesion.execute(select(Cliente).where(Cliente.nombre.ilike(nombre)))
    ).scalars().first()
    if existente is not None:
        return existente

    # Alta rápida desde el mostrador: se crea el cliente con los datos mínimos.
    cliente = Cliente(nombre=nombre, telefono=data.telefono, direccion=data.direccion)
    sesion.add(cliente)
    await sesion.flush()
    return cliente


async def _validar_asignado(sesion: AsyncSession, usuario_id: Optional[int]) -> Optional[Usuario]:
    if usuario_id is None:
        return None
    usuario = await sesion.get(Usuario, usuario_id)
    if usuario is None or not usuario.activo:
        raise ErrorDeNegocio("El trabajador indicado no existe o está inactivo.")
    return usuario


async def _cargar_materiales(sesion: AsyncSession, ids: set[int]) -> dict[int, Material]:
    if not ids:
        return {}
    filas = (
        await sesion.execute(select(Material).where(Material.id.in_(ids)))
    ).scalars()
    return {material.id: material for material in filas}


def _calcular_subtotal(data: OrdenCreateData) -> Decimal:
    if data.items:
        return _redondear(
            sum(
                (_redondear(_decimal(item.cantidad) * _decimal(item.precio_unitario)) for item in data.items),
                Decimal("0"),
            )
        )
    if data.precio_total is None:
        raise ErrorDeNegocio("La orden necesita al menos un ítem o un precio total.")
    return _redondear(_decimal(data.precio_total))


def _reemplazar_items(orden: Orden, data: OrdenCreateData) -> None:
    orden.items.clear()
    for item in data.items:
        importe = _redondear(_decimal(item.cantidad) * _decimal(item.precio_unitario))
        orden.items.append(
            OrdenItem(
                producto_id=item.producto_id,
                descripcion=item.descripcion,
                ancho_m=_decimal(item.ancho_m) if item.ancho_m is not None else None,
                alto_m=_decimal(item.alto_m) if item.alto_m is not None else None,
                cantidad=_redondear(_decimal(item.cantidad)),
                precio_unitario=_redondear(_decimal(item.precio_unitario)),
                importe=importe,
            )
        )


def _reemplazar_materiales(
    orden: Orden, estimados: list[MaterialEstimado], materiales: dict[int, Material]
) -> None:
    orden.materiales.clear()
    for estimado in estimados:
        material = materiales.get(estimado.material_id)
        orden.materiales.append(
            OrdenMaterial(
                material_id=estimado.material_id,
                nombre=material.nombre if material else "",
                unidad=(
                    (material.unidad.abreviatura or material.unidad.nombre)
                    if material and material.unidad
                    else ""
                ),
                cantidad_estimada=_redondear(_decimal(estimado.cantidad)),
            )
        )


def _recalcular_finanzas(orden: Orden) -> None:
    """Deja el saldo y el estado de pago consistentes con el historial."""
    total_pagado = sum((_decimal(pago.monto) for pago in orden.pagos), Decimal("0"))
    adelantos = sum(
        (_decimal(pago.monto) for pago in orden.pagos if pago.tipo == TipoPago.ADELANTO),
        Decimal("0"),
    )
    orden.adelanto = _redondear(adelantos)
    orden.saldo_pendiente = calcular_saldo(orden.total, total_pagado)
    orden.pagado_totalmente = _decimal(orden.total) <= total_pagado


def _sincronizar_adelanto(orden: Orden, data: OrdenCreateData, usuario: Usuario) -> None:
    """
    Al editar una orden en proceso, el adelanto pactado puede cambiar. Se
    corrige el evento de pago de adelanto (la edición está permitida justo
    mientras la orden no se haya finalizado).
    """
    adelantos = [pago for pago in orden.pagos if pago.tipo == TipoPago.ADELANTO]
    nuevo = _redondear(_decimal(data.adelanto_pago))

    if adelantos:
        adelantos[0].monto = nuevo
        adelantos[0].metodo = data.metodo_pago
        # Si hubiera más de un adelanto registrado, se conserva el primero.
        for sobrante in adelantos[1:]:
            orden.pagos.remove(sobrante)
    elif nuevo > 0:
        orden.pagos.append(
            PagoOrden(
                monto=nuevo,
                metodo=data.metodo_pago,
                tipo=TipoPago.ADELANTO,
                registrado_por=usuario.id,
            )
        )


def _auditar_orden(
    sesion: AsyncSession,
    usuario: Usuario,
    accion,
    orden: Orden,
    detalle: str,
    anteriores: Optional[dict] = None,
    nuevos: Optional[dict] = None,
) -> None:
    registrar(
        sesion,
        usuario.id,
        accion,
        tabla_afectada="ordenes",
        registro_id=orden.codigo,
        detalle=detalle,
        valores_anteriores=anteriores,
        valores_nuevos=nuevos,
    )


# ══ Operaciones ═══════════════════════════════════════════════════════════

async def crear_orden(sesion: AsyncSession, data: OrdenCreateData, usuario: Usuario) -> Orden:
    """Crea la orden y reserva su material en una sola transacción."""
    asignado = await _validar_asignado(sesion, data.asignado_a)
    cliente = await _resolver_cliente(sesion, data)

    subtotal = _calcular_subtotal(data)
    descuento = _redondear(_decimal(data.descuento))
    igv, total = calcular_totales(subtotal, data.incluye_igv, descuento)
    validar_adelanto(total, data.adelanto_pago, cliente.es_corporativo)

    orden = Orden(
        tipo_documento=data.tipo_documento,
        # Se asigna la relación (no solo el id) para que la respuesta pueda
        # serializar el nombre sin provocar una carga perezosa en async.
        cliente=cliente,
        direccion=data.direccion or cliente.direccion,
        telefono=data.telefono or cliente.telefono,
        asignado=asignado,
        creado_por=usuario.id,
        descripcion=data.descripcion,
        unidad_negocio=data.unidad_negocio,
        fecha_entrega=data.fecha_entrega,
        incluye_igv=data.incluye_igv,
        subtotal=subtotal,
        igv=igv,
        descuento=descuento,
        motivo_descuento=data.motivo_descuento,
        total=total,
        metodo_pago_adelanto=data.metodo_pago,
        # Las colecciones se inicializan vacías para poder agregar ítems,
        # materiales y pagos sin disparar una carga perezosa en async.
        items=[],
        materiales=[],
        pagos=[],
    )
    sesion.add(orden)
    await sesion.flush()  # asigna el id y con él el correlativo ORD-000000

    _reemplazar_items(orden, data)
    materiales = await _cargar_materiales(
        sesion, {estimado.material_id for estimado in data.materiales_estimados}
    )
    _reemplazar_materiales(orden, data.materiales_estimados, materiales)
    await sesion.flush()

    if data.materiales_estimados:
        # RN-03: el stock se compromete al aceptar el trabajo.
        await inventario_service.aplicar_ajustes(
            sesion,
            [
                AjusteStock(
                    material_id=estimado.material_id,
                    delta=-estimado.cantidad,
                    motivo=MotivoMovimiento.RESERVA,
                    nota=f"Reserva de la orden {orden.codigo}",
                )
                for estimado in data.materiales_estimados
            ],
            orden_id=orden.id,
            usuario_id=usuario.id,
        )

    if data.adelanto_pago > 0:
        orden.pagos.append(
            PagoOrden(
                monto=_redondear(_decimal(data.adelanto_pago)),
                metodo=data.metodo_pago,
                tipo=TipoPago.ADELANTO,
                registrado_por=usuario.id,
            )
        )
        await sesion.flush()

    _recalcular_finanzas(orden)
    _auditar_orden(
        sesion,
        usuario,
        "crear",
        orden,
        f"Cliente: {cliente.nombre}, Total: S/ {_redondear(total)}",
        nuevos={"estado": orden.estado.value, "total": float(total)},
    )
    await sesion.flush()
    return orden


async def crear_venta_rapida(
    sesion: AsyncSession, data: VentaRapidaData, usuario: Usuario
) -> Orden:
    """
    Registra una venta express en mostrador (copias, fotochecks, servicios rápidos).
    Se crea la orden con pago al 100% y queda inmediatamente entregada.
    """
    nombre_cliente = (data.cliente_nombre or "Cliente Mostrador").strip()
    cliente = (
        await sesion.execute(select(Cliente).where(Cliente.nombre.ilike(nombre_cliente)))
    ).scalars().first()
    if cliente is None:
        cliente = Cliente(nombre=nombre_cliente)
        sesion.add(cliente)
        await sesion.flush()

    monto = _redondear(_decimal(data.monto_total))
    hoy = ahora_utc().date()
    ahora = ahora_utc()

    orden = Orden(
        tipo_documento=TipoDocumento.CONTRATO,
        cliente=cliente,
        direccion="",
        telefono="",
        asignado=usuario,
        creado_por=usuario.id,
        descripcion=f"[VENTA RÁPIDA] {data.descripcion}",
        unidad_negocio=data.unidad_negocio,
        fecha_entrega=hoy,
        incluye_igv=False,
        subtotal=monto,
        igv=Decimal("0.00"),
        descuento=Decimal("0.00"),
        motivo_descuento="",
        total=monto,
        adelanto=monto,
        saldo_pendiente=Decimal("0.00"),
        pagado_totalmente=True,
        metodo_pago_adelanto=data.metodo_pago,
        estado=EstadoOrden.ENTREGADA,
        finalizada_en=ahora,
        entregada_en=ahora,
        items=[],
        materiales=[],
        pagos=[],
    )
    sesion.add(orden)
    await sesion.flush()

    item = OrdenItem(
        orden_id=orden.id,
        descripcion=data.descripcion,
        cantidad=Decimal("1.00"),
        precio_unitario=monto,
        importe=monto,
    )
    orden.items.append(item)

    pago = PagoOrden(
        orden_id=orden.id,
        monto=monto,
        metodo=data.metodo_pago,
        tipo=TipoPago.ADELANTO,
        registrado_por=usuario.id,
        usuario=usuario,
        referencia=data.referencia,
        estado_pago=EstadoPago.CONFORME,
    )
    orden.pagos.append(pago)
    await sesion.flush()

    _auditar_orden(
        sesion,
        usuario,
        "crear",
        orden,
        f"Venta rápida {orden.codigo} por S/ {monto} ({data.metodo_pago.value}).",
        nuevos={"total": float(monto), "descripcion": data.descripcion, "express": True},
    )
    await sesion.flush()
    return orden


async def actualizar(sesion: AsyncSession, id_orden: int, data: OrdenCreateData, usuario: Usuario) -> Orden:
    """Reajusta la orden y el material reservado a la nueva estimación."""
    orden = await _obtener_para_escritura(sesion, id_orden)
    if not esta_en_pipeline(orden.estado):
        raise ErrorDeNegocio(
            "Solo se pueden editar órdenes que aún están en proceso "
            "(antes de finalizar la producción)."
        )

    asignado = await _validar_asignado(sesion, data.asignado_a)
    cliente = await _resolver_cliente(sesion, data)

    subtotal = _calcular_subtotal(data)
    descuento = _redondear(_decimal(data.descuento))
    igv, total = calcular_totales(subtotal, data.incluye_igv, descuento)
    validar_adelanto(total, data.adelanto_pago, cliente.es_corporativo)

    anteriores = {
        linea.material_id: float(linea.cantidad_estimada) for linea in orden.materiales
    }
    nuevos = {estimado.material_id: estimado.cantidad for estimado in data.materiales_estimados}
    ajustes = inventario_service.calcular_delta_reserva(anteriores, nuevos)

    anteriores_json = {
        "cliente": orden.cliente.nombre if orden.cliente else "",
        "total": float(orden.total),
        "estado": orden.estado.value,
    }

    orden.cliente = cliente
    orden.direccion = data.direccion or cliente.direccion
    orden.telefono = data.telefono or cliente.telefono
    orden.asignado = asignado
    orden.descripcion = data.descripcion
    orden.tipo_documento = data.tipo_documento
    orden.unidad_negocio = data.unidad_negocio
    orden.fecha_entrega = data.fecha_entrega
    orden.incluye_igv = data.incluye_igv
    orden.subtotal = subtotal
    orden.igv = igv
    orden.descuento = descuento
    orden.motivo_descuento = data.motivo_descuento
    orden.total = total
    orden.metodo_pago_adelanto = data.metodo_pago

    _reemplazar_items(orden, data)
    materiales = await _cargar_materiales(
        sesion, {estimado.material_id for estimado in data.materiales_estimados}
    )
    _reemplazar_materiales(orden, data.materiales_estimados, materiales)
    _sincronizar_adelanto(orden, data, usuario)
    await sesion.flush()

    if ajustes:
        await inventario_service.aplicar_ajustes(
            sesion,
            ajustes,
            orden_id=orden.id,
            usuario_id=usuario.id,
            exigir_material=False,
        )

    _recalcular_finanzas(orden)
    _auditar_orden(
        sesion,
        usuario,
        "editar",
        orden,
        f"Cliente: {cliente.nombre}, Total: S/ {_redondear(total)}",
        anteriores=anteriores_json,
        nuevos={"cliente": cliente.nombre, "total": float(total), "estado": orden.estado.value},
    )
    await sesion.flush()
    return orden


async def cancelar(sesion: AsyncSession, id_orden: int, usuario: Usuario) -> Orden:
    """Cancela la orden y devuelve al inventario el material reservado."""
    orden = await _obtener_para_escritura(sesion, id_orden)
    if not esta_en_pipeline(orden.estado):
        raise ErrorDeNegocio(
            "Solo se pueden cancelar órdenes que aún están en proceso "
            "(antes de finalizar la producción)."
        )

    await inventario_service.aplicar_ajustes(
        sesion,
        [
            AjusteStock(
                material_id=linea.material_id,
                delta=float(linea.cantidad_estimada),
                nombre=linea.nombre,
                motivo=MotivoMovimiento.LIBERACION,
                nota=f"Cancelación de la orden {orden.codigo}",
            )
            for linea in orden.materiales
            if linea.cantidad_estimada > 0
        ],
        orden_id=orden.id,
        usuario_id=usuario.id,
        exigir_material=False,  # un material borrado no debe bloquear la devolución
    )

    estado_anterior = orden.estado
    orden.estado = EstadoOrden.CANCELADA
    _auditar_orden(
        sesion,
        usuario,
        "cambio_estado",
        orden,
        "Orden cancelada — stock estimado devuelto",
        anteriores={"estado": estado_anterior.value},
        nuevos={"estado": orden.estado.value},
    )
    await sesion.flush()
    return orden


async def asignar(sesion: AsyncSession, id_orden: int, usuario_destino: Optional[int], usuario: Usuario) -> Orden:
    orden = await _obtener_para_escritura(sesion, id_orden)
    if orden.estado in (EstadoOrden.CANCELADA, EstadoOrden.ENTREGADA):
        raise ErrorDeNegocio("No se puede reasignar una orden cancelada o entregada.")

    destino = await _validar_asignado(sesion, usuario_destino)
    anterior = orden.asignado_a
    orden.asignado = destino

    _auditar_orden(
        sesion,
        usuario,
        "editar",
        orden,
        f"Asignada a {destino.nombre}" if destino else "Orden desasignada",
        anteriores={"asignado_a": anterior},
        nuevos={"asignado_a": usuario_destino},
    )
    await sesion.flush()
    return orden


async def cambiar_estado(
    sesion: AsyncSession, id_orden: int, nuevo: EstadoOrden, usuario: Usuario
) -> Orden:
    """Avanza (o corrige) la etapa de producción de una orden."""
    orden = await _obtener_para_escritura(sesion, id_orden)
    exigir_etapa(orden, usuario)

    actual = orden.estado
    if actual == nuevo:
        return orden

    validar_transicion(actual, nuevo, orden.pagado_totalmente)
    orden.estado = nuevo
    if nuevo == EstadoOrden.ENTREGADA:
        orden.entregada_en = ahora_utc()

    _auditar_orden(
        sesion,
        usuario,
        "cambio_estado",
        orden,
        f"Estado: {actual.value} -> {nuevo.value}",
        anteriores={"estado": actual.value},
        nuevos={"estado": nuevo.value},
    )
    await sesion.flush()
    return orden


async def confirmar_pago(
    sesion: AsyncSession,
    id_orden: int,
    metodo: Optional[MetodoPago],
    referencia: str,
    usuario: Usuario,
) -> Orden:
    """Registra el cobro del saldo y deja la orden habilitada para entregarse."""
    orden = await _obtener_para_escritura(sesion, id_orden)
    exigir_gestion(orden, usuario)

    if orden.estado == EstadoOrden.CANCELADA:
        raise ErrorDeNegocio("No se puede confirmar pago en una orden cancelada.")
    if orden.pagado_totalmente:
        raise Conflicto("El pago ya fue confirmado.")

    saldo = _decimal(orden.saldo_pendiente)
    if saldo > 0:
        orden.pagos.append(
            PagoOrden(
                monto=_redondear(saldo),
                # Si no se indica, se asume el mismo medio del adelanto.
                metodo=metodo or orden.metodo_pago_adelanto,
                tipo=TipoPago.SALDO,
                registrado_por=usuario.id,
                referencia=referencia,
            )
        )
        await sesion.flush()

    anterior = float(orden.saldo_pendiente)
    _recalcular_finanzas(orden)
    _auditar_orden(
        sesion,
        usuario,
        "pago",
        orden,
        f"Pago completo confirmado para la orden {orden.codigo}",
        anteriores={"saldo_pendiente": anterior},
        nuevos={"saldo_pendiente": float(orden.saldo_pendiente)},
    )
    await sesion.flush()
    return orden


async def completar(
    sesion: AsyncSession, id_orden: int, materiales_reales: list[MaterialEstimado], usuario: Usuario
) -> tuple[Orden, list[dict], list[dict]]:
    """
    Cierra la producción con el consumo real de material.

    El estimado ya se descontó al crear la orden, así que aquí solo se ajusta
    la diferencia: lo que se usó de más se descuenta (merma) y lo que sobró
    vuelve al inventario (devolución).
    """
    orden = await _obtener_para_escritura(sesion, id_orden)
    exigir_gestion(orden, usuario)

    if orden.estado in ESTADOS_CERRADOS:
        raise ErrorDeNegocio("Esta orden ya fue finalizada.")
    if orden.estado == EstadoOrden.CANCELADA:
        raise ErrorDeNegocio("No se puede completar una orden cancelada.")

    reales_por_id = {real.material_id: _redondear(_decimal(real.cantidad)) for real in materiales_reales}
    lineas_por_id = {linea.material_id: linea for linea in orden.materiales}

    # Material reportado que no estaba en la estimación: se agrega como línea
    # con estimado 0, de modo que todo su consumo quede como merma.
    faltantes = set(reales_por_id) - set(lineas_por_id)
    if faltantes:
        materiales = await _cargar_materiales(sesion, faltantes)
        for material_id in faltantes:
            material = materiales.get(material_id)
            if material is None:
                raise ErrorDeNegocio(f"Material {material_id} no existe en inventario.")
            linea = OrdenMaterial(
                material_id=material_id,
                nombre=material.nombre,
                unidad=material.unidad.abreviatura or material.unidad.nombre if material.unidad else "",
                cantidad_estimada=Decimal("0.00"),
            )
            orden.materiales.append(linea)
            lineas_por_id[material_id] = linea

    ajustes: list[AjusteStock] = []
    mermas: list[dict] = []
    devoluciones: list[dict] = []

    for material_id, linea in lineas_por_id.items():
        if material_id not in reales_por_id:
            continue

        real = reales_por_id[material_id]
        linea.cantidad_real = real
        exceso = real - _decimal(linea.cantidad_estimada)
        if exceso == 0:
            continue

        es_merma = exceso > 0
        ajustes.append(
            AjusteStock(
                material_id=material_id,
                delta=float(-exceso),
                nombre=linea.nombre,
                motivo=MotivoMovimiento.MERMA if es_merma else MotivoMovimiento.DEVOLUCION,
                nota=f"Reporte de uso de la orden {orden.codigo}",
            )
        )
        registro = {
            "id_material": material_id,
            "nombre": linea.nombre,
            "cantidad": abs(float(exceso)),
        }
        (mermas if es_merma else devoluciones).append(registro)

    await inventario_service.aplicar_ajustes(
        sesion,
        ajustes,
        orden_id=orden.id,
        usuario_id=usuario.id,
        exigir_material=False,
    )

    orden.estado = EstadoOrden.FINALIZADA
    orden.finalizada_en = ahora_utc()

    _auditar_orden(
        sesion,
        usuario,
        "cambio_estado",
        orden,
        f"Materiales reales: {len(materiales_reales)}, "
        f"Excesos: {len(mermas)}, Devoluciones: {len(devoluciones)}",
        nuevos={"estado": orden.estado.value},
    )
    await sesion.flush()
    return orden, mermas, devoluciones


async def resumen_cliente(sesion: AsyncSession, cliente_id: int) -> dict:
    """Ficha del cliente: historial, facturado y por cobrar (RF del SRS)."""
    cliente = await sesion.get(Cliente, cliente_id)
    if cliente is None:
        raise NoEncontrado("Cliente no encontrado.")

    ordenes = list(
        (
            await sesion.execute(
                select(Orden).where(Orden.cliente_id == cliente_id).order_by(Orden.creado_en.desc())
            )
        ).scalars()
    )

    facturado = sum(
        (_decimal(orden.total) for orden in ordenes if orden.estado != EstadoOrden.CANCELADA),
        Decimal("0"),
    )
    por_cobrar = sum(
        (
            _decimal(orden.saldo_pendiente)
            for orden in ordenes
            if orden.estado != EstadoOrden.CANCELADA and not orden.pagado_totalmente
        ),
        Decimal("0"),
    )
    return {
        "cliente_id": cliente_id,
        "total_ordenes": len(ordenes),
        "facturado": _redondear(facturado),
        "por_cobrar": _redondear(por_cobrar),
    }


def materiales_desde_receta(producto: Producto, cantidad: float = 1) -> list[MaterialEstimado]:
    """Autocompleta los materiales de una orden a partir de la receta (D8)."""
    factor = _decimal(cantidad)
    return [
        MaterialEstimado(
            material_id=linea.material_id,
            cantidad=float(_redondear(_decimal(linea.cantidad) * factor)),
        )
        for linea in producto.receta
    ]


def fecha_hoy_peru() -> date:
    from app.core.fechas import a_fecha_peru

    return a_fecha_peru(ahora_utc())
