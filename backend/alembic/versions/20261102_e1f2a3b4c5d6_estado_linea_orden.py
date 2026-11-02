"""estado de producción independiente por línea

Revision ID: e1f2a3b4c5d6
Revises: c8d9e0f1a2b3
"""
from alembic import op
import sqlalchemy as sa

revision = "e1f2a3b4c5d6"
down_revision = "c8d9e0f1a2b3"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("orden_items", sa.Column("estado_produccion", sa.String(20), nullable=True))


def downgrade():
    op.drop_column("orden_items", "estado_produccion")
