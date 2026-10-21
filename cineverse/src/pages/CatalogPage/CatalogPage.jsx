// Страница каталога с фильтрами, сортировкой и пагинацией
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { movies } from '../../data/movies';
import MovieCard from '../../components/MovieCard/MovieCard';
import FilterPanel from '../../components/FilterPanel/FilterPanel';
import Pagination from '../../components/Pagination/Pagination';
import { SkeletonGrid } from '../../components/Skeleton/Skeleton';
import Footer from '../../components/Footer/Footer';
import { pluralMovies } from '../../utils/helpers';

const PER_PAGE = 8;

// Начальные значения фильтров
const DEFAULT_FILTERS = {
  genres: [],
  yearFrom: '',
  yearTo: '',
  minRating: 0,
  country: '',
};

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  // Читаем фильтры из URL
  const getFiltersFromUrl = useCallback(() => {
    const genresParam = searchParams.get('genres');
    return {
      genres: genresParam ? genresParam.split(',').filter(Boolean) : [],
      yearFrom: searchParams.get('yearFrom') ? Number(searchParams.get('yearFrom')) : '',
      yearTo: searchParams.get('yearTo') ? Number(searchParams.get('yearTo')) : '',
      minRating: searchParams.get('minRating') ? Number(searchParams.get('minRating')) : 0,
      country: searchParams.get('country') || '',
    };
  }, [searchParams]);

  const filters = getFiltersFromUrl();
  const sort = searchParams.get('sort') || 'rating';
  const page = Number(searchParams.get('page') || 1);

  // Имитация загрузки
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  // Запись фильтров в URL
  const updateSearchParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === '' || val === null || val === undefined || (Array.isArray(val) && val.length === 0) || val === 0) {
        if (key !== 'page') next.delete(key);
        else next.set(key, val);
      } else if (Array.isArray(val)) {
        next.set(key, val.join(','));
      } else {
        next.set(key, String(val));
      }
    });
    // Сбрасываем страницу при изменении фильтров/сортировки
    if (!('page' in updates)) next.set('page', '1');
    setSearchParams(next);
  };

  const handleFilterChange = (partialFilters) => {
    updateSearchParams(partialFilters);
  };

  const handleReset = () => {
    setSearchParams({ page: '1' });
  };

  const handleSortChange = (e) => {
    updateSearchParams({ sort: e.target.value });
  };

  const handlePageChange = (p) => {
    updateSearchParams({ page: p });
    // Плавный скролл вверх
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Фильтрация
  let filtered = movies.filter((m) => {
    if (filters.genres.length > 0 && !filters.genres.some((g) => m.genres.includes(g))) return false;
    if (filters.yearFrom && m.year < filters.yearFrom) return false;
    if (filters.yearTo && m.year > filters.yearTo) return false;
    if (filters.minRating > 0 && m.rating < filters.minRating) return false;
    if (filters.country && !m.country.includes(filters.country)) return false;
    return true;
  });

  // Сортировка
  filtered = [...filtered].sort((a, b) => {
    switch (sort) {
      case 'rating': return b.rating - a.rating;
      case 'year_desc': return b.year - a.year;
      case 'year_asc': return a.year - b.year;
      case 'title': return a.title.localeCompare(b.title, 'ru');
      default: return b.rating - a.rating;
    }
  });

  // Пагинация
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const currentPage = Math.min(page, totalPages || 1);
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  return (
    <div className="catalog-page">
      <div className="catalog-page__header">
        <h1 className="catalog-page__title">🎬 Каталог фильмов</h1>
        <p className="catalog-page__count">
          {loading ? 'Загрузка...' : `Найдено: ${pluralMovies(filtered.length)}`}
        </p>
      </div>

      <div className="catalog-page__layout">
        {/* Панель фильтров */}
        <div>
          {/* Кнопка открытия фильтров (видна только на мобильных через CSS) */}
          <button
            className="filter-toggle-btn"
            onClick={() => setFilterOpen(!filterOpen)}
            aria-expanded={filterOpen}
            aria-controls="filter-panel"
          >
            🎛 {filterOpen ? 'Скрыть фильтры' : 'Показать фильтры'}
            {(filters.genres.length > 0 || filters.yearFrom || filters.yearTo || filters.minRating > 0 || filters.country) &&
              <span className="header__nav-badge" style={{ marginLeft: 6 }}>!</span>
            }
          </button>

          <FilterPanel
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleReset}
            className={filterOpen ? 'open' : ''}
          />
        </div>

        {/* Основная область */}
        <div className="catalog-main">
          {/* Сортировка */}
          <div className="catalog-main__top">
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {loading ? '' : `${pluralMovies(filtered.length)}`}
            </span>
            <select
              className="catalog-main__sort"
              value={sort}
              onChange={handleSortChange}
              aria-label="Сортировка"
            >
              <option value="rating">По рейтингу</option>
              <option value="year_desc">Сначала новые</option>
              <option value="year_asc">Сначала старые</option>
              <option value="title">По названию А–Я</option>
            </select>
          </div>

          {/* Сетка карточек */}
          {loading ? (
            <div className="movies-grid">
              <SkeletonGrid count={PER_PAGE} />
            </div>
          ) : paginated.length > 0 ? (
            <div className="movies-grid">
              {paginated.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            /* Пустое состояние */
            <div className="empty-state">
              <div className="empty-state__icon">🎭</div>
              <h2 className="empty-state__title">Ничего не найдено</h2>
              <p className="empty-state__text">
                Попробуйте изменить фильтры или сбросить их.
              </p>
              <button className="btn btn--primary" onClick={handleReset}>
                🔄 Сбросить фильтры
              </button>
            </div>
          )}

          {/* Пагинация */}
          {!loading && paginated.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
