import { WEEKDAYS_SHORT, buildCalendarGrid, isDateSelectable, isSameDay } from '../data/date.js';

export default function CalendarGrid({ month, year, today, selectedDay, onDayClick }) {
  const weeks = buildCalendarGrid(year, month);

  return (
    <>
      <div className="calendar__weekdays">
        {WEEKDAYS_SHORT.map((name) => (
          <span key={name} className="calendar__weekday">{name}</span>
        ))}
      </div>

      <div className="calendar__days">
        {weeks.map((week, weekIndex) =>
          week.map((cell, dayIndex) => {
            const selectable = cell.isCurrentMonth &&
              isDateSelectable(cell.day, cell.month, cell.year, today);

            let className = 'calendar__day';
            if (!selectable) className += ' calendar__day--disabled';
            if (!cell.isCurrentMonth) className += ' calendar__day--other';
            if (selectable && isSameDay(cell, selectedDay)) className += ' calendar__day--selected';

            return (
              <button
                key={`${weekIndex}-${dayIndex}`}
                className={className}
                type="button"
                disabled={!selectable}
                onClick={() => onDayClick(cell)}
              >
                {cell.day}
              </button>
            );
          })
        )}
      </div>
    </>
  );
}
