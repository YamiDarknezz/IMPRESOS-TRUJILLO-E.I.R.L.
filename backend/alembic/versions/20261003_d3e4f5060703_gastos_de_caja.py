"""gastos de caja y monto de gastos en el cierre

Revision ID: d3e4f5060703
Revises: c2d3e4f50602
Create Date: 2026-10-03 11:00:00.000000

Issue #112: el negocio anota cada dia lo que gasto (tinta, papel, banner...) y
el sistema no lo registraba, asi que el arqueo nunca cuadraba con el cuaderno.
`cierres_caja` ya tiene filas: la columna nueva lleva `server_default` 0 (los
cierres anteriores quedan sin gastos).
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd3e4f5060703'
down_revision: Union[str, None] = 'c2d3e4f50602'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'gastos_caja',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('fecha', sa.Date(), nullable=False),
        sa.Column(
            'unidad_negocio',
            sa.Enum('imprenta', 'gigantografias', name='unidad_negocio', native_enum=False,
                    length=20, create_constraint=True),
            nullable=False,
        ),
        sa.Column('monto', sa.Numeric(12, 2), nullable=False),
        sa.Column('motivo', sa.String(length=200), nullable=False),
        sa.Column('registrado_por', sa.Integer(), nullable=False),
        sa.Column('creado_en', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('actualizado_en', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.CheckConstraint('monto > 0', name='gasto_caja_monto_positivo'),
        sa.ForeignKeyConstraint(['registrado_por'], ['usuarios.id']),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_gastos_caja_fecha', 'gastos_caja', ['fecha'])
    op.add_column(
        'cierres_caja',
        sa.Column('monto_gastos', sa.Numeric(12, 2), server_default='0', nullable=False),
    )


def downgrade() -> None:
    op.drop_column('cierres_caja', 'monto_gastos')
    op.drop_index('ix_gastos_caja_fecha', table_name='gastos_caja')
    op.drop_table('gastos_caja')
