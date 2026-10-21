// Компонент Hero-баннера (слайдер избранных фильмов)
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';
import { getRatingColor } from '../../utils/helpers';
import TrailerModal from '../TrailerModal/TrailerModal';

export default function HeroBanner({ movies }) {
  const [current, setCurrent] = useState(0);
  const [trailerMovie, setTrailerMovie] = useState(null);
  const [paused, setPaused] = useState(false);
  const [imgErrors, setImgErrors] = useState({});
  const { isFavorite, toggleFavorite } = useFavorites();
  const trailerBtnRefs = useRef([]);
  const intervalRef = useRef(null);

  const total = movies.length;

  // Переход к следующему слайду
  const goNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const goPrev = () => {
    setCurrent((prev) => (prev - 1 + total) % total);
  };

  // Автопереключение каждые 7 секунд
  useEffect(() => {
    if (paused || trailerMovie) return;
    intervalRef.current = setInterval(goNext, 7000);
    return () => clearInterval(intervalRef.current);
  }, [paused, trailerMovie, goNext]);

  const movie = movies[current];
  if (!movie) return null;

  const ratingColor = getRatingColor(movie.rating);
  const fav = isFavorite(movie.id);

  return (
    <>
      <section
        className="hero"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        aria-label="Избранные фильмы"
      >
        {/* Слайды */}
        {movies.map((m, i) => (
          <div key={m.id} className={`hero__slide ${i === current ? 'active' : ''}`}>
            {/* Фоновое изображение */}
            {!imgErrors[m.id] ? (
              <img
                className="hero__backdrop"
                src={m.backdrop}
                alt={`Фон: ${m.title}`}
                onError={() => setImgErrors((prev) => ({ ...prev, [m.id]: true }))}
              />
            ) : (
              <div
                className="hero__backdrop"
                style={{ background: 'linear-gradient(135deg, #1a1d24, #2d3140)' }}
                aria-hidden="true"
              />
            )}
            <div className="hero__gradient" aria-hidden="true" />
          </div>
        ))}

        {/* Контент текущего слайда */}
        <div className="hero__content">
          {/* Жанры */}
          <div className="hero__genres" aria-label="Жанры">
            {movie.genres.map((g) => (
              <span key={g} className="hero__genre-chip">{g}</span>
            ))}
          </div>

          {/* Название */}
          <h1 className="hero__title">{movie.title}</h1>

          {/* Мета-данные */}
          <div className="hero__meta">
            <span
              className="hero__rating"
              style={{ color: ratingColor }}
              aria-label={`Рейтинг ${movie.rating}`}
            >
              ⭐ {movie.rating.toFixed(1)}
            </span>
            <span aria-label={`Год: ${movie.year}`}>{movie.year}</span>
            <span aria-label={`Длительность: ${Math.floor(movie.duration / 60)} ч ${movie.duration % 60} мин`}>
              {Math.floor(movie.duration / 60)} ч {movie.duration % 60} мин
            </span>
          </div>

          {/* Описание (обрезанное) */}
          <p className="hero__description">{movie.description}</p>

          {/* Кнопки действий */}
          <div className="hero__actions">
            <button
              ref={(el) => (trailerBtnRefs.current[current] = el)}
              className="btn btn--primary"
              onClick={() => setTrailerMovie(movie)}
              aria-label={`Смотреть трейлер ${movie.title}`}
            >
              ▶ Смотреть трейлер
            </button>

            <Link
              to={`/movie/${movie.id}`}
              className="btn btn--secondary"
              aria-label={`Подробнее о фильме ${movie.title}`}
            >
              ℹ Подробнее
            </Link>

            <button
              className={`btn btn--ghost btn--fav ${fav ? 'active' : ''}`}
              onClick={() => toggleFavorite(movie)}
              aria-label={fav ? 'Убрать из избранного' : 'Добавить в избранное'}
            >
              {fav ? '❤️ В избранном' : '🤍 В избранное'}
            </button>
          </div>
        </div>

        {/* Навигация слайдера */}
        <div className="hero__nav">
          <button
            className="hero__arrow"
            onClick={goPrev}
            aria-label="Предыдущий слайд"
          >
            ‹
          </button>

          <div className="hero__dots" role="tablist" aria-label="Слайды">
            {movies.map((m, i) => (
              <button
                key={m.id}
                className={`hero__dot ${i === current ? 'active' : ''}`}
                onClick={() => setCurrent(i)}
                role="tab"
                aria-selected={i === current}
                aria-label={`Слайд ${i + 1}: ${m.title}`}
              />
            ))}
          </div>

          <button
            className="hero__arrow"
            onClick={goNext}
            aria-label="Следующий слайд"
          >
            ›
          </button>
        </div>
      </section>

      {/* Модальное окно трейлера */}
      {trailerMovie && (
        <TrailerModal
          movie={trailerMovie}
          onClose={() => setTrailerMovie(null)}
          triggerRef={{ current: trailerBtnRefs.current[current] }}
        />
      )}
    </>
  );
}
