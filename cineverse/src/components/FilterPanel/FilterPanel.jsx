// Компонент панели фильтров каталога
import { ALL_GENRES, ALL_COUNTRIES } from '../../data/movies';
import GenreChips from '../GenreChips/GenreChips';

export default function FilterPanel({ filters, onChange, onReset, className = '' }) {
  const handleGenreToggle = (genre) => {
    const current = filters.genres || [];
    const next = current.includes(genre)
      ? current.filter((g) => g !== genre)
      : [...current, genre];
    onChange({ genres: next });
  };

  return (
    <aside className={`filter-panel ${className}`} aria-label="Фильтры">
      <div className="filter-panel__title">
        <span>🎛 Фильтры</span>
        <button className="filter-panel__reset" onClick={onReset} aria-label="Сбросить все фильтры">
          Сбросить
        </button>
      </div>

      {/* Жанры */}
      <div className="filter-panel__section">
        <label className="filter-panel__label">Жанры</label>
        <GenreChips
          genres={ALL_GENRES}
          selected={filters.genres || []}
          onToggle={handleGenreToggle}
        />
      </div>

      {/* Год выпуска */}
      <div className="filter-panel__section">
        <label className="filter-panel__label">Год выпуска</label>
        <div className="filter-panel__year-row">
          <input
            type="number"
            className="filter-panel__year-input"
            placeholder="От"
            value={filters.yearFrom || ''}
            min={1950}
            max={2026}
            onChange={(e) => onChange({ yearFrom: e.target.value ? Number(e.target.value) : '' })}
            aria-label="Год от"
          />
          <span className="filter-panel__year-sep">—</span>
          <input
            type="number"
            className="filter-panel__year-input"
            placeholder="До"
            value={filters.yearTo || ''}
            min={1950}
            max={2026}
            onChange={(e) => onChange({ yearTo: e.target.value ? Number(e.target.value) : '' })}
            aria-label="Год до"
          />
        </div>
      </div>

      {/* Минимальный рейтинг */}
      <div className="filter-panel__section">
        <label className="filter-panel__label">
          Минимальный рейтинг
        </label>
        <div className="filter-panel__slider-row">
          <input
            type="range"
            className="filter-panel__slider"
            min={0}
            max={10}
            step={0.5}
            value={filters.minRating || 0}
            onChange={(e) => onChange({ minRating: Number(e.target.value) })}
            aria-label={`Минимальный рейтинг: ${filters.minRating || 0}`}
          />
          <span className="filter-panel__slider-value">
            {(filters.minRating || 0).toFixed(1)}
          </span>
        </div>
      </div>

      {/* Страна */}
      <div className="filter-panel__section">
        <label className="filter-panel__label">Страна</label>
        <select
          className="filter-panel__select"
          value={filters.country || ''}
          onChange={(e) => onChange({ country: e.target.value })}
          aria-label="Выбрать страну"
        >
          <option value="">Все страны</option>
          {ALL_COUNTRIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
    </aside>
  );
}
