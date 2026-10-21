// Контекст для управления избранным и списком «Смотреть позже»
import { createContext, useContext, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from './ToastContext';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useLocalStorage('cineverse_favorites', []);
  const [watchlist, setWatchlist] = useLocalStorage('cineverse_watchlist', []);
  const { addToast } = useToast();

  // Проверка: в избранном ли фильм
  const isFavorite = useCallback(
    (movieId) => favorites.some((m) => m.id === movieId),
    [favorites]
  );

  // Переключение избранного
  const toggleFavorite = useCallback(
    (movie) => {
      if (isFavorite(movie.id)) {
        setFavorites((prev) => prev.filter((m) => m.id !== movie.id));
        addToast('Удалено из избранного', 'info');
      } else {
        setFavorites((prev) => [...prev, movie]);
        addToast('Добавлено в избранное ❤️', 'success');
      }
    },
    [isFavorite, setFavorites, addToast]
  );

  // Проверка: в списке ли фильм
  const isInWatchlist = useCallback(
    (movieId) => watchlist.some((m) => m.id === movieId),
    [watchlist]
  );

  // Переключение «Смотреть позже»
  const toggleWatchlist = useCallback(
    (movie) => {
      if (isInWatchlist(movie.id)) {
        setWatchlist((prev) => prev.filter((m) => m.id !== movie.id));
        addToast('Удалено из списка просмотра', 'info');
      } else {
        setWatchlist((prev) => [...prev, movie]);
        addToast('Добавлено в список просмотра 🕒', 'success');
      }
    },
    [isInWatchlist, setWatchlist, addToast]
  );

  // Очистить избранное
  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, [setFavorites]);

  // Очистить список просмотра
  const clearWatchlist = useCallback(() => {
    setWatchlist([]);
  }, [setWatchlist]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        watchlist,
        isFavorite,
        toggleFavorite,
        isInWatchlist,
        toggleWatchlist,
        clearFavorites,
        clearWatchlist,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites должен использоваться внутри FavoritesProvider');
  return ctx;
}
