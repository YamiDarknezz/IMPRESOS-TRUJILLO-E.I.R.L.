"""canal de ingreso de la orden (WhatsApp, llamada, presencial, correo, otro)

Revision ID: b1c2d3e4f501
Revises: 90f2390af0cb
Create Date: 2026-10-03 09:00:00.000000

Issue #69: el cliente pidió saber por qué vía llegó cada pedido. `ordenes` ya
tiene filas, así que la columna lleva `server_default`: sin él, PostgreSQL
rechaza el ALTER TABLE. Las órdenes existentes quedan como "otro" (no se sabe
por dónde entraron); reconstruirlo ya no es posible, por eso conviene que
este campo exista cuanto antes.
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b1c2d3e4f501'
down_revision: Union[str, None] = '90f2390af0cb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

CANALES = ('whatsapp', 'llamada', 'presencial', 'correo', 'otro')


def upgrade() -> None:
    op.add_column(
        'ordenes',
        sa.Column(
            'canal_ingreso',
            sa.Enum(*CANALES, name='canal_ingreso', native_enum=False, length=15,
                    create_constraint=True),
            server_default='otro',
            nullable=False,
        ),
    )


def downgrade() -> None:
    op.drop_column('ordenes', 'canal_ingreso')
