// Главная страница
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { movies, ALL_GENRES } from '../../data/movies';
import HeroBanner from '../../components/HeroBanner/HeroBanner';
import MovieRow from '../../components/MovieRow/MovieRow';
import GenreChips from '../../components/GenreChips/GenreChips';
import Footer from '../../components/Footer/Footer';

export default function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Имитация загрузки 600 мс (скелетоны)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Фильмы для слайдера
  const featured = movies.filter((m) => m.isFeatured);

  // Популярные (по рейтингу, топ-12)
  const popular = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 12);

  // Лучшие по рейтингу (9+)
  const topRated = movies.filter((m) => m.rating >= 8.5).sort((a, b) => b.rating - a.rating);

  // Новинки (последние годы)
  const newest = [...movies].sort((a, b) => b.year - a.year).slice(0, 10);

  // По жанрам
  const actionMovies = movies.filter((m) => m.genres.includes('Боевик'));
  const scifiMovies = movies.filter((m) => m.genres.includes('Фантастика'));
  const dramaMovies = movies.filter((m) => m.genres.includes('Драма'));

  return (
    <main className="home-page">
      {/* Hero-слайдер */}
      <HeroBanner movies={featured} />

      {/* Ряды фильмов */}
      <div style={{ paddingTop: '40px' }}>
        <MovieRow
          title="🔥 Популярное"
          movies={popular}
          loading={loading}
          seeAllLink="/catalog?sort=rating"
        />

        <MovieRow
          title="⭐ Лучшие по рейтингу"
          movies={topRated}
          loading={loading}
          seeAllLink="/catalog?sort=rating"
        />

        <MovieRow
          title="🆕 Новинки"
          movies={newest}
          loading={loading}
          seeAllLink="/catalog?sort=year_desc"
        />

        <MovieRow
          title="💥 Боевики"
          movies={actionMovies}
          loading={loading}
          seeAllGenre="Боевик"
        />

        <MovieRow
          title="🚀 Фантастика"
          movies={scifiMovies}
          loading={loading}
          seeAllGenre="Фантастика"
        />

        <MovieRow
          title="🎭 Драмы"
          movies={dramaMovies}
          loading={loading}
          seeAllGenre="Драма"
        />
      </div>

      {/* Блок жанров */}
      <section className="home-section__genres" aria-label="Выбрать по жанру">
        <h2>🎭 Выбрать по жанру</h2>
        <GenreChips
          genres={ALL_GENRES}
          selected={[]}
          clickable
        />
      </section>

      <Footer />
    </main>
  );
}
