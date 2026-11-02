"""Distingue precios con impuesto incluido de las órdenes anteriores.

Revision ID: f2a3b4c5d6e7
Revises: e1f2a3b4c5d6
"""
from alembic import op
import sqlalchemy as sa

revision = "f2a3b4c5d6e7"
down_revision = "e1f2a3b4c5d6"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("ordenes", sa.Column("precio_incluye_igv", sa.Boolean(), nullable=False, server_default=sa.false()))
    op.alter_column("ordenes", "precio_incluye_igv", server_default=sa.true())


def downgrade():
    op.drop_column("ordenes", "precio_incluye_igv")
