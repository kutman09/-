// Компонент модального окна трейлера
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';

export default function TrailerModal({ movie, onClose, triggerRef }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const overlayRef = useRef(null);
  const closeBtnRef = useRef(null);
  const fav = isFavorite(movie.id);

  // Блокировка скролла при открытии модалки
  useEffect(() => {
    document.body.classList.add('modal-open');
    // Фокус на кнопку закрытия
    closeBtnRef.current?.focus();

    return () => {
      document.body.classList.remove('modal-open');
      // Возвращаем фокус на кнопку, открывшую модалку
      triggerRef?.current?.focus();
    };
  }, [triggerRef]);

  // Закрытие по Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Закрытие по клику на оверлей (не на модалку)
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const youtubeUrl = `https://www.youtube.com/embed/${movie.trailerYoutubeId}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Трейлер: ${movie.title}`}
    >
      <div className="modal">
        {/* Заголовок модалки */}
        <div className="modal__header">
          <span className="modal__title">🎬 {movie.title} ({movie.year})</span>
          <button
            className="modal__close"
            onClick={onClose}
            ref={closeBtnRef}
            aria-label="Закрыть трейлер"
          >
            ✕
          </button>
        </div>

        {/* Плеер */}
        <div className="modal__video">
          {movie.trailerYoutubeId ? (
            <iframe
              src={youtubeUrl}
              title={`Трейлер фильма ${movie.title}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="modal__video-error">
              <span style={{ fontSize: '3rem' }}>🎭</span>
              <p>Трейлер недоступен</p>
              <a
                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + ' trailer')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn--accent-outline btn--sm"
              >
                🔍 Найти на YouTube
              </a>
            </div>
          )}
        </div>

        {/* Подвал модалки */}
        <div className="modal__footer">
          <Link
            to={`/movie/${movie.id}`}
            className="btn btn--primary btn--sm"
            onClick={onClose}
          >
            ℹ️ Подробнее
          </Link>
          <button
            className={`btn btn--ghost btn--sm btn--fav ${fav ? 'active' : ''}`}
            onClick={() => toggleFavorite(movie)}
            aria-label={fav ? 'Убрать из избранного' : 'Добавить в избранное'}
          >
            {fav ? '❤️ В избранном' : '🤍 В избранное'}
          </button>
          {movie.trailerYoutubeId && (
            <a
              href={`https://www.youtube.com/watch?v=${movie.trailerYoutubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--ghost btn--sm"
            >
              ↗️ Открыть на YouTube
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
