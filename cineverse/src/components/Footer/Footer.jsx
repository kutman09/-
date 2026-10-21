// Компонент футера
import { Link, useNavigate } from 'react-router-dom';
import { ALL_GENRES } from '../../data/movies';

export default function Footer() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          {/* Бренд */}
          <div className="footer__brand-col">
            <div className="footer__brand">
              Cine<span>Verse</span>
            </div>
            <p className="footer__tagline">
              Ваш персональный онлайн-кинотеатр. Смотрите трейлеры, сохраняйте любимые фильмы
              и открывайте новые шедевры кино со всего мира.
            </p>
          </div>

          {/* Навигация */}
          <div>
            <div className="footer__col-title">Навигация</div>
            <div className="footer__links">
              <Link to="/" className="footer__link">Главная</Link>
              <Link to="/catalog" className="footer__link">Каталог фильмов</Link>
              <Link to="/favorites" className="footer__link">Избранное</Link>
              <Link to="/watchlist" className="footer__link">Смотреть позже</Link>
              <Link to="/search" className="footer__link">Поиск</Link>
            </div>
          </div>

          {/* Жанры */}
          <div>
            <div className="footer__col-title">Жанры</div>
            <div className="footer__links">
              {ALL_GENRES.slice(0, 6).map((genre) => (
                <button
                  key={genre}
                  className="footer__link"
                  onClick={() => navigate(`/catalog?genres=${encodeURIComponent(genre)}`)}
                  aria-label={`Перейти к жанру ${genre}`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          © {currentYear} CineVerse. Создано в образовательных целях. Все права на фильмы принадлежат их правообладателям.
        </div>
      </div>
    </footer>
  );
}
