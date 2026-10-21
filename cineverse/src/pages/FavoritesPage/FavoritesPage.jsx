// Страница «Избранное»
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';
import MovieCard from '../../components/MovieCard/MovieCard';
import Footer from '../../components/Footer/Footer';

// Модальное окно подтверждения очистки
function ConfirmModal({ onConfirm, onCancel }) {
  return (
    <div
      className="modal-overlay"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
      aria-label="Подтверждение очистки"
    >
      <div
        className="modal confirm-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__header">
          <span className="modal__title">⚠️ Подтвердите действие</span>
          <button className="modal__close" onClick={onCancel} aria-label="Отмена">✕</button>
        </div>
        <div className="confirm-modal__body">
          <p className="confirm-modal__text">
            Вы уверены, что хотите очистить весь список избранного? Это действие нельзя отменить.
          </p>
          <div className="confirm-modal__actions">
            <button className="btn btn--ghost btn--sm" onClick={onCancel}>
              Отмена
            </button>
            <button className="btn btn--primary btn--sm" onClick={onConfirm}>
              Очистить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useFavorites();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClearAll = () => {
    clearFavorites();
    setShowConfirm(false);
  };

  return (
    <>
      <div className="list-page">
        <div className="list-page__header">
          <h1 className="list-page__title">❤️ Избранное</h1>
          {favorites.length > 0 && (
            <button
              className="btn btn--ghost btn--sm"
              onClick={() => setShowConfirm(true)}
              aria-label="Очистить весь список избранного"
            >
              🗑 Очистить всё
            </button>
          )}
        </div>

        <div className="list-page__grid">
          {favorites.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">💔</div>
              <h2 className="empty-state__title">Список избранного пуст</h2>
              <p className="empty-state__text">
                Добавляйте понравившиеся фильмы с помощью кнопки ❤️
              </p>
              <Link to="/catalog" className="btn btn--primary">
                🎬 Перейти в каталог
              </Link>
            </div>
          ) : (
            <div className="movies-grid">
              {favorites.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </div>

        <Footer />
      </div>

      {/* Модалка подтверждения */}
      {showConfirm && (
        <ConfirmModal
          onConfirm={handleClearAll}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
