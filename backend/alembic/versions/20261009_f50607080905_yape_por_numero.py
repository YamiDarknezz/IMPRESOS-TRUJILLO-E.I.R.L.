"""un metodo de pago por cada numero de Yape y su columna en el cierre de caja

Revision ID: f50607080905
Revises: e4f506070804
Create Date: 2026-10-09 20:00:00.000000

Issue #125: el negocio tiene dos numeros de Yape (Marcell y Angel) y necesita
saber a cual entro cada pago. Los metodos pasan de tres a cinco valores:
`yape_marcell` y `yape_angel` son los nuevos y `yape` queda solo para leer los
pagos anteriores, que no dicen a que numero entraron.

`ordenes.metodo_pago_adelanto` y `orden_pagos.metodo` son VARCHAR con un CHECK
(ver `agregar_invariantes_de_esquema`): un valor nuevo hace fallar el INSERT
hasta que el CHECK se amplie. `cierres_caja` ya tiene filas, asi que las
columnas nuevas llevan `server_default` 0.

El downgrade no puede dejar filas con valores que el CHECK anterior no admite:
primero las pasa a `yape` y suma a `monto_yape` lo de las columnas que se van,
para que el total de cada cierre siga siendo el mismo.
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f50607080905'
down_revision: Union[str, None] = 'e4f506070804'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


_NOMBRE_CHECK = "metodo_pago"
_COLUMNAS = (("ordenes", "metodo_pago_adelanto"), ("orden_pagos", "metodo"))

_ANTERIORES = ("efectivo", "yape", "transferencia")
_NUEVOS = ("yape_marcell", "yape_angel")
_TODOS = ("efectivo", "yape_marcell", "yape_angel", "transferencia", "yape")


def _condicion(columna: str, valores: tuple[str, ...]) -> str:
    lista = ", ".join(f"'{valor}'" for valor in valores)
    return f"{columna} IN ({lista})"


def _reemplazar_check(valores: tuple[str, ...]) -> None:
    for tabla, columna in _COLUMNAS:
        op.drop_constraint(_NOMBRE_CHECK, tabla, type_='check')
        op.create_check_constraint(_NOMBRE_CHECK, tabla, _condicion(columna, valores))


def upgrade() -> None:
    _reemplazar_check(_TODOS)
    for columna in ('monto_yape_marcell', 'monto_yape_angel'):
        op.add_column(
            'cierres_caja',
            sa.Column(columna, sa.Numeric(12, 2), server_default='0', nullable=False),
        )


def downgrade() -> None:
    # Sin esto, restaurar el CHECK anterior fallaria sobre cualquier base que ya
    # haya registrado un pago con los metodos nuevos (el mismo error que #64).
    valores_nuevos = ", ".join(f"'{valor}'" for valor in _NUEVOS)
    for tabla, columna in _COLUMNAS:
        op.execute(f"UPDATE {tabla} SET {columna} = 'yape' WHERE {columna} IN ({valores_nuevos})")

    op.execute(
        "UPDATE cierres_caja SET monto_yape = monto_yape + monto_yape_marcell + monto_yape_angel"
    )
    op.drop_column('cierres_caja', 'monto_yape_angel')
    op.drop_column('cierres_caja', 'monto_yape_marcell')

    _reemplazar_check(_ANTERIORES)
