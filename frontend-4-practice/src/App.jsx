import { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import Steps from './components/Steps.jsx';
import BookingHead from './components/BookingHead.jsx';
import CalendarHeader from './components/CalendarHeader.jsx';
import CalendarGrid from './components/CalendarGrid.jsx';
import TimeSlots from './components/TimeSlots.jsx';
import BookingBottomBar from './components/BookingBottomBar.jsx';
import Footer from './components/Footer.jsx';
import { formatSelection, isSameDay } from './data/date.js';
import { fetchToday, fetchSlots } from './api.js';

export default function App() {
  // «Сегодня» с сервера
  const [today, setToday] = useState(null);
  const [todayLoading, setTodayLoading] = useState(true);
  const [todayError, setTodayError] = useState(null);
  const [todayRequest, setTodayRequest] = useState(0);

  // Календарь и выбор
  const [currentMonth, setCurrentMonth] = useState(0);
  const [currentYear, setCurrentYear] = useState(0);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // Слоты с сервера
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState(null);
  const [slotsRequest, setSlotsRequest] = useState(0);

  // 1. При открытии страницы загружаем «сегодня»
  useEffect(() => {
    let ignore = false;
    setTodayLoading(true);
    setTodayError(null);

    fetchToday()
      .then((data) => {
        if (ignore) return;
        setToday(new Date(data.year, data.month, data.day));
        setCurrentMonth(data.month);
        setCurrentYear(data.year);
        setSelectedDay({ day: data.day, month: data.month, year: data.year });
      })
      .catch((error) => {
        if (!ignore) setTodayError(error.message);
      })
      .finally(() => {
        if (!ignore) setTodayLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [todayRequest]);

  // 2. При смене выбранного дня загружаем его слоты
  useEffect(() => {
    if (!selectedDay) return;

    let ignore = false;
    setSlotsLoading(true);
    setSlotsError(null);
    setSlots([]);

    fetchSlots(selectedDay)
      .then((data) => {
        // Защита от гонок: ответ должен быть про тот день, который выбран сейчас
        if (ignore || !isSameDay(data.date, selectedDay)) return;
        setSlots(data.slots);
      })
      .catch((error) => {
        if (!ignore) setSlotsError(error.message);
      })
      .finally(() => {
        if (!ignore) setSlotsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [selectedDay, slotsRequest]);

  function handleDayClick(cell) {
    if (isSameDay(cell, selectedDay)) return; // тот же день — повторный запрос не нужен
    setSelectedDay({ day: cell.day, month: cell.month, year: cell.year });
    setSelectedTime(null); // при смене дня время сбрасываем
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

  let bookingContent;

  if (todayLoading) {
    bookingContent = <p className="booking__message">Загрузка…</p>;
  } else if (todayError) {
    bookingContent = (
      <div className="booking__message booking__message--error">
        <p>Не удалось загрузить календарь: {todayError}</p>
        <button className="slots__retry" type="button" onClick={() => setTodayRequest((n) => n + 1)}>
          Попробовать снова
        </button>
      </div>
    );
  } else {
    // Раньше текущего месяца листать нельзя
    const isPrevDisabled =
      currentYear === today.getFullYear() && currentMonth === today.getMonth();

    bookingContent = (
      <>
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
            isLoading={slotsLoading}
            error={slotsError}
            selectedTime={selectedTime}
            onTimeClick={handleTimeClick}
            onRetry={() => setSlotsRequest((n) => n + 1)}
          />
        </div>

        <BookingBottomBar
          selectedDay={selectedDay}
          selectedTime={selectedTime}
          onNext={handleNext}
        />
      </>
    );
  }

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
          {bookingContent}
        </section>
      </main>

      <Footer />
    </div>
  );
}
