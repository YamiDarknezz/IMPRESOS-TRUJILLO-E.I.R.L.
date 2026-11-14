"""Último pronóstico IA y evaluación sin datos personales.

Revision ID: c8d9e0f1a2b3
Revises: b7c8d9e0f1a2
"""
from alembic import op
import sqlalchemy as sa

revision = "c8d9e0f1a2b3"
down_revision = "b7c8d9e0f1a2"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "pronosticos_ia",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("resultado", sa.JSON(), nullable=False),
        sa.Column("pronostico", sa.JSON(), nullable=True),
    )


def downgrade():
    op.drop_table("pronosticos_ia")
