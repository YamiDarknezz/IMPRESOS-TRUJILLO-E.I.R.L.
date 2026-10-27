"""el rollo de cada material de la orden y los cortes que la orden descuenta sola

Revision ID: b7c8d9e0f1a2
Revises: f50607080905
Create Date: 2026-10-10 12:00:00.000000

Issue #127: al crear una orden con un material de rollo se elige el rollo y se le
descuentan los metros, sin ir a registrar el corte a mano en Inventario.

- `orden_materiales.pieza_id`: de que rollo o plancha sale esa linea (opcional).
- `consumos_pieza.automatico`: el corte lo creo la orden sola. Solo esos se ajustan
  o se devuelven al editar, cancelar o completar la orden; los manuales no se tocan.
  Los cortes que ya existen quedan como manuales (`server_default` false).
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b7c8d9e0f1a2'
down_revision: Union[str, None] = 'f50607080905'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('orden_materiales', sa.Column('pieza_id', sa.Integer(), nullable=True))
    op.create_foreign_key(
        'fk_orden_materiales_pieza_id', 'orden_materiales', 'piezas_lote_material',
        ['pieza_id'], ['id'],
    )
    op.create_index('ix_orden_materiales_pieza_id', 'orden_materiales', ['pieza_id'])
    op.add_column(
        'consumos_pieza',
        sa.Column('automatico', sa.Boolean(), server_default=sa.false(), nullable=False),
    )


def downgrade() -> None:
    op.drop_column('consumos_pieza', 'automatico')
    op.drop_index('ix_orden_materiales_pieza_id', table_name='orden_materiales')
    op.drop_constraint('fk_orden_materiales_pieza_id', 'orden_materiales', type_='foreignkey')
    op.drop_column('orden_materiales', 'pieza_id')
