# [Backend] Задание 4. Pydantic

Добавлены категории и услуги, Pydantic-модель `ServiceCreate` и `POST /services`.

## Файлы

- `schemas.py` — Pydantic-модели: `ServiceCreate`, `ServiceOut`, `MasterOut`
- `models.py` — SQLAlchemy-модели: `Master`, `Category`, `Service`
- `migrations/versions/0002_services.py` — миграция: таблицы `categories` и `services` + начальные данные
- `main.py` — FastAPI-приложение

## ServiceCreate

| Поле | Тип | Ограничения |
|---|---|---|
| categoryId | int | > 0, категория должна существовать (иначе 404) |
| title | str | не пустая, до 100 символов |
| desc | str | не пустая, до 100 символов |
| duration | int | минуты, от 30 до 180 (3 часа) |
| price | float | > 0 |

## Запуск

```
pip install -r requirements.txt
uvicorn main:app --reload
```

Миграции применяются при старте автоматически. Проверять удобно в http://127.0.0.1:8000/docs

## API

- `POST /services` — создать услугу: 201 при успехе, 422 при ошибке валидации
- `GET /services`, `GET /services?categoryId=3`, `GET /services/{id}`
- `GET /masters`, `GET /masters?specialization=...`, `GET /masters/{id}`
