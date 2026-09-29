"""auditar tambien los intentos de login fallidos

Revision ID: 54f23320c739
Revises: 32f173bb76a5
Create Date: 2026-09-29 18:51:31.544458

Issue #43: agrega TipoEventoAuditoria.SESION_FALLIDA para que los intentos
de login rechazados dejen rastro en /auditoria (antes solo se registraban
los inicios de sesion correctos). El CHECK de auditoria.accion viene de
enum_columna() (native_enum=False + create_constraint=True): hay que
recrearlo con el valor nuevo, no basta con agregarlo al enum de Python.
"""
from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = '54f23320c739'
down_revision: Union[str, None] = '32f173bb76a5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

_NOMBRE_CHECK = "tipo_evento_auditoria"
_VALORES_ANTERIORES = (
    "crear", "editar", "eliminar", "cambio_estado", "pago",
    "ajuste_stock", "sesion", "cierre_caja", "observacion_pago",
)
_VALORES_NUEVOS = _VALORES_ANTERIORES + ("sesion_fallida",)


def _condicion(valores: tuple[str, ...]) -> str:
    lista = ", ".join(f"'{valor}'" for valor in valores)
    return f"accion IN ({lista})"


def upgrade() -> None:
    op.drop_constraint(_NOMBRE_CHECK, "auditoria", type_="check")
    op.create_check_constraint(_NOMBRE_CHECK, "auditoria", _condicion(_VALORES_NUEVOS))


def downgrade() -> None:
    # Si ya quedaron filas con accion='sesion_fallida', el CHECK anterior las
    # rechazaria: hay que borrarlas antes de poder volver a la version vieja.
    op.execute("DELETE FROM auditoria WHERE accion = 'sesion_fallida'")
    op.drop_constraint(_NOMBRE_CHECK, "auditoria", type_="check")
    op.create_check_constraint(_NOMBRE_CHECK, "auditoria", _condicion(_VALORES_ANTERIORES))
