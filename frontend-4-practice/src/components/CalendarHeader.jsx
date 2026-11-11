import { MONTHS_NOMINATIVE } from '../data/date.js';

export default function CalendarHeader({ month, year, isPrevDisabled, onPrev, onNext }) {
  return (
    <div className="calendar__top">
      <h2 className="calendar__month">{MONTHS_NOMINATIVE[month]} {year}</h2>
      <div className="calendar__arrows">
        <button
          className="calendar__arrow"
          type="button"
          aria-label="Предыдущий месяц"
          disabled={isPrevDisabled}
          onClick={onPrev}
        >
          <svg className="calendar__arrow-icon" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M9 3.5 5.5 7 9 10.5" />
          </svg>
        </button>
        <button
          className="calendar__arrow"
          type="button"
          aria-label="Следующий месяц"
          onClick={onNext}
        >
          <svg className="calendar__arrow-icon" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M5 3.5 8.5 7 5 10.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
