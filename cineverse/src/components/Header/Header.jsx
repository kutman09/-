// Компонент шапки сайта
import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useFavorites } from '../../context/FavoritesContext';
import SearchBar from '../SearchBar/SearchBar';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { favorites, watchlist } = useFavorites();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Слежение за скроллом для тени шапки
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Закрытие бургер-меню при клике по ссылке
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header__inner">
        {/* Логотип */}
        <Link to="/" className="header__logo" aria-label="CineVerse — на главную" onClick={closeMenu}>
          Cine<span>Verse</span>
        </Link>

        {/* Навигация */}
        <nav className={`header__nav ${menuOpen ? 'open' : ''}`} aria-label="Основная навигация">
          <NavLink to="/" end className={({ isActive }) => `header__nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
            🏠 Главная
          </NavLink>

          <NavLink to="/catalog" className={({ isActive }) => `header__nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
            🎬 Каталог
          </NavLink>

          <NavLink to="/favorites" className={({ isActive }) => `header__nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
            ❤️ Избранное
            {favorites.length > 0 && (
              <span className="header__nav-badge" aria-label={`${favorites.length} фильмов в избранном`}>
                {favorites.length}
              </span>
            )}
          </NavLink>

          <NavLink to="/watchlist" className={({ isActive }) => `header__nav-link ${isActive ? 'active' : ''}`} onClick={closeMenu}>
            🕒 Смотреть позже
            {watchlist.length > 0 && (
              <span className="header__nav-badge" aria-label={`${watchlist.length} фильмов в списке`}>
                {watchlist.length}
              </span>
            )}
          </NavLink>

          {/* Поиск в мобильном меню (показывается только при открытом бургере) */}
          <div className="header__mobile-search">
            <SearchBar onClose={closeMenu} />
          </div>
        </nav>

        <div className="header__actions">
          {/* Поисковая строка — только на десктопе */}
          <div className="header__nav-search">
            <SearchBar onClose={closeMenu} />
          </div>

          {/* Переключатель темы */}
          <button
            className="header__theme-btn"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на тёмную тему'}
            title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Бургер-меню (только на мобильных) */}
          <button
            className={`header__burger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}
