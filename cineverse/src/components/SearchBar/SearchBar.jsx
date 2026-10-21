// Компонент поисковой строки в шапке
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';
import { movies } from '../../data/movies';

export default function SearchBar({ onClose }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const debouncedQuery = useDebounce(query, 300);

  // Поиск по названию, оригинальному названию, актёрам и режиссёру
  const results = debouncedQuery.length >= 2
    ? movies
        .filter((m) => {
          const q = debouncedQuery.toLowerCase();
          return (
            m.title.toLowerCase().includes(q) ||
            m.originalTitle.toLowerCase().includes(q) ||
            m.director.toLowerCase().includes(q) ||
            m.cast.some((a) => a.toLowerCase().includes(q))
          );
        })
        .slice(0, 5)
    : [];

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !inputRef.current?.contains(e.target) &&
        !dropdownRef.current?.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setOpen(false);
      setQuery('');
      onClose?.();
    } else if (e.key === 'Enter' && query.trim()) {
      // Enter → переход на страницу поиска
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
      setQuery('');
      onClose?.();
    }
  };

  const handleResultClick = (movieId) => {
    navigate(`/movie/${movieId}`);
    setOpen(false);
    setQuery('');
    onClose?.();
  };

  const handleAllResults = () => {
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setOpen(false);
    setQuery('');
    onClose?.();
  };

  return (
    <div className="search-bar">
      <div className="search-bar__input-wrap">
        {/* Иконка лупы */}
        <span className="search-bar__icon" aria-hidden="true">🔍</span>
        <input
          ref={inputRef}
          className="search-bar__input"
          type="search"
          placeholder="Поиск фильмов..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          aria-label="Поиск фильмов"
          aria-expanded={open && results.length > 0}
          aria-haspopup="listbox"
          autoComplete="off"
        />
        {/* Кнопка очистки */}
        {query && (
          <button
            className="search-bar__clear"
            onClick={() => { setQuery(''); setOpen(false); inputRef.current?.focus(); }}
            aria-label="Очистить поиск"
          >
            ✕
          </button>
        )}
      </div>

      {/* Выпадающий список результатов */}
      {open && results.length > 0 && (
        <div
          className="search-bar__dropdown"
          ref={dropdownRef}
          role="listbox"
          aria-label="Результаты поиска"
        >
          {results.map((movie) => (
            <button
              key={movie.id}
              className="search-bar__item"
              role="option"
              onClick={() => handleResultClick(movie.id)}
              aria-selected="false"
            >
              <img
                className="search-bar__item-poster"
                src={movie.poster}
                alt={`Постер ${movie.title}`}
                onError={(e) => { e.target.style.display = 'none'; }}
                loading="lazy"
              />
              <div className="search-bar__item-info">
                <div className="search-bar__item-title">{movie.title}</div>
                <div className="search-bar__item-meta">
                  {movie.year} · {movie.genres.slice(0, 2).join(', ')}
                </div>
              </div>
            </button>
          ))}

          {/* Ссылка «Показать все результаты» */}
          <button className="search-bar__all-link" onClick={handleAllResults}>
            Показать все результаты по «{query}» →
          </button>
        </div>
      )}
    </div>
  );
}
