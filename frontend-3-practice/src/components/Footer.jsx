export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__cols">
        <div className="footer__col">
          <a className="footer__logo" href="#">LOGO</a>
          <p className="footer__text">Дружелюбное описание услуг</p>
        </div>
        <div className="footer__col">
          <h3 className="footer__title">Контакты</h3>
          <ul className="footer__list">
            <li className="footer__item">
              <svg className="footer__icon" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M8 14.5s5-4.3 5-8.2A5 5 0 0 0 3 6.3c0 3.9 5 8.2 5 8.2Z" />
                <circle cx="8" cy="6.3" r="1.8" />
              </svg>
              ул. Садовая, 15, Москва
            </li>
            <li className="footer__item">
              <svg className="footer__icon" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3.5 2h2.2l1.1 2.8-1.4 1a7 7 0 0 0 3.3 3.3l1-1.4 2.8 1.1v2.2A1.5 1.5 0 0 1 11 12.5 9.5 9.5 0 0 1 2 3.5 1.5 1.5 0 0 1 3.5 2Z" />
              </svg>
              <a className="footer__link footer__link--phone" href="tel:+74951234567">+7 (495) 123-45-67</a>
            </li>
          </ul>
        </div>
        <div className="footer__col">
          <h3 className="footer__title">Режим работы</h3>
          <ul className="footer__list footer__list--hours">
            <li className="footer__hours">Пн–Пт: 9:00 – 21:00</li>
            <li className="footer__hours">Сб–Вс: 10:00 – 19:00</li>
          </ul>
        </div>
      </div>
      <div className="footer__bottom">
        <p className="footer__copy">© 2026. Все права защищены</p>
        <a className="footer__link" href="#">Политика конфиденциальности</a>
      </div>
    </footer>
  );
}
