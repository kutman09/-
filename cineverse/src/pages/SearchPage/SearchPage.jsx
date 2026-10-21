// Страница поиска с подсветкой совпадений
import { useSearchParams, Link } from 'react-router-dom';
import { movies } from '../../data/movies';
import { highlightText, pluralMovies } from '../../utils/helpers';
import MovieCard from '../../components/MovieCard/MovieCard';
import Footer from '../../components/Footer/Footer';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  // Поиск по названию, оригинальному названию, режиссёру и актёрам
  const results = query.length >= 2
    ? movies.filter((m) => {
        const q = query.toLowerCase();
        return (
          m.title.toLowerCase().includes(q) ||
          m.originalTitle.toLowerCase().includes(q) ||
          m.director.toLowerCase().includes(q) ||
          m.cast.some((a) => a.toLowerCase().includes(q))
        );
      })
    : [];

  // Генерация строки с причиной совпадения (для label)
  const getMatchReason = (movie) => {
    const q = query.toLowerCase();
    if (movie.title.toLowerCase().includes(q)) return null; // нет нужды, и так видно
    if (movie.originalTitle.toLowerCase().includes(q)) return `Оригинальное название: ${movie.originalTitle}`;
    if (movie.director.toLowerCase().includes(q)) return `Режиссёр: ${movie.director}`;
    const actor = movie.cast.find((a) => a.toLowerCase().includes(q));
    if (actor) return `Актёр: ${actor}`;
    return null;
  };

  return (
    <div className="search-page">
      <div className="search-page__header">
        <h1 className="search-page__query">
          Поиск: <span dangerouslySetInnerHTML={{ __html: highlightText(query, query) }} />
        </h1>
        {query && (
          <p className="search-page__count">
            {results.length > 0
              ? `Найдено: ${pluralMovies(results.length)}`
              : 'Ничего не найдено'}
          </p>
        )}
      </div>

      <div className="search-page__grid">
        {!query ? (
          <div className="empty-state">
            <div className="empty-state__icon">🔍</div>
            <h2 className="empty-state__title">Введите запрос для поиска</h2>
            <p className="empty-state__text">
              Ищите фильмы по названию, режиссёру или актёрам
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">😕</div>
            <h2 className="empty-state__title">По запросу «{query}» ничего не найдено</h2>
            <p className="empty-state__text">
              Попробуйте изменить запрос или перейдите в каталог
            </p>
            <Link to="/catalog" className="btn btn--primary">
              🎬 Перейти в каталог
            </Link>
          </div>
        ) : (
          <>
            {/* Сетка результатов */}
            <div className="movies-grid">
              {results.map((movie) => {
                const reason = getMatchReason(movie);
                return (
                  <div key={movie.id}>
                    {reason && (
                      <p
                        className="search-result-label"
                        // Подсветка совпадения в строке причины
                        dangerouslySetInnerHTML={{ __html: highlightText(reason, query) }}
                      />
                    )}
                    <MovieCard movie={movie} />
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
