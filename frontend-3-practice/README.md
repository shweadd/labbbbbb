# Задание 3. Основы React

Страница «Выбор даты и времени» из заданий 1 и 2, переписанная на React.

## Запуск

```
npm install
npm run dev
```

Откройте адрес, который напишет Vite.

## Структура

- `src/main.jsx` — точка входа
- `src/App.jsx` — страница записи: состояние и обработчики
- `src/components/` — компоненты: Header, Steps, BookingHead, CalendarHeader, CalendarGrid, TimeSlots, BookingBottomBar, Footer
- `src/data/date.js` — чистые функции для работы с датами
- `src/data/slots.js` — данные слотов времени
- `src/styles/styles.css` — стили из вёрстки
- `src/index.css` — базовый сброс стилей
