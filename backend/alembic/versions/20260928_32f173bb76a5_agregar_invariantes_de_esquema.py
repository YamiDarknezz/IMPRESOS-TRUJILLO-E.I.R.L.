"""agregar invariantes de esquema: CHECK reales de los enums, codigo de rollo unico y saldo dentro de capacidad

Revision ID: 32f173bb76a5
Revises: 70522830813f
Create Date: 2026-09-28 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = '32f173bb76a5'
down_revision: Union[str, None] = '70522830813f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


# (tabla, columna, nombre del CHECK -- el mismo `name=` que usa enum_columna()
#  en el modelo, para que una base creada desde los modelos y una migrada con
#  Alembic terminen con el mismo esquema--, valores permitidos, admite NULL)
#
# `native_enum=False` guarda estas columnas como VARCHAR: sin este CHECK no
# hay nada, ni en la base ni en el ORM, que impida escribir un valor que no
# está en el enum (un script, una migración de datos a mano, una fila
# insertada por SQL directo).
_ENUMS_A_RESTRINGIR: list[tuple[str, str, str, tuple[str, ...], bool]] = [
    ("auditoria", "accion", "tipo_evento_auditoria", (
        "crear", "editar", "eliminar", "cambio_estado", "pago",
        "ajuste_stock", "sesion", "cierre_caja", "observacion_pago",
    ), False),
    ("cierres_caja", "unidad_negocio", "unidad_negocio", ("imprenta", "gigantografias"), False),
    ("cierres_caja", "estado", "estado_cierre", ("cerrado", "congelado"), False),
    ("clientes", "tipo", "tipo_cliente", ("persona", "empresa"), False),
    ("materiales", "tipo_formato", "tipo_formato_material", (
        "continuo_rollo", "plancha_rigida", "unidad_pieza", "quimico_tinta",
    ), False),
    ("piezas_lote_material", "estado", "estado_pieza", ("disponible", "en_uso", "agotado"), False),
    ("movimientos_stock", "motivo", "motivo_movimiento", (
        "reserva", "liberacion", "merma", "devolucion", "ajuste_manual",
    ), False),
    ("ordenes", "tipo_documento", "tipo_documento", ("contrato", "proforma"), False),
    ("ordenes", "unidad_negocio", "unidad_negocio", ("imprenta", "gigantografias"), False),
    ("ordenes", "estado", "estado_orden", (
        "pendiente", "en_diseno", "aprobado", "en_produccion",
        "finalizada", "entregada", "cancelada",
    ), False),
    ("ordenes", "metodo_pago_adelanto", "metodo_pago", ("efectivo", "yape", "transferencia"), False),
    ("orden_pagos", "metodo", "metodo_pago", ("efectivo", "yape", "transferencia"), False),
    ("orden_pagos", "tipo", "tipo_pago", ("adelanto", "saldo"), False),
    ("orden_pagos", "estado_pago", "estado_pago", ("conforme", "observado", "anulado"), False),
    ("orden_pagos", "motivo_observacion", "motivo_observacion_pago", (
        "yape_falso", "billete_falso", "voucher_no_ubicado",
        "cobro_duplicado", "error_digitacion", "otro",
    ), True),
    ("productos", "tipo", "tipo_producto", ("propio", "servicio", "subcontratado"), False),
    ("usuarios", "rol", "rol_usuario", (
        "admin", "subgerente", "secretaria", "disenadora", "operario",
    ), False),
]

_INDICE_CODIGO_PIEZA = "ix_piezas_lote_material_codigo_identificador"
_CHECK_SALDO_PIEZA = "ck_piezas_lote_material_saldo_dentro_de_capacidad"


def _condicion(columna: str, valores: tuple[str, ...], admite_null: bool) -> str:
    lista = ", ".join(f"'{valor}'" for valor in valores)
    condicion = f"{columna} IN ({lista})"
    return f"{condicion} OR {columna} IS NULL" if admite_null else condicion


def upgrade() -> None:
    for tabla, columna, nombre, valores, admite_null in _ENUMS_A_RESTRINGIR:
        op.create_check_constraint(nombre, tabla, _condicion(columna, valores, admite_null))

    # El índice existente no era único: dos peticiones concurrentes podían
    # registrar el mismo código de rollo/plancha (el servicio solo lo
    # comprobaba con un SELECT antes del INSERT, que no cierra la carrera).
    op.drop_index(_INDICE_CODIGO_PIEZA, table_name='piezas_lote_material')
    op.create_index(
        _INDICE_CODIGO_PIEZA, 'piezas_lote_material', ['codigo_identificador'], unique=True,
    )

    # El saldo restante de un rollo/plancha no puede ser negativo ni superar
    # la capacidad con la que se registró; antes solo lo comprobaba el
    # servicio en Python.
    op.create_check_constraint(
        _CHECK_SALDO_PIEZA, 'piezas_lote_material',
        'saldo_restante >= 0 AND saldo_restante <= capacidad_inicial',
    )


def downgrade() -> None:
    op.drop_constraint(_CHECK_SALDO_PIEZA, 'piezas_lote_material', type_='check')

    op.drop_index(_INDICE_CODIGO_PIEZA, table_name='piezas_lote_material')
    op.create_index(
        _INDICE_CODIGO_PIEZA, 'piezas_lote_material', ['codigo_identificador'], unique=False,
    )

    for tabla, columna, nombre, valores, admite_null in reversed(_ENUMS_A_RESTRINGIR):
        op.drop_constraint(nombre, tabla, type_='check')
