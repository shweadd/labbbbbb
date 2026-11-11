export default function TimeSlots({ slots, isLoading, error, selectedTime, onTimeClick, onRetry }) {
  let content;

  if (isLoading) {
    content = <p className="slots__message">Загрузка слотов…</p>;
  } else if (error) {
    content = (
      <div className="slots__message slots__message--error">
        <p>Не удалось загрузить время: {error}</p>
        <button className="slots__retry" type="button" onClick={onRetry}>
          Попробовать снова
        </button>
      </div>
    );
  } else if (!slots.some((slot) => slot.available)) {
    content = <p className="slots__message">На этот день свободного времени нет</p>;
  } else {
    content = slots.map((slot) => {
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
          {!slot.available && <span className="slot__status">Занято</span>}
        </button>
      );
    });
  }

  return (
    <div className="slots">
      <h2 className="slots__title">Доступное время</h2>
      <div className="slots__grid">{content}</div>
    </div>
  );
}
