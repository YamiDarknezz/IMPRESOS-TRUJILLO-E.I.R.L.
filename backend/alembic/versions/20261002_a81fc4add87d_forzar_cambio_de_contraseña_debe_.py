"""forzar cambio de contraseña debe cambiar password

Revision ID: a81fc4add87d
Revises: 54f23320c739
Create Date: 2026-10-02 02:26:57.370417

Issue #51: la contraseña que elige el administrador al crear una cuenta (o
la temporal de un restablecimiento) se fuerza a cambiar en el siguiente
ingreso. `server_default` porque usuarios ya es una tabla con filas: sin
esto, Postgres rechaza el ALTER TABLE en cuanto haya una sola cuenta
existente (column ... contains null values). Las cuentas ya existentes NO
quedan forzadas a cambiar su contraseña (False), solo las nuevas desde
`crear_usuario` y las restablecidas por un admin.
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a81fc4add87d'
down_revision: Union[str, None] = '54f23320c739'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        'usuarios',
        sa.Column('debe_cambiar_password', sa.Boolean(), server_default='false', nullable=False),
    )


def downgrade() -> None:
    op.drop_column('usuarios', 'debe_cambiar_password')
