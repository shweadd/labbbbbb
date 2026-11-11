"""create masters table

Revision ID: 0001
Revises:
Create Date: 2026-11-11

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    masters = op.create_table(
        "masters",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("specialization", sa.String(length=100), nullable=False),
    )
    op.create_index("ix_masters_specialization", "masters", ["specialization"])

    # Начальные данные: мастера, которые раньше лежали в Python-списке
    op.bulk_insert(
        masters,
        [
            {"id": 1, "name": "Анна", "specialization": "Парикмахер"},
            {"id": 2, "name": "Мария", "specialization": "Визажист"},
            {"id": 3, "name": "Дмитрий", "specialization": "Барбер"},
            {"id": 4, "name": "Елена", "specialization": "Парикмахер"},
            {"id": 5, "name": "Ольга", "specialization": "Мастер маникюра"},
        ],
    )


def downgrade() -> None:
    op.drop_index("ix_masters_specialization", table_name="masters")
    op.drop_table("masters")
