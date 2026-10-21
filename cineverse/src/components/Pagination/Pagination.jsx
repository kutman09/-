// Компонент пагинации
export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // Генерируем массив страниц для отображения (с многоточием)
  const getPageNumbers = () => {
    const pages = [];
    const delta = 1; // сколько страниц вокруг текущей

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (
        i === currentPage - delta - 1 ||
        i === currentPage + delta + 1
      ) {
        pages.push('...');
      }
    }
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav className="pagination" aria-label="Пагинация">
      {/* Кнопка «Назад» */}
      <button
        className="pagination__btn"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Предыдущая страница"
      >
        ← Назад
      </button>

      {/* Номера страниц */}
      {pages.map((page, index) =>
        page === '...' ? (
          <span key={`dots-${index}`} className="pagination__dots">
            …
          </span>
        ) : (
          <button
            key={page}
            className={`pagination__btn ${currentPage === page ? 'active' : ''}`}
            onClick={() => onPageChange(page)}
            aria-label={`Страница ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        )
      )}

      {/* Кнопка «Вперёд» */}
      <button
        className="pagination__btn"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Следующая страница"
      >
        Вперёд →
      </button>
    </nav>
  );
}
