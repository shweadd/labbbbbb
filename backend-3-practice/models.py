"""Задание 1. SQLAlchemy-модель Master и таблица masters."""

from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class Master(Base):
    __tablename__ = "masters"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    specialization: Mapped[str] = mapped_column(String(100), nullable=False, index=True)

    def __repr__(self) -> str:
        return f"Master(id={self.id}, name={self.name!r}, specialization={self.specialization!r})"
