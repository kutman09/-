// Компонент скелетон-загрузки карточки фильма
export function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton-card__poster skeleton" />
      <div className="skeleton-card__info">
        <div className="skeleton-card__title skeleton" />
        <div className="skeleton-card__year skeleton" />
      </div>
    </div>
  );
}

// Скелетон для сетки карточек
export function SkeletonGrid({ count = 8 }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonCard key={i} />
      ))}
    </>
  );
}
