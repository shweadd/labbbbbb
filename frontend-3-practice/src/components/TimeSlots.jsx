export default function TimeSlots({ slots, selectedTime, onTimeClick }) {
  const hasFree = slots.some((slot) => slot.available);

  return (
    <div className="slots">
      <h2 className="slots__title">Доступное время</h2>
      <div className="slots__grid">
        {hasFree ? (
          slots.map((slot) => {
            let className = 'slot';
            if (!slot.available) className += ' slot--busy';
            if (slot.time === selectedTime) className += ' slot--selected';

            return (
              <button
                key={slot.time}
                className={className}
                type="button"
                disabled={!slot.available}
                onClick={() => onTimeClick(slot.time)}
              >
                <span className="slot__time">{slot.time}</span>
                {!slot.available && <span className="slot__status">{slot.status}</span>}
              </button>
            );
          })
        ) : (
          <p className="slots__empty">На этот день свободного времени нет</p>
        )}
      </div>
    </div>
  );
}
