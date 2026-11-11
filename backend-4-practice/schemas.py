"""Pydantic-модели (схемы) запросов и ответов."""

from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field, StringConstraints

# Строка не может быть пустой (пробелы тоже не считаются), максимум 100 символов
NonEmptyStr100 = Annotated[
    str,
    StringConstraints(strip_whitespace=True, min_length=1, max_length=100),
]


class ServiceCreate(BaseModel):
    """Задание 1. Данные для создания услуги."""

    model_config = ConfigDict(extra="forbid")

    categoryId: int = Field(gt=0, description="Идентификатор категории")
    title: NonEmptyStr100 = Field(description="Название услуги")
    desc: NonEmptyStr100 = Field(description="Описание услуги")
    duration: int = Field(ge=30, le=180, description="Продолжительность в минутах: от 30 минут до 3 часов")
    price: float = Field(gt=0, description="Стоимость, больше 0")


class ServiceOut(BaseModel):
    """Услуга в ответе API."""

    id: int
    categoryId: int
    title: str
    desc: str
    duration: int
    price: float


class MasterOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    specialization: str
