// Компонент карточки фильма
import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';
import { getRatingColor } from '../../utils/helpers';
import TrailerModal from '../TrailerModal/TrailerModal';

export default function MovieCard({ movie }) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite, isInWatchlist, toggleWatchlist } = useFavorites();
  const [showTrailer, setShowTrailer] = useState(false);
  const [imgError, setImgError] = useState(false);
  const trailerBtnRef = useRef(null);

  const fav = isFavorite(movie.id);
  const watched = isInWatchlist(movie.id);

  // Переход на страницу фильма при клике по карточке
  const handleCardClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  // Предотвращаем всплытие события от кнопок
  const stop = useCallback((fn) => (e) => {
    e.stopPropagation();
    fn(e);
  }, []);

  const ratingColor = getRatingColor(movie.rating);

  return (
    <>
      <article
        className="movie-card"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        aria-label={`Фильм: ${movie.title}, ${movie.year}, рейтинг ${movie.rating}`}
        onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
      >
        <div className="movie-card__poster-wrap">
          {/* Постер */}
          {!imgError ? (
            <img
              className="movie-card__poster"
              src={movie.poster}
              alt={`Постер фильма ${movie.title}`}
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div className="movie-card__poster-fallback">
              {movie.title}
            </div>
          )}

          {/* Бейдж рейтинга */}
          <div
            className="movie-card__rating"
            style={{ color: ratingColor }}
            aria-hidden="true"
          >
            ⭐ {movie.rating.toFixed(1)}
          </div>

          {/* Оверлей с кнопками при наведении */}
          <div className="movie-card__overlay" aria-hidden="true">
            <div className="movie-card__action-row">
              {/* Трейлер */}
              <button
                className="movie-card__action-btn movie-card__action-btn--play"
                ref={trailerBtnRef}
                onClick={stop(() => setShowTrailer(true))}
                aria-label={`Смотреть трейлер ${movie.title}`}
              >
                ▶
              </button>

              {/* Избранное */}
              <button
                className={`movie-card__action-btn movie-card__action-btn--fav ${fav ? 'active' : ''}`}
                onClick={stop(() => toggleFavorite(movie))}
                aria-label={fav ? 'Убрать из избранного' : 'Добавить в избранное'}
              >
                {fav ? '❤️' : '🤍'}
              </button>

              {/* Смотреть позже */}
              <button
                className={`movie-card__action-btn movie-card__action-btn--watch ${watched ? 'active' : ''}`}
                onClick={stop(() => toggleWatchlist(movie))}
                aria-label={watched ? 'Убрать из списка просмотра' : 'Добавить в список просмотра'}
              >
                🕒
              </button>

              {/* Подробнее */}
              <button
                className="movie-card__action-btn movie-card__action-btn--info"
                onClick={stop(() => navigate(`/movie/${movie.id}`))}
                aria-label={`Подробнее о фильме ${movie.title}`}
              >
                ℹ
              </button>
            </div>
          </div>
        </div>

        <div className="movie-card__info">
          <div className="movie-card__title">{movie.title}</div>
          <div className="movie-card__year">{movie.year}</div>
        </div>
      </article>

      {/* Модальное окно трейлера */}
      {showTrailer && (
        <TrailerModal
          movie={movie}
          onClose={() => setShowTrailer(false)}
          triggerRef={trailerBtnRef}
        />
      )}
    </>
  );
}
