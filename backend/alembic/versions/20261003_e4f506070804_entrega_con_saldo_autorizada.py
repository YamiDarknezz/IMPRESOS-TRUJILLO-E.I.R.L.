"""entrega con saldo autorizada por un supervisor (clientes corporativos)

Revision ID: e4f506070804
Revises: d3e4f5060703
Create Date: 2026-10-03 12:00:00.000000

Issue #72: a los clientes corporativos se les entrega el trabajo antes de que
paguen. La excepcion no puede ser silenciosa: queda quien la autorizo, cuando
y por que. `ordenes` ya tiene filas; las tres columnas admiten NULL o llevan
`server_default`, asi que las ordenes existentes quedan sin autorizacion.
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e4f506070804'
down_revision: Union[str, None] = 'd3e4f5060703'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('ordenes', sa.Column('entrega_autorizada_por', sa.Integer(), nullable=True))
    op.add_column(
        'ordenes', sa.Column('entrega_autorizada_en', sa.DateTime(timezone=True), nullable=True)
    )
    op.add_column(
        'ordenes',
        sa.Column('entrega_motivo', sa.String(length=200), server_default='', nullable=False),
    )
    op.create_foreign_key(
        'fk_ordenes_entrega_autorizada_por_usuarios',
        'ordenes', 'usuarios', ['entrega_autorizada_por'], ['id'],
    )


def downgrade() -> None:
    op.drop_constraint('fk_ordenes_entrega_autorizada_por_usuarios', 'ordenes', type_='foreignkey')
    op.drop_column('ordenes', 'entrega_motivo')
    op.drop_column('ordenes', 'entrega_autorizada_en')
    op.drop_column('ordenes', 'entrega_autorizada_por')
