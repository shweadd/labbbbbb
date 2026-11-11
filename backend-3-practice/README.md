# [Backend] Задание 3. SQLAlchemy и Alembic

Мастера салона хранятся в SQLite (`salon.db`), а не в Python-списке.

## Файлы

- `database.py` — подключение к SQLite, `Base`, сессии
- `models.py` — модель `Master`, таблица `masters` (id, name, specialization)
- `migrations/versions/0001_create_masters.py` — миграция Alembic: создаёт таблицу и добавляет мастеров
- `main.py` — FastAPI-приложение с API

## Запуск

```
pip install -r requirements.txt
uvicorn main:app --reload
```

При старте приложение само применяет миграции (`alembic upgrade head`).
Можно применить и вручную:

```
alembic upgrade head
```

## API

- `GET /masters` — все мастера
- `GET /masters?specialization=Парикмахер` — мастера указанной специализации
- `GET /masters/{master_id}` — один мастер, если не найден — `404 Not Found`

Проверка: http://127.0.0.1:8000/docs
