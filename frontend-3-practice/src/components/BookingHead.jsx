export default function BookingHead({ title, subtitle }) {
  return (
    <div className="booking__head">
      <a className="booking__back" href="#">← Назад</a>
      <h1 className="booking__title">{title}</h1>
      <p className="booking__subtitle">{subtitle}</p>
    </div>
  );
}
