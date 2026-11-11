"""[Backend] Задание 4. Pydantic-модель ServiceCreate и POST /services."""

from contextlib import asynccontextmanager
from pathlib import Path

from alembic import command
from alembic.config import Config
from fastapi import Depends, FastAPI, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import BASE_DIR, get_db
from models import Category, Master, Service
from schemas import MasterOut, ServiceCreate, ServiceOut


def run_migrations() -> None:
    """Применяет миграции Alembic при старте приложения."""
    config = Config(str(Path(BASE_DIR) / "alembic.ini"))
    command.upgrade(config, "head")


@asynccontextmanager
async def lifespan(app: FastAPI):
    run_migrations()
    yield


app = FastAPI(title="Салон: услуги и мастера", lifespan=lifespan)


def to_service_out(service: Service) -> ServiceOut:
    return ServiceOut(
        id=service.id,
        categoryId=service.category_id,
        title=service.title,
        desc=service.description,
        duration=service.duration,
        price=service.price,
    )


# ===== Услуги =====

@app.post("/services", response_model=ServiceOut, status_code=status.HTTP_201_CREATED)
def create_service(data: ServiceCreate, db: Session = Depends(get_db)):
    """Задание 2. Создать услугу. Некорректное тело → 422 (проверяет Pydantic)."""
    if db.get(Category, data.categoryId) is None:
        raise HTTPException(status_code=404, detail="Category not found")

    service = Service(
        category_id=data.categoryId,
        title=data.title,
        description=data.desc,
        duration=data.duration,
        price=data.price,
    )
    db.add(service)
    db.commit()
    db.refresh(service)
    return to_service_out(service)


@app.get("/services", response_model=list[ServiceOut])
def get_services(categoryId: int | None = None, db: Session = Depends(get_db)):
    """Список услуг, можно отфильтровать по категории."""
    query = select(Service).order_by(Service.id)
    if categoryId is not None:
        query = query.where(Service.category_id == categoryId)
    return [to_service_out(service) for service in db.scalars(query)]


@app.get("/services/{service_id}", response_model=ServiceOut)
def get_service(service_id: int, db: Session = Depends(get_db)):
    service = db.get(Service, service_id)
    if service is None:
        raise HTTPException(status_code=404, detail="Service not found")
    return to_service_out(service)


# ===== Мастера (из задания 3) =====

@app.get("/masters", response_model=list[MasterOut])
def get_masters(specialization: str | None = None, db: Session = Depends(get_db)):
    query = select(Master).order_by(Master.id)
    if specialization:
        query = query.where(Master.specialization == specialization)
    return db.scalars(query).all()


@app.get("/masters/{master_id}", response_model=MasterOut)
def get_master(master_id: int, db: Session = Depends(get_db)):
    master = db.get(Master, master_id)
    if master is None:
        raise HTTPException(status_code=404, detail="Master not found")
    return master
