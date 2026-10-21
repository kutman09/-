// Хук для задержки выполнения поиска (debounce)
import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Очищаем таймер при каждом новом изменении value
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
