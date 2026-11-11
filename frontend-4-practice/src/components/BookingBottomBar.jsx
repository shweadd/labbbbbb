import { formatSelection } from '../data/date.js';

export default function BookingBottomBar({ selectedDay, selectedTime, onNext }) {
  const text = selectedDay ? formatSelection(selectedDay, selectedTime) : 'Выберите день и время';

  return (
    <div className="booking__bar">
      <p className="booking__summary">{text}</p>
      <button
        className="button"
        type="button"
        disabled={!selectedDay || !selectedTime}
        onClick={onNext}
      >
        Далее
      </button>
    </div>
  );
}
