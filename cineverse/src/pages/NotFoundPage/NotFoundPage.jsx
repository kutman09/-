// Страница 404
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <main className="not-found">
      <div className="not-found__code" aria-hidden="true">404</div>
      <h1 className="not-found__title">Страница не найдена</h1>
      <p className="not-found__text">
        Кажется, такая страница не существует или была удалена.
      </p>
      <Link to="/" className="btn btn--primary">
        🏠 На главную
      </Link>
    </main>
  );
}
