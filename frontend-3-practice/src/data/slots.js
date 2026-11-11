import { compareDates } from './date.js';

export const WORK_HOURS = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

// Слоты для дня. Занятость считается от даты, поэтому у каждого дня свой набор.
export function getSlotsForDate(day, month, year, today) {
  const seed = day * 7 + month * 13 + year;
  const isToday = compareDates(new Date(year, month, day), today) === 0;

  return WORK_HOURS.map((time, index) => {
    const hour = parseInt(time, 10);
    let status = '';
    if (isToday && hour <= today.getHours()) status = 'Прошло';
    else if ((seed + index * 5) % 4 === 0) status = 'Занято';
    return { time, available: status === '', status };
  });
}

// Ближайший день, начиная с сегодняшнего, где есть свободное время
export function findFirstAvailableDay(today) {
  for (let i = 0; i < 60; i++) {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    const slots = getSlotsForDate(date.getDate(), date.getMonth(), date.getFullYear(), today);
    if (slots.some((slot) => slot.available)) return date;
  }
  return today;
}
