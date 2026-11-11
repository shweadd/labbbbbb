"""[Backend] Задание 2. Категории услуг.

Запуск:
    pip install fastapi uvicorn
    uvicorn main:app --reload

Проверка в браузере:
    http://127.0.0.1:8000/categories
    http://127.0.0.1:8000/categories/1
    http://127.0.0.1:8000/categories/99   -> 404 Category not found
    http://127.0.0.1:8000/docs            -> документация Swagger
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="Барбершоп API")


# ===== Модели ответа =====

class Category(BaseModel):
    id: int
    name: str
    servicesCount: int


# ===== Данные =====

categories = [
    {"id": 1, "name": "Стрижки и укладки"},
    {"id": 2, "name": "Маникюр и педикюр"},
    {"id": 3, "name": "Брови и ресницы"},
    {"id": 4, "name": "Спа-процедуры"},
]

services = [
    {"id": 1, "name": "Мужская стрижка", "price": 1500, "category_id": 1},
    {"id": 2, "name": "Стрижка бороды", "price": 1000, "category_id": 1},
    {"id": 3, "name": "Комплекс стрижка + борода", "price": 2200, "category_id": 1},
    {"id": 4, "name": "Детская стрижка", "price": 900, "category_id": 1},
    {"id": 5, "name": "Укладка", "price": 700, "category_id": 1},
    {"id": 6, "name": "Мужской маникюр", "price": 1200, "category_id": 2},
    {"id": 7, "name": "Мужской педикюр", "price": 1800, "category_id": 2},
    {"id": 8, "name": "Покрытие лаком", "price": 600, "category_id": 2},
    {"id": 9, "name": "Парафинотерапия рук", "price": 800, "category_id": 2},
    {"id": 10, "name": "Обработка кутикулы", "price": 500, "category_id": 2},
    {"id": 11, "name": "Коррекция бровей", "price": 600, "category_id": 3},
    {"id": 12, "name": "Окрашивание бровей", "price": 700, "category_id": 3},
    {"id": 13, "name": "Окрашивание ресниц", "price": 700, "category_id": 3},
    {"id": 14, "name": "Ламинирование бровей", "price": 1500, "category_id": 3},
    {"id": 15, "name": "Королевское бритьё", "price": 1800, "category_id": 4},
    {"id": 16, "name": "Уход за кожей лица", "price": 2000, "category_id": 4},
    {"id": 17, "name": "Массаж головы", "price": 900, "category_id": 4},
    {"id": 18, "name": "Камуфляж седины", "price": 1600, "category_id": 4},
]


# ===== Функции =====

def count_services(category_id: int) -> int:
    """Сколько услуг в категории."""
    return sum(1 for service in services if service["category_id"] == category_id)


def to_category(category: dict) -> Category:
    return Category(
        id=category["id"],
        name=category["name"],
        servicesCount=count_services(category["id"]),
    )


# ===== Endpoint'ы =====

@app.get("/categories", response_model=list[Category])
def get_categories():
    """Задание 1. Список всех категорий с количеством услуг."""
    return [to_category(category) for category in categories]


@app.get("/categories/{category_id}", response_model=Category)
def get_category(category_id: int):
    """Задание 2. Информация о конкретной категории."""
    for category in categories:
        if category["id"] == category_id:
            return to_category(category)
    raise HTTPException(status_code=404, detail="Category not found")
