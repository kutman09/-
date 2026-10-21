// Страница конкретного фильма
import { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getMovieById, getSimilarMovies } from '../../data/movies';
import { useFavorites } from '../../context/FavoritesContext';
import { useToast } from '../../context/ToastContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { formatDuration, getRatingColor, copyToClipboard, getYoutubeThumbnail } from '../../utils/helpers';
import TrailerModal from '../../components/TrailerModal/TrailerModal';
import MovieRow from '../../components/MovieRow/MovieRow';
import Footer from '../../components/Footer/Footer';
import NotFoundPage from '../NotFoundPage/NotFoundPage';

// Тестовые отзывы по умолчанию
const DEFAULT_REVIEWS = [
  {
    id: 'default-1',
    name: 'Алексей К.',
    text: 'Потрясающий фильм! Смотрел несколько раз и каждый раз открываю что-то новое. Рекомендую всем.',
    date: '2024-03-15',
    isDefault: true,
  },
  {
    id: 'default-2',
    name: 'Мария Т.',
    text: 'Один из лучших фильмов в своём жанре. Режиссёр — гений, актёры отыграли на высшем уровне.',
    date: '2024-05-22',
    isDefault: true,
  },
];

export default function MoviePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const movie = getMovieById(id);

  const { isFavorite, toggleFavorite, isInWatchlist, toggleWatchlist } = useFavorites();
  const { addToast } = useToast();

  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerInline, setTrailerInline] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [backdropError, setBackdropError] = useState(false);
  const [hoverStar, setHoverStar] = useState(0);

  // Хранение оценки пользователя в localStorage
  const [userRatings, setUserRatings] = useLocalStorage('cineverse_ratings', {});
  const userRating = userRatings[id] || 0;

  // Хранение отзывов в localStorage (по id фильма)
  const [allReviews, setAllReviews] = useLocalStorage('cineverse_reviews', {});
  const reviews = allReviews[id] || DEFAULT_REVIEWS;

  // Форма отзыва
  const [reviewName, setReviewName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviewError, setReviewError] = useState('');

  const trailerBtnRef = useRef(null);
  const similarMovies = movie ? getSimilarMovies(movie, 8) : [];

  // Если фильм не найден — 404
  if (!movie) return <NotFoundPage />;

  const fav = isFavorite(movie.id);
  const watched = isInWatchlist(movie.id);
  const ratingColor = getRatingColor(movie.rating);

  // Выставить оценку
  const handleSetRating = (star) => {
    setUserRatings((prev) => ({ ...prev, [id]: star }));
    addToast(`Вы оценили фильм на ${star}/10 ⭐`, 'success');
  };

  // Сбросить оценку
  const handleResetRating = () => {
    setUserRatings((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    addToast('Оценка сброшена', 'info');
  };

  // Добавить отзыв
  const handleAddReview = () => {
    if (!reviewName.trim()) {
      setReviewError('Введите ваше имя');
      return;
    }
    if (!reviewText.trim() || reviewText.trim().length < 10) {
      setReviewError('Отзыв должен содержать не менее 10 символов');
      return;
    }
    setReviewError('');
    const newReview = {
      id: Date.now().toString(),
      name: reviewName.trim(),
      text: reviewText.trim(),
      date: new Date().toISOString().slice(0, 10),
      isDefault: false,
    };
    setAllReviews((prev) => ({
      ...prev,
      [id]: [...(prev[id] || DEFAULT_REVIEWS), newReview],
    }));
    setReviewName('');
    setReviewText('');
    addToast('Отзыв добавлен ✍️', 'success');
  };

  // Удалить отзыв (только пользовательский)
  const handleDeleteReview = (reviewId) => {
    setAllReviews((prev) => ({
      ...prev,
      [id]: (prev[id] || DEFAULT_REVIEWS).filter((r) => r.id !== reviewId),
    }));
    addToast('Отзыв удалён', 'info');
  };

  // Копировать ссылку
  const handleShare = async () => {
    const url = window.location.href;
    const ok = await copyToClipboard(url);
    addToast(ok ? 'Ссылка скопирована 🔗' : 'Не удалось скопировать', ok ? 'success' : 'error');
  };

  // Переход в каталог по жанру
  const handleGenreClick = (genre) => {
    navigate(`/catalog?genres=${encodeURIComponent(genre)}`);
  };

  const thumbUrl = getYoutubeThumbnail(movie.trailerYoutubeId);

  return (
    <>
      <div className="movie-page">
        {/* Backdrop */}
        <div className="movie-page__backdrop-wrap">
          {!backdropError ? (
            <img
              className="movie-page__backdrop"
              src={movie.backdrop}
              alt={`Фон фильма ${movie.title}`}
              onError={() => setBackdropError(true)}
            />
          ) : (
            <div
              className="movie-page__backdrop"
              style={{ background: 'linear-gradient(135deg, #0f1115, #2d3140)', height: '100%' }}
              aria-hidden="true"
            />
          )}
          <div className="movie-page__backdrop-gradient" aria-hidden="true" />
        </div>

        {/* Основной контент */}
        <div className="movie-page__content">
          <div className="movie-page__main">
            {/* Постер */}
            <div>
              {!imgError ? (
                <img
                  className="movie-page__poster"
                  src={movie.poster}
                  alt={`Постер фильма ${movie.title}`}
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="movie-page__poster-fallback">{movie.title}</div>
              )}
            </div>

            {/* Информация */}
            <div className="movie-page__info">
              {/* Рейтинг в круге */}
              <div
                className="movie-page__rating-circle"
                style={{ borderColor: ratingColor, color: ratingColor }}
                aria-label={`Рейтинг: ${movie.rating}`}
              >
                <span className="movie-page__rating-num">{movie.rating.toFixed(1)}</span>
                <span className="movie-page__rating-label">рейтинг</span>
              </div>

              <h1 className="movie-page__title">{movie.title}</h1>
              <p className="movie-page__original-title">{movie.originalTitle}</p>

              {/* Мета-данные */}
              <div className="movie-page__meta-row">
                <span className="movie-page__meta-item">📅 {movie.year}</span>
                <span className="movie-page__meta-item">⏱ {formatDuration(movie.duration)}</span>
                <span className="movie-page__meta-item">🌍 {movie.country}</span>
              </div>

              {/* Жанры */}
              <div className="movie-page__genres">
                {movie.genres.map((g) => (
                  <button
                    key={g}
                    className="movie-page__genre-link"
                    onClick={() => handleGenreClick(g)}
                    aria-label={`Фильмы в жанре ${g}`}
                  >
                    {g}
                  </button>
                ))}
              </div>

              {/* Описание */}
              <p className="movie-page__description">{movie.description}</p>

              {/* Режиссёр и актёры */}
              <div className="movie-page__credits">
                <div className="movie-page__credits-row">
                  <span className="movie-page__credits-label">🎬 Режиссёр:</span>
                  <span className="movie-page__credits-value">{movie.director}</span>
                </div>
                <div className="movie-page__credits-row">
                  <span className="movie-page__credits-label">🎭 В ролях:</span>
                  <span className="movie-page__credits-value">{movie.cast.join(', ')}</span>
                </div>
              </div>

              {/* Кнопки действий */}
              <div className="movie-page__actions">
                <button
                  ref={trailerBtnRef}
                  className="btn btn--primary"
                  onClick={() => setShowTrailer(true)}
                  aria-label="Смотреть трейлер в модальном окне"
                >
                  ▶ Смотреть трейлер
                </button>

                <button
                  className={`btn btn--ghost btn--fav ${fav ? 'active' : ''}`}
                  onClick={() => toggleFavorite(movie)}
                  aria-label={fav ? 'Убрать из избранного' : 'Добавить в избранное'}
                >
                  {fav ? '❤️ В избранном' : '🤍 В избранное'}
                </button>

                <button
                  className={`btn btn--ghost ${watched ? 'btn--fav active' : ''}`}
                  onClick={() => toggleWatchlist(movie)}
                  aria-label={watched ? 'Убрать из списка просмотра' : 'Добавить в список просмотра'}
                >
                  {watched ? '🕒 В списке' : '🕒 Смотреть позже'}
                </button>

                <button
                  className="btn btn--ghost"
                  onClick={handleShare}
                  aria-label="Поделиться ссылкой на фильм"
                >
                  🔗 Поделиться
                </button>
              </div>

              {/* Встроенный трейлер */}
              <div className="inline-trailer">
                <h2 className="inline-trailer__title">🎬 Трейлер</h2>
                {!trailerInline ? (
                  <div
                    className="inline-trailer__preview"
                    onClick={() => setTrailerInline(true)}
                    role="button"
                    tabIndex={0}
                    aria-label="Нажмите, чтобы воспроизвести трейлер"
                    onKeyDown={(e) => e.key === 'Enter' && setTrailerInline(true)}
                  >
                    <img
                      className="inline-trailer__thumb"
                      src={thumbUrl}
                      alt={`Превью трейлера ${movie.title}`}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="inline-trailer__play">
                      <div className="inline-trailer__play-icon" aria-hidden="true">▶</div>
                    </div>
                  </div>
                ) : (
                  <div className="inline-trailer__iframe-wrap">
                    <iframe
                      src={`https://www.youtube.com/embed/${movie.trailerYoutubeId}?autoplay=1&rel=0&modestbranding=1`}
                      title={`Трейлер ${movie.title}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>

              {/* Оценка пользователя */}
              <div className="user-rating">
                <h2 className="user-rating__title">⭐ Ваша оценка</h2>
                <div className="user-rating__stars" role="group" aria-label="Оцените фильм от 1 до 10">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((star) => (
                    <button
                      key={star}
                      className={`user-rating__star ${star <= (hoverStar || userRating) ? (hoverStar ? 'hovered' : 'filled') : ''}`}
                      onClick={() => handleSetRating(star)}
                      onMouseEnter={() => setHoverStar(star)}
                      onMouseLeave={() => setHoverStar(0)}
                      aria-label={`Оценить на ${star} из 10`}
                      aria-pressed={star === userRating}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <div className="user-rating__info">
                  {userRating > 0 ? (
                    <>
                      <span>Вы оценили: <strong>{userRating}/10</strong></span>
                      <button
                        className="user-rating__reset"
                        onClick={handleResetRating}
                        aria-label="Сбросить оценку"
                      >
                        Сбросить
                      </button>
                    </>
                  ) : (
                    <span>Кликните на звезду, чтобы оценить</span>
                  )}
                </div>
              </div>

              {/* Отзывы */}
              <div className="reviews">
                <h2 className="reviews__title">💬 Отзывы ({reviews.length})</h2>

                {reviews.map((review) => (
                  <div key={review.id} className="review-item">
                    <div className="review-item__header">
                      <div>
                        <span className="review-item__name">{review.name}</span>
                        <span className="review-item__date" style={{ marginLeft: 8 }}>
                          {review.date}
                        </span>
                      </div>
                      {/* Кнопка удаления только для пользовательских отзывов */}
                      {!review.isDefault && (
                        <button
                          className="review-item__delete"
                          onClick={() => handleDeleteReview(review.id)}
                          aria-label={`Удалить отзыв от ${review.name}`}
                        >
                          🗑 Удалить
                        </button>
                      )}
                    </div>
                    <p className="review-item__text">{review.text}</p>
                  </div>
                ))}

                {/* Форма добавления отзыва */}
                <div className="review-form">
                  <h3 className="review-form__title">✍️ Написать отзыв</h3>
                  <input
                    className="review-form__input"
                    type="text"
                    placeholder="Ваше имя *"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    aria-label="Ваше имя"
                    maxLength={50}
                  />
                  <textarea
                    className="review-form__textarea"
                    placeholder="Ваш отзыв (минимум 10 символов) *"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    aria-label="Текст отзыва"
                    maxLength={1000}
                  />
                  {reviewError && (
                    <p className="review-form__error" role="alert">{reviewError}</p>
                  )}
                  <button
                    className="btn btn--primary btn--sm"
                    onClick={handleAddReview}
                    aria-label="Отправить отзыв"
                  >
                    📨 Отправить отзыв
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Похожие фильмы */}
          {similarMovies.length > 0 && (
            <div style={{ marginTop: '48px' }}>
              <MovieRow
                title="🎬 Похожие фильмы"
                movies={similarMovies}
                loading={false}
                seeAllLink={`/catalog?genres=${encodeURIComponent(movie.genres[0])}`}
              />
            </div>
          )}
        </div>

        <Footer />
      </div>

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
