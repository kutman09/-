// Корневой компонент приложения с маршрутизацией
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import ToastContainer from './components/Toast/Toast';
import HomePage from './pages/HomePage/HomePage';
import CatalogPage from './pages/CatalogPage/CatalogPage';
import MoviePage from './pages/MoviePage/MoviePage';
import FavoritesPage from './pages/FavoritesPage/FavoritesPage';
import WatchlistPage from './pages/WatchlistPage/WatchlistPage';
import SearchPage from './pages/SearchPage/SearchPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';

export default function App() {
  return (
    <>
      {/* Шапка присутствует на всех страницах */}
      <Header />

      {/* Маршруты */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/movie/:id" element={<MoviePage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/search" element={<SearchPage />} />
        {/* 404 — все остальные пути */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Toast-уведомления поверх всего */}
      <ToastContainer />
    </>
  );
}
