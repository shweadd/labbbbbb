export const MONTHS_NOMINATIVE = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

export const MONTHS_GENITIVE = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];

// Индекс совпадает с Date.getDay(): 0 — воскресенье
export const DAYS_OF_WEEK = [
  'Воскресенье', 'Понедельник', 'Вторник', 'Среда',
  'Четверг', 'Пятница', 'Суббота',
];

export const WEEKDAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

// Сетка месяца: массив недель по 7 дней, неделя начинается с понедельника
export function buildCalendarGrid(year, month) {
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const weeksCount = Math.ceil((offset + daysInMonth) / 7);

  const weeks = [];
  for (let w = 0; w < weeksCount; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(year, month, 1 - offset + w * 7 + d);
      week.push({
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        isCurrentMonth: date.getMonth() === month,
      });
    }
    weeks.push(week);
  }
  return weeks;
}

// Сравнение дат без учета времени: -1, 0 или 1
export function compareDates(date1, date2) {
  const a = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()).getTime();
  const b = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate()).getTime();
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

export function isDateSelectable(day, month, year, today) {
  return compareDates(new Date(year, month, day), today) >= 0;
}

export function isSameDay(a, b) {
  return Boolean(a && b) && a.day === b.day && a.month === b.month && a.year === b.year;
}

// «Среда, 11 ноября 2026 • 14:00»
export function formatSelection(selectedDay, selectedTime) {
  const date = new Date(selectedDay.year, selectedDay.month, selectedDay.day);
  const text = `${DAYS_OF_WEEK[date.getDay()]}, ${selectedDay.day} ${MONTHS_GENITIVE[selectedDay.month]} ${selectedDay.year}`;
  return selectedTime ? `${text} • ${selectedTime}` : `${text} • выберите время`;
}
