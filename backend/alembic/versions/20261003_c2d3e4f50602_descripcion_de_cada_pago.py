"""descripcion de cada pago (para que fue el adelanto o el abono)

Revision ID: c2d3e4f50602
Revises: b1c2d3e4f501
Create Date: 2026-10-03 10:00:00.000000

Issue #110: el cliente quiere poner una descripcion a cada adelanto y ver la
secuencia de pagos sin abrir WhatsApp. `orden_pagos` ya tiene filas, asi que
la columna lleva `server_default` vacio: sin el, PostgreSQL rechaza el ALTER.
Los pagos existentes quedan sin descripcion.
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c2d3e4f50602'
down_revision: Union[str, None] = 'b1c2d3e4f501'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        'orden_pagos',
        sa.Column('descripcion', sa.String(length=200), server_default='', nullable=False),
    )


def downgrade() -> None:
    op.drop_column('orden_pagos', 'descripcion')
