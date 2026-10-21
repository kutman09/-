// Компонент горизонтального ряда фильмов со стрелками прокрутки
import { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../MovieCard/MovieCard';
import { SkeletonCard } from '../Skeleton/Skeleton';

export default function MovieRow({ title, movies, loading, seeAllLink, seeAllGenre }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Проверка возможности прокрутки
  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, movies]);

  // Прокрутка на 3 карточки вперёд/назад
  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = 3 * 196; // 180px карточка + 16px gap
    el.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };

  // Формирование ссылки «Смотреть все»
  const allLink = seeAllLink || (seeAllGenre
    ? `/catalog?genres=${encodeURIComponent(seeAllGenre)}`
    : '/catalog');

  return (
    <section className="movie-row">
      <div className="movie-row__header">
        <h2 className="movie-row__title">{title}</h2>
        <Link to={allLink} className="movie-row__see-all">
          Смотреть все →
        </Link>
      </div>

      <div className="movie-row__scroll-wrap">
        {/* Стрелка влево */}
        <button
          className="movie-row__scroll-btn movie-row__scroll-btn--left"
          onClick={() => scroll(-1)}
          disabled={!canScrollLeft}
          aria-label="Прокрутить влево"
        >
          ‹
        </button>

        {/* Список карточек */}
        <div className="movie-row__list" ref={scrollRef}>
          {loading
            ? Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)
            : movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
        </div>

        {/* Стрелка вправо */}
        <button
          className="movie-row__scroll-btn movie-row__scroll-btn--right"
          onClick={() => scroll(1)}
          disabled={!canScrollRight}
          aria-label="Прокрутить вправо"
        >
          ›
        </button>
      </div>
    </section>
  );
}
