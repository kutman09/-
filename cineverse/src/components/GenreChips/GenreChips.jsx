// Компонент чипов жанров
import { useNavigate } from 'react-router-dom';

export default function GenreChips({ genres, selected = [], onToggle, clickable = false }) {
  const navigate = useNavigate();

  const handleClick = (genre) => {
    if (onToggle) {
      // Режим фильтрации: переключаем жанр в массиве выбранных
      onToggle(genre);
    } else if (clickable) {
      // Режим навигации: переход в каталог с выбранным жанром
      navigate(`/catalog?genres=${encodeURIComponent(genre)}`);
    }
  };

  return (
    <div className="genre-chips">
      {genres.map((genre) => (
        <button
          key={genre}
          className={`genre-chip ${selected.includes(genre) ? 'active' : ''}`}
          onClick={() => handleClick(genre)}
          aria-pressed={selected.includes(genre)}
          aria-label={`Жанр: ${genre}`}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}
