"""Convierten objetos ORM a los diccionarios que devuelve la API.

Se centralizan aquí para que los routers no armen respuestas a mano y para
que el frontend Angular reciba siempre la misma forma (envoltura `finanzas` y
`materiales` incluida).
"""
from datetime import date, datetime
from decimal import Decimal
from typing import Any, Optional


def num(valor: Optional[Decimal | float | int]) -> float:
    """Decimal -> float redondeado a 2 decimales (montos en soles)."""
    if valor is None:
        return 0.0
    return round(float(valor), 2)


def iso(momento: Optional[datetime | date]) -> Optional[str]:
    return momento.isoformat() if momento is not None else None


# ── Usuarios ────────────────────────────────────────────────────────────────

def serializar_usuario(usuario) -> dict[str, Any]:
    return {
        # `uid` se mantiene por compatibilidad con el frontend existente.
        "uid": usuario.id,
        "id": usuario.id,
        "nombre": usuario.nombre,
        "email": usuario.email,
        "rol": usuario.rol.value,
        "activo": usuario.activo,
    }


# ── Clientes ────────────────────────────────────────────────────────────────

def serializar_cliente(cliente) -> dict[str, Any]:
    return {
        "id": cliente.id,
        "nombre": cliente.nombre,
        "tipo": cliente.tipo.value,
        "documento": cliente.documento,
        "telefono": cliente.telefono,
        "email": cliente.email,
        "direccion": cliente.direccion,
        "notas": cliente.notas,
        "es_corporativo": cliente.es_corporativo,
        "activo": cliente.activo,
        "creado_en": iso(cliente.creado_en),
    }


# ── Unidades ────────────────────────────────────────────────────────────────

def serializar_unidad(unidad) -> dict[str, Any]:
    return {
        "id": unidad.id,
        "nombre": unidad.nombre,
        "abreviatura": unidad.abreviatura,
        "activo": unidad.activo,
    }


# ── Inventario ──────────────────────────────────────────────────────────────

def serializar_material(material) -> dict[str, Any]:
    return {
        "id": material.id,
        "nombre": material.nombre,
        "unidad_id": material.unidad_id,
        "unidad": material.unidad.abreviatura or material.unidad.nombre if material.unidad else "",
        "stock_actual": num(material.stock_actual),
        "alerta_minima": num(material.alerta_minima),
        "dias_reabastecimiento": material.dias_reabastecimiento,
        "stock_bajo": material.stock_bajo,
        "precio_compra": num(material.precio_compra),
        "ubicacion_estante": material.ubicacion_estante,
        "tipo_formato": material.tipo_formato.value if material.tipo_formato else "unidad_pieza",
        "ancho_predeterminado_m": num(material.ancho_predeterminado_m) if material.ancho_predeterminado_m is not None else None,
        "largo_predeterminado_m": num(material.largo_predeterminado_m) if material.largo_predeterminado_m is not None else None,
        "espesor_mm": num(material.espesor_mm) if material.espesor_mm is not None else None,
        "activo": material.activo,
    }


def serializar_pieza(pieza) -> dict[str, Any]:
    return {
        "id": pieza.id,
        "material_id": pieza.material_id,
        "material_nombre": pieza.material.nombre if pieza.material else "",
        "codigo_identificador": pieza.codigo_identificador,
        "ancho_m": num(pieza.ancho_m) if pieza.ancho_m is not None else None,
        "largo_m": num(pieza.largo_m) if pieza.largo_m is not None else None,
        "espesor_mm": num(pieza.espesor_mm) if pieza.espesor_mm is not None else None,
        "capacidad_inicial": num(pieza.capacidad_inicial),
        "saldo_restante": num(pieza.saldo_restante),
        "unidad_medida": pieza.unidad_medida,
        "costo_adquisicion": num(pieza.costo_adquisicion),
        "estado": pieza.estado.value if hasattr(pieza.estado, "value") else str(pieza.estado),
        "ubicacion": pieza.ubicacion,
        "maquina_asignada": pieza.maquina_asignada,
        "fecha_ingreso": iso(pieza.fecha_ingreso),
        "fecha_termino": iso(pieza.fecha_termino),
        "nota": pieza.nota,
        "total_recaudado": num(pieza.total_recaudado),
        "ganancia_neta": num(pieza.ganancia_neta),
        "consumos": [serializar_consumo(c) for c in (pieza.consumos or [])],
    }


def serializar_consumo(consumo) -> dict[str, Any]:
    return {
        "id": consumo.id,
        "pieza_id": consumo.pieza_id,
        "orden_id": consumo.orden_id,
        "orden_codigo": consumo.orden.codigo if consumo.orden else None,
        "trabajo_descripcion": consumo.trabajo_descripcion,
        "cantidad_consumida": num(consumo.cantidad_consumida),
        "saldo_anterior": num(consumo.saldo_anterior),
        "saldo_nuevo": num(consumo.saldo_nuevo),
        "monto_cobrado": num(consumo.monto_cobrado),
        "merma_desperdicio": num(consumo.merma_desperdicio),
        "fecha": iso(consumo.fecha),
        "usuario": consumo.usuario.nombre if consumo.usuario else "",
        "nota": consumo.nota,
    }


def serializar_movimiento(movimiento) -> dict[str, Any]:
    return {
        "id": movimiento.id,
        "material_id": movimiento.material_id,
        "material": movimiento.material.nombre if movimiento.material else "",
        "orden_id": movimiento.orden_id,
        "delta": num(movimiento.delta),
        "stock_resultante": num(movimiento.stock_resultante),
        "motivo": movimiento.motivo.value,
        "nota": movimiento.nota,
        "usuario": movimiento.usuario.nombre if movimiento.usuario else "",
        "fecha": iso(movimiento.creado_en),
    }


# ── Productos ───────────────────────────────────────────────────────────────

def serializar_producto(producto) -> dict[str, Any]:
    return {
        "id": producto.id,
        "nombre": producto.nombre,
        "tipo": producto.tipo.value,
        "precio_base": num(producto.precio_base),
        "notas": producto.notas,
        "activo": producto.activo,
        # Forma plana que ya usaba el formulario de órdenes para autocompletar.
        "materiales": [
            {
                "id_material": linea.material_id,
                "nombre": linea.material.nombre if linea.material else "",
                "cantidad": num(linea.cantidad),
            }
            for linea in producto.receta
        ],
        "receta": [
            {
                "material_id": linea.material_id,
                "cantidad": num(linea.cantidad),
            }
            for linea in producto.receta
        ],
    }


# ── Órdenes ─────────────────────────────────────────────────────────────────

def _serializar_pago(pago) -> dict[str, Any]:
    return {
        "id": pago.id,
        "fecha": iso(pago.fecha),
        "monto": num(pago.monto),
        "metodo": pago.metodo.value,
        "tipo": pago.tipo.value,
        "referencia": pago.referencia,
        "registrado_por": pago.registrado_por,
        "estado_pago": pago.estado_pago.value if pago.estado_pago else "conforme",
        "motivo_observacion": pago.motivo_observacion.value if pago.motivo_observacion else None,
        "nota_observacion": pago.nota_observacion or "",
        "observado_por": pago.observador.nombre if pago.observador else None,
        "observado_en": iso(pago.observado_en),
    }


def _serializar_materiales(orden) -> dict[str, list[dict[str, Any]]]:
    estimados, reales, mermas, devoluciones = [], [], [], []

    for linea in orden.materiales:
        estimada = num(linea.cantidad_estimada)
        base = {"id_material": linea.material_id, "nombre": linea.nombre, "cantidad": estimada}
        estimados.append({**base, "unidad": linea.unidad})

        if linea.cantidad_real is None:
            continue

        real = num(linea.cantidad_real)
        reales.append({"id_material": linea.material_id, "nombre": linea.nombre, "cantidad": real})
        diferencia = round(real - estimada, 2)
        if diferencia > 0:
            mermas.append({"id_material": linea.material_id, "nombre": linea.nombre, "cantidad": diferencia})
        elif diferencia < 0:
            devoluciones.append(
                {"id_material": linea.material_id, "nombre": linea.nombre, "cantidad": abs(diferencia)}
            )

    return {"estimados": estimados, "reales": reales, "mermas": mermas, "devoluciones": devoluciones}


def serializar_orden(orden) -> dict[str, Any]:
    """Forma de respuesta que consume la pantalla de órdenes."""
    return {
        "id": orden.id,
        "id_documento": orden.codigo,
        "codigo": orden.codigo,
        "tipo_documento": orden.tipo_documento.value,
        "cliente_id": orden.cliente_id,
        "cliente": orden.cliente.nombre if orden.cliente else "",
        "direccion": orden.direccion,
        "telefono": orden.telefono,
        "descripcion": orden.descripcion,
        "estado": orden.estado.value,
        "unidad_negocio": orden.unidad_negocio.value,
        "fecha_creacion": iso(orden.creado_en),
        "fecha_entrega": orden.fecha_entrega.isoformat() if orden.fecha_entrega else None,
        "finalizada_en": iso(orden.finalizada_en),
        "entregada_en": iso(orden.entregada_en),
        "creado_por": orden.creado_por,
        "asignado_a": orden.asignado_a,
        "asignado": orden.asignado.nombre if orden.asignado else "",
        "incluye_igv": orden.incluye_igv,
        "subtotal": num(orden.subtotal),
        "igv": num(orden.igv),
        "items": [
            {
                "id": item.id,
                "producto_id": item.producto_id,
                "descripcion": item.descripcion,
                "ancho_m": num(item.ancho_m) if item.ancho_m is not None else None,
                "alto_m": num(item.alto_m) if item.alto_m is not None else None,
                "cantidad": num(item.cantidad),
                "precio_unitario": num(item.precio_unitario),
                "importe": num(item.importe),
            }
            for item in orden.items
        ],
        "finanzas": {
            "precio_total": num(orden.total),
            "subtotal": num(orden.subtotal),
            "igv": num(orden.igv),
            "adelanto_pago": num(orden.adelanto),
            "descuento": num(orden.descuento),
            "motivo_descuento": orden.motivo_descuento,
            "saldo_pendiente": num(orden.saldo_pendiente),
            "metodo_pago_adelanto": orden.metodo_pago_adelanto.value,
            "pagado_totalmente": orden.pagado_totalmente,
            "pagos": [_serializar_pago(pago) for pago in orden.pagos],
        },
        "materiales": _serializar_materiales(orden),
    }


# ── Caja ────────────────────────────────────────────────────────────────────

def serializar_cierre(cierre) -> dict[str, Any]:
    return {
        "id": cierre.id,
        "fecha": cierre.fecha.isoformat(),
        "unidad_negocio": cierre.unidad_negocio.value,
        "usuario_id": cierre.usuario_id,
        "usuario": cierre.usuario.nombre if cierre.usuario else "",
        "monto_efectivo": num(cierre.monto_efectivo),
        "monto_yape": num(cierre.monto_yape),
        "monto_transferencia": num(cierre.monto_transferencia),
        "total": num(cierre.total),
        "estado": cierre.estado.value,
        "validado_por": cierre.validado_por,
        "validador": cierre.validador.nombre if cierre.validador else "",
        "observacion": cierre.observacion,
        "creado_en": iso(cierre.creado_en),
    }


# ── Auditoría ───────────────────────────────────────────────────────────────

def serializar_auditoria(entrada) -> dict[str, Any]:
    return {
        "id": entrada.id,
        "usuario_id": entrada.usuario_id,
        "usuario": entrada.usuario.nombre if entrada.usuario else "Sistema",
        "accion": entrada.accion.value,
        "tabla_afectada": entrada.tabla_afectada,
        "registro_id": entrada.registro_id,
        "detalle": entrada.detalle,
        "valores_anteriores": entrada.valores_anteriores,
        "valores_nuevos": entrada.valores_nuevos,
        "ip": entrada.ip,
        "fecha": iso(entrada.fecha),
    }
