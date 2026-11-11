// ===== Данные =====

const MONTHS_NOMINATIVE = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];

const MONTHS_GENITIVE = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];

// Индекс совпадает с Date.getDay(): 0 — воскресенье
const DAYS_OF_WEEK = [
  'Воскресенье', 'Понедельник', 'Вторник', 'Среда',
  'Четверг', 'Пятница', 'Суббота'
];

// Рабочие часы салона
const WORK_HOURS = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

// ===== Состояние =====

const state = {
  today: null,
  currentMonth: 0,
  currentYear: 0,
  selectedDay: null, // { day, month, year }
  selectedTime: null,
  slots: []
};

// ===== Чистые функции =====

// Сетка месяца: массив недель, в каждой 7 дней. Неделя начинается с понедельника.
// Дни соседних месяцев помечены isCurrentMonth: false.
function buildCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const offset = (firstDay.getDay() + 6) % 7; // сколько дней до понедельника
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
        isCurrentMonth: date.getMonth() === month
      });
    }
    weeks.push(week);
  }
  return weeks;
}

// Сравнение дат без учета времени: -1, 0 или 1
function compareDates(date1, date2) {
  const a = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()).getTime();
  const b = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate()).getTime();
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

// Можно ли выбрать день: не раньше сегодняшнего
function isDateSelectable(day, month, year, today) {
  return compareDates(new Date(year, month, day), today) >= 0;
}

function isSameDay(a, b) {
  return Boolean(a && b) && a.day === b.day && a.month === b.month && a.year === b.year;
}

// Слоты для дня. Занятость считается от даты, поэтому у каждого дня
// свой набор, и при повторном выборе дня он не меняется.
function getSlotsForDate(day, month, year, today) {
  const seed = day * 7 + month * 13 + year;
  const isToday = compareDates(new Date(year, month, day), today) === 0;

  return WORK_HOURS.map((time, index) => {
    const hour = parseInt(time, 10);
    const isPast = isToday && hour <= today.getHours();
    const isBusy = (seed + index * 5) % 4 === 0;
    let status = '';
    if (isPast) status = 'Прошло';
    else if (isBusy) status = 'Занято';
    return { time, available: status === '', status };
  });
}

// «Среда, 11 ноября 2026 • 14:00»
function formatSelection(selectedDay, selectedTime) {
  const date = new Date(selectedDay.year, selectedDay.month, selectedDay.day);
  const text = `${DAYS_OF_WEEK[date.getDay()]}, ${selectedDay.day} ${MONTHS_GENITIVE[selectedDay.month]} ${selectedDay.year}`;
  return selectedTime ? `${text} • ${selectedTime}` : `${text} • выберите время`;
}

// ===== Рендер =====

const elements = {};

function renderCalendar() {
  elements.month.textContent = `${MONTHS_NOMINATIVE[state.currentMonth]} ${state.currentYear}`;

  const weeks = buildCalendarGrid(state.currentYear, state.currentMonth);
  let html = '';

  weeks.forEach((week) => {
    week.forEach((cell) => {
      const selectable = cell.isCurrentMonth &&
        isDateSelectable(cell.day, cell.month, cell.year, state.today);
      const classes = ['calendar__day'];

      if (!selectable) classes.push('calendar__day--disabled');
      if (!cell.isCurrentMonth) classes.push('calendar__day--other');
      if (selectable && isSameDay(cell, state.selectedDay)) classes.push('calendar__day--selected');

      html += `<button class="${classes.join(' ')}" type="button"
        data-day="${cell.day}" data-month="${cell.month}" data-year="${cell.year}"
        ${selectable ? '' : 'disabled'}>${cell.day}</button>`;
    });
  });

  elements.days.innerHTML = html;

  // После innerHTML старые кнопки удалены, поэтому обработчики вешаем заново
  elements.days.querySelectorAll('.calendar__day:not(.calendar__day--disabled)').forEach((button) => {
    button.addEventListener('click', onDayClick);
  });

  updatePrevButton();
}

function renderTimeSlots() {
  if (!state.selectedDay) {
    elements.slots.innerHTML = '<p class="slots__empty">Выберите день в календаре</p>';
    return;
  }

  const freeCount = state.slots.filter((slot) => slot.available).length;
  if (freeCount === 0) {
    elements.slots.innerHTML = '<p class="slots__empty">На этот день свободного времени нет</p>';
    return;
  }

  let html = '';
  state.slots.forEach((slot) => {
    const classes = ['slot'];
    if (!slot.available) classes.push('slot--busy');
    if (slot.time === state.selectedTime) classes.push('slot--selected');

    html += `<button class="${classes.join(' ')}" type="button" data-time="${slot.time}"
      ${slot.available ? '' : 'disabled'}>
      <span class="slot__time">${slot.time}</span>
      ${slot.available ? '' : `<span class="slot__status">${slot.status}</span>`}
    </button>`;
  });

  elements.slots.innerHTML = html;

  elements.slots.querySelectorAll('.slot:not(.slot--busy)').forEach((button) => {
    button.addEventListener('click', onTimeSlotClick);
  });
}

function updateBottomBar() {
  if (!state.selectedDay) {
    elements.summary.textContent = 'Выберите день и время';
  } else {
    elements.summary.textContent = formatSelection(state.selectedDay, state.selectedTime);
  }
  elements.nextButton.disabled = !(state.selectedDay && state.selectedTime);
}

// Нельзя уйти в месяцы раньше текущего
function updatePrevButton() {
  const isCurrentMonth = state.currentYear === state.today.getFullYear() &&
    state.currentMonth === state.today.getMonth();
  elements.prevButton.disabled = isCurrentMonth;
}

// ===== Обработчики =====

function selectDay(day, month, year) {
  state.selectedDay = { day, month, year };
  state.selectedTime = null; // при смене дня время сбрасываем
  state.slots = getSlotsForDate(day, month, year, state.today);
}

function onDayClick(event) {
  const button = event.currentTarget;
  selectDay(
    Number(button.dataset.day),
    Number(button.dataset.month),
    Number(button.dataset.year)
  );
  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
}

function onTimeSlotClick(event) {
  state.selectedTime = event.currentTarget.dataset.time;
  renderTimeSlots();
  updateBottomBar();
}

function changeMonth(step) {
  const date = new Date(state.currentYear, state.currentMonth + step, 1);
  state.currentMonth = date.getMonth();
  state.currentYear = date.getFullYear();
  renderCalendar();
}

function setupMonthNavigation() {
  elements.prevButton.addEventListener('click', () => changeMonth(-1));
  elements.nextMonthButton.addEventListener('click', () => changeMonth(1));
}

function setupNextButton() {
  elements.nextButton.addEventListener('click', () => {
    if (!state.selectedDay || !state.selectedTime) return;
    alert(`Вы выбрали: ${formatSelection(state.selectedDay, state.selectedTime)}`);
  });
}

// ===== Инициализация =====

// Первый день, начиная с сегодняшнего, где есть свободное время
function findFirstAvailableDay(today) {
  for (let i = 0; i < 60; i++) {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    const slots = getSlotsForDate(date.getDate(), date.getMonth(), date.getFullYear(), today);
    if (slots.some((slot) => slot.available)) return date;
  }
  return today;
}

function init() {
  elements.month = document.querySelector('#calendar-month');
  elements.days = document.querySelector('#calendar-days');
  elements.slots = document.querySelector('#time-slots');
  elements.summary = document.querySelector('#booking-summary');
  elements.prevButton = document.querySelector('#prev-month');
  elements.nextMonthButton = document.querySelector('#next-month');
  elements.nextButton = document.querySelector('#next-button');

  state.today = new Date();

  // По умолчанию выбран ближайший день со свободным временем
  const first = findFirstAvailableDay(state.today);
  state.currentMonth = first.getMonth();
  state.currentYear = first.getFullYear();
  selectDay(first.getDate(), first.getMonth(), first.getFullYear());

  setupMonthNavigation();
  setupNextButton();

  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
}

document.addEventListener('DOMContentLoaded', init);
