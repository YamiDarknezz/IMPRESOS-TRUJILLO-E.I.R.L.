"""comprobantes de pago rf-11

Revision ID: 90f2390af0cb
Revises: a81fc4add87d
Create Date: 2026-10-02 09:49:30.861654

Issue #67: capturas de Yape o transferencia adjuntas a una orden o a uno de
sus pagos. Lo que se guarda no es la ruta del archivo sino su `clave`, la
referencia con la que vive en el almacén configurado (hoy una carpeta del
disco de datos, mañana un bucket S3): así mover las imágenes a Cloudflare no
obliga a tocar ninguna fila.

`pago_id` es nulo cuando la captura respalda el adelanto acordado al crear la
orden, y apunta al abono concreto en los cobros posteriores. Las dos claves
foráneas borran en cascada: si se anula un pago o se elimina la orden, sus
capturas no quedan huérfanas.
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '90f2390af0cb'
down_revision: Union[str, None] = 'a81fc4add87d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'comprobantes',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('orden_id', sa.Integer(), nullable=False),
        sa.Column('pago_id', sa.Integer(), nullable=True),
        sa.Column('clave', sa.String(length=80), nullable=False),
        sa.Column('nombre_original', sa.String(length=200), nullable=False),
        sa.Column('tipo_mime', sa.String(length=60), nullable=False),
        sa.Column('tamano_bytes', sa.Integer(), nullable=False),
        sa.Column('subido_por', sa.Integer(), nullable=True),
        sa.Column('creado_en', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('actualizado_en', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.ForeignKeyConstraint(['orden_id'], ['ordenes.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['pago_id'], ['orden_pagos.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['subido_por'], ['usuarios.id']),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('clave'),
    )
    op.create_index(op.f('ix_comprobantes_orden_id'), 'comprobantes', ['orden_id'], unique=False)
    op.create_index(op.f('ix_comprobantes_pago_id'), 'comprobantes', ['pago_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_comprobantes_pago_id'), table_name='comprobantes')
    op.drop_index(op.f('ix_comprobantes_orden_id'), table_name='comprobantes')
    op.drop_table('comprobantes')
