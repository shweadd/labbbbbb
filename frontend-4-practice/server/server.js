// Имитационный сервер: плагин Vite, который перехватывает запросы /api/*
// и отвечает JSON из server/database.js.

import { today, weekdaySlots, weekendSlots, failDates } from './database.js';

// Задержка ответа в миллисекундах — имитация сети. 0 — мгновенно.
const DELAY_MS = 800;

function sendJson(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

function getToday() {
  if (today) return today;
  const now = new Date();
  return { day: now.getDate(), month: now.getMonth(), year: now.getFullYear() };
}

function handleToday(res) {
  sendJson(res, 200, getToday());
}

function handleSlots(url, res) {
  const day = Number(url.searchParams.get('day'));
  const month = Number(url.searchParams.get('month'));
  const year = Number(url.searchParams.get('year'));

  const date = new Date(year, month, day);
  const isValid =
    Number.isInteger(day) && Number.isInteger(month) && Number.isInteger(year) &&
    date.getDate() === day && date.getMonth() === month && date.getFullYear() === year;

  if (!isValid) {
    sendJson(res, 400, { error: 'Неверная дата. Нужны параметры day, month, year.' });
    return;
  }

  if (failDates.includes(`${day}.${month}.${year}`)) {
    sendJson(res, 500, { error: 'Внутренняя ошибка сервера' });
    return;
  }

  const weekDay = date.getDay();
  const isWeekend = weekDay === 0 || weekDay === 6;
  const slots = isWeekend ? weekendSlots : weekdaySlots;

  sendJson(res, 200, { date: { day, month, year }, slots });
}

export default function mockServer() {
  return {
    name: 'mock-server',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url.startsWith('/api/')) {
          next();
          return;
        }

        const url = new URL(req.url, 'http://localhost');

        setTimeout(() => {
          if (req.method !== 'GET') {
            sendJson(res, 405, { error: 'Метод не поддерживается' });
          } else if (url.pathname === '/api/booking/today') {
            handleToday(res);
          } else if (url.pathname === '/api/slots') {
            handleSlots(url, res);
          } else {
            sendJson(res, 404, { error: 'Не найдено' });
          }
        }, DELAY_MS);
      });
    },
  };
}
