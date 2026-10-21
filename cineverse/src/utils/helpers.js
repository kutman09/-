// Утилиты и вспомогательные функции

// Форматирование длительности фильма
export function formatDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} мин`;
  if (m === 0) return `${h} ч`;
  return `${h} ч ${m} мин`;
}

// Получение цвета рейтинга
export function getRatingColor(rating) {
  if (rating >= 7.5) return '#4caf50'; // зелёный
  if (rating >= 6.0) return '#ff9800'; // жёлтый/оранжевый
  return '#f44336'; // красный
}

// Копирование текста в буфер обмена
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Запасной вариант для старых браузеров
    try {
      const el = document.createElement('textarea');
      el.value = text;
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      return true;
    } catch {
      return false;
    }
  }
}

// Подсветка совпадения текста
export function highlightText(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

// Генерация уникального ID для toast
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// Plural для "фильм"
export function pluralMovies(count) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod100 >= 11 && mod100 <= 14) return `${count} фильмов`;
  if (mod10 === 1) return `${count} фильм`;
  if (mod10 >= 2 && mod10 <= 4) return `${count} фильма`;
  return `${count} фильмов`;
}

// Получение URL постера с фолбэком
export function getPosterUrl(movie) {
  return movie.poster || `https://picsum.photos/seed/${movie.id}/400/600`;
}

// Получение URL thumbnail YouTube
export function getYoutubeThumbnail(videoId) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}
