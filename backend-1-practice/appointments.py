"""[Backend] Задание 1.

Задание 1. Запись клиента — объект класса Appointment, а не словарь.
Задание 2. Записаться можно только в часы работы салона: с 08:00 до 20:00.
"""

from dataclasses import dataclass
from datetime import datetime, time as dt_time


# ===== Данные салона =====

@dataclass
class Master:
    master_id: int
    name: str


@dataclass
class Service:
    service_id: int
    name: str
    price: int


masters = [
    Master(1, "Дмитрий"),
    Master(2, "Артём"),
]

services = [
    Service(1, "Мужская стрижка", 1500),
    Service(2, "Стрижка бороды", 1000),
]


def get_master(master_id: int) -> Master | None:
    for master in masters:
        if master.master_id == master_id:
            return master
    return None


def get_service(service_id: int) -> Service | None:
    for service in services:
        if service.service_id == service_id:
            return service
    return None


# ===== Запись клиента =====

OPENING_TIME = dt_time(8, 0)   # салон открывается в 08:00
CLOSING_TIME = dt_time(20, 0)  # и закрывается в 20:00


class Appointment:
    """Запись клиента к мастеру на услугу."""

    def __init__(self, appointment_id: int, client_name: str,
                 master_id: int, service_id: int, time: str):
        self.id = appointment_id
        self.client_name = client_name
        self.master_id = master_id
        self.service_id = service_id
        self.time = time

    def __repr__(self) -> str:
        return (f"Appointment(id={self.id}, client_name={self.client_name!r}, "
                f"master_id={self.master_id}, service_id={self.service_id}, "
                f"time={self.time!r})")


appointments: list[Appointment] = []


def parse_time(value: str) -> dt_time | None:
    """Время в формате ЧЧ:ММ. Если формат неверный — None."""
    try:
        return datetime.strptime(value, "%H:%M").time()
    except (TypeError, ValueError):
        return None


def is_working_time(value: str) -> bool:
    """Задание 2: запись возможна только с 08:00 до 20:00.

    20:00 — время закрытия, поэтому последняя запись возможна раньше 20:00.
    """
    parsed = parse_time(value)
    if parsed is None:
        return False
    return OPENING_TIME <= parsed < CLOSING_TIME


def is_time_taken(value: str) -> bool:
    """Нельзя записать двух клиентов на одно и то же время."""
    return any(appointment.time == value for appointment in appointments)


def create_appointment(client_name: str,
                       master_id: int,
                       service_id: int,
                       time: str,
                       ) -> Appointment | None:
    # Задание 1: запись создаётся, только если заполнены все поля
    if not client_name or not client_name.strip():
        return None
    if master_id is None or service_id is None or not time:
        return None

    master = get_master(master_id)
    service = get_service(service_id)
    if master is None or service is None:
        return None

    # Задание 2: только в часы работы салона
    if not is_working_time(time):
        return None

    if is_time_taken(time):
        return None

    appointment = Appointment(
        appointment_id=len(appointments) + 1,
        client_name=client_name.strip(),
        master_id=master.master_id,
        service_id=service.service_id,
        time=time,
    )
    appointments.append(appointment)
    return appointment


# ===== Проверка =====

if __name__ == "__main__":
    # Задание 1, проверка 1: две корректные записи
    first_appointment = create_appointment("Иванова А.А.", 1, 1, '10:00')
    second_appointment = create_appointment("Петрова А.А.", 1, 1, '11:00')
    print("Список записей:")
    for appointment in appointments:
        print(appointment.client_name, appointment.time)

    # Задание 1, проверка 2: не заполнено имя — запись не создаётся
    appointments.clear()
    no_correct_appointment = create_appointment("", 1, 1, '12:00')
    print(len(appointments))

    # Задание 2, проверка 1: две записи в рабочее время
    appointments.clear()
    first_appointment = create_appointment("Иванова А.А.", 1, 1, '10:00')
    second_appointment = create_appointment("Петрова А.А.", 1, 1, '11:00')
    print("Список записей:")
    for appointment in appointments:
        print(appointment.client_name, appointment.time)

    # Задание 2, проверка 2: 00:00 — вне часов работы, запись не создаётся
    appointments.clear()
    no_correct_appointment = create_appointment("Сидорова А.А.", 1, 1, '00:00')
    print(len(appointments))
