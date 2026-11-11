// «База данных» имитационного сервера.
// Формат слота: { time, available }. Месяц 0-индексный (0 — январь).

// «Сегодня». null — брать текущую дату компьютера.
// Чтобы проверить другую дату, поставьте, например: { day: 17, month: 9, year: 2026 }
export const today = null;

// Будни (пн–пт): салон работает с 10:00 до 18:00
export const weekdaySlots = [
  { time: '10:00', available: true },
  { time: '11:00', available: false },
  { time: '12:00', available: true },
  { time: '13:00', available: false },
  { time: '14:00', available: true },
  { time: '15:00', available: true },
  { time: '16:00', available: true },
  { time: '17:00', available: true },
];

// Выходные (сб–вс): короткий день, мастеров меньше
export const weekendSlots = [
  { time: '11:00', available: true },
  { time: '12:00', available: false },
  { time: '13:00', available: false },
  { time: '14:00', available: true },
  { time: '15:00', available: false },
  { time: '16:00', available: true },
];

// Даты, на которые сервер отвечает ошибкой 500. Нужны, чтобы проверить
// сообщение об ошибке. Формат: 'день.месяц.год', месяц 0-индексный.
// Пример: '20.10.2026' — это 20 ноября 2026.
export const failDates = ['20.10.2026'];
