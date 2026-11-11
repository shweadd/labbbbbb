"""[Backend] Задание 3. Мастера в SQLite через SQLAlchemy.

Задание 2. API:
    GET /masters                              — все мастера
    GET /masters?specialization=Парикмахер    — мастера одной специализации
    GET /masters/{master_id}                  — один мастер, 404 если не найден
"""

from contextlib import asynccontextmanager
from pathlib import Path

from alembic import command
from alembic.config import Config
from fastapi import Depends, FastAPI, HTTPException
from pydantic import BaseModel, ConfigDict
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import BASE_DIR, get_db
from models import Master


def run_migrations() -> None:
    """Применяет миграции Alembic (создаёт таблицу masters, если её ещё нет)."""
    config = Config(str(Path(BASE_DIR) / "alembic.ini"))
    command.upgrade(config, "head")


@asynccontextmanager
async def lifespan(app: FastAPI):
    run_migrations()
    yield


app = FastAPI(title="Салон: мастера", lifespan=lifespan)


class MasterOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    specialization: str


@app.get("/masters", response_model=list[MasterOut])
def get_masters(specialization: str | None = None, db: Session = Depends(get_db)):
    """Список мастеров. Если передан specialization — только эта специализация."""
    query = select(Master).order_by(Master.id)
    if specialization:
        query = query.where(Master.specialization == specialization)
    return db.scalars(query).all()


@app.get("/masters/{master_id}", response_model=MasterOut)
def get_master(master_id: int, db: Session = Depends(get_db)):
    """Один мастер по id."""
    master = db.get(Master, master_id)
    if master is None:
        raise HTTPException(status_code=404, detail="Master not found")
    return master
