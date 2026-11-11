"""create categories and services tables

Revision ID: 0002
Revises: 0001
Create Date: 2026-11-11

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "0002"
down_revision: Union[str, None] = "0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    categories = op.create_table(
        "categories",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("name", sa.String(length=100), nullable=False),
    )

    services = op.create_table(
        "services",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("category_id", sa.Integer(), sa.ForeignKey("categories.id"), nullable=False),
        sa.Column("title", sa.String(length=100), nullable=False),
        sa.Column("description", sa.String(length=100), nullable=False),
        sa.Column("duration", sa.Integer(), nullable=False),
        sa.Column("price", sa.Numeric(10, 2, asdecimal=False), nullable=False),
    )
    op.create_index("ix_services_category_id", "services", ["category_id"])

    op.bulk_insert(
        categories,
        [
            {"id": 1, "name": "Стрижки и укладки"},
            {"id": 2, "name": "Маникюр и педикюр"},
            {"id": 3, "name": "Брови и ресницы"},
            {"id": 4, "name": "Спа-процедуры"},
        ],
    )

    op.bulk_insert(
        services,
        [
            {"id": 1, "category_id": 1, "title": "Мужская стрижка", "description": "Классика и современные формы", "duration": 45, "price": 1500},
            {"id": 2, "category_id": 1, "title": "Укладка", "description": "Укладка на любой случай", "duration": 30, "price": 700},
            {"id": 3, "category_id": 2, "title": "Маникюр", "description": "Обработка ногтей и кутикулы", "duration": 60, "price": 1200},
            {"id": 4, "category_id": 3, "title": "Коррекция бровей", "description": "Форма бровей под тип лица", "duration": 30, "price": 600},
            {"id": 5, "category_id": 4, "title": "Массаж головы", "description": "Расслабляющий массаж", "duration": 30, "price": 900},
        ],
    )


def downgrade() -> None:
    op.drop_index("ix_services_category_id", table_name="services")
    op.drop_table("services")
    op.drop_table("categories")
