// Клиент запросов к имитационному серверу

async function request(url) {
  const response = await fetch(url);

  if (!response.ok) {
    let message = `Ошибка сервера (${response.status})`;
    try {
      const body = await response.json();
      if (body.error) message = `${body.error} (${response.status})`;
    } catch {
      // тело не JSON — оставляем общее сообщение
    }
    throw new Error(message);
  }

  return response.json();
}

// «Сегодня» с сервера: { day, month, year }
export function fetchToday() {
  return request('/api/booking/today');
}

// Слоты на дату: { date: { day, month, year }, slots: [{ time, available }] }
export function fetchSlots(date) {
  const params = new URLSearchParams({
    day: String(date.day),
    month: String(date.month),
    year: String(date.year),
  });
  return request(`/api/slots?${params}`);
}
