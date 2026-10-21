// Компонент бейджа рейтинга со звездой
import { getRatingColor } from '../../utils/helpers';

export default function Rating({ value, size = 'sm' }) {
  const color = getRatingColor(value);

  return (
    <span
      className="rating-badge"
      style={{ color }}
      aria-label={`Рейтинг ${value} из 10`}
    >
      ⭐ {value.toFixed(1)}
    </span>
  );
}
