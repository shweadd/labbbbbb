import { useState } from 'react';
import Header from './components/Header.jsx';
import Steps from './components/Steps.jsx';
import BookingHead from './components/BookingHead.jsx';
import CalendarHeader from './components/CalendarHeader.jsx';
import CalendarGrid from './components/CalendarGrid.jsx';
import TimeSlots from './components/TimeSlots.jsx';
import BookingBottomBar from './components/BookingBottomBar.jsx';
import Footer from './components/Footer.jsx';
import { formatSelection } from './data/date.js';
import { getSlotsForDate, findFirstAvailableDay } from './data/slots.js';

const today = new Date();
const firstDay = findFirstAvailableDay(today);

export default function App() {
  const [currentMonth, setCurrentMonth] = useState(firstDay.getMonth());
  const [currentYear, setCurrentYear] = useState(firstDay.getFullYear());
  const [selectedDay, setSelectedDay] = useState({
    day: firstDay.getDate(),
    month: firstDay.getMonth(),
    year: firstDay.getFullYear(),
  });
  const [selectedTime, setSelectedTime] = useState(null);
  const [slots, setSlots] = useState(() =>
    getSlotsForDate(firstDay.getDate(), firstDay.getMonth(), firstDay.getFullYear(), today)
  );

  function handleDayClick(cell) {
    setSelectedDay({ day: cell.day, month: cell.month, year: cell.year });
    setSelectedTime(null); // при смене дня время сбрасываем
    setSlots(getSlotsForDate(cell.day, cell.month, cell.year, today));
  }

  function handleTimeClick(time) {
    setSelectedTime(time);
  }

  function changeMonth(step) {
    const date = new Date(currentYear, currentMonth + step, 1);
    setCurrentMonth(date.getMonth());
    setCurrentYear(date.getFullYear());
  }

  function handleNext() {
    alert(`Вы выбрали: ${formatSelection(selectedDay, selectedTime)}`);
  }

  // Раньше текущего месяца листать нельзя
  const isPrevDisabled =
    currentYear === today.getFullYear() && currentMonth === today.getMonth();

  return (
    <div className="page">
      <Header />

      <main className="main">
        <Steps activeStep={3} />

        <section className="booking">
          <BookingHead
            title="Выберите дату и время"
            subtitle="Комплекс стрижка + борода · Дмитрий"
          />

          <div className="booking__content">
            <div className="calendar">
              <CalendarHeader
                month={currentMonth}
                year={currentYear}
                isPrevDisabled={isPrevDisabled}
                onPrev={() => changeMonth(-1)}
                onNext={() => changeMonth(1)}
              />
              <CalendarGrid
                month={currentMonth}
                year={currentYear}
                today={today}
                selectedDay={selectedDay}
                onDayClick={handleDayClick}
              />
            </div>

            <TimeSlots
              slots={slots}
              selectedTime={selectedTime}
              onTimeClick={handleTimeClick}
            />
          </div>

          <BookingBottomBar
            selectedDay={selectedDay}
            selectedTime={selectedTime}
            onNext={handleNext}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
