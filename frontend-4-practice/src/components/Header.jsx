const NAV_LINKS = ['Услуги', 'Галерея', 'Команда', 'Отзывы', 'Контакты'];

export default function Header() {
  return (
    <header className="header">
      <a className="header__logo" href="#">LOGO</a>
      <nav className="header__nav">
        {NAV_LINKS.map((link) => (
          <a
            key={link}
            className={link === 'Команда' ? 'header__link header__link--active' : 'header__link'}
            href="#"
          >
            {link}
          </a>
        ))}
      </nav>
    </header>
  );
}
