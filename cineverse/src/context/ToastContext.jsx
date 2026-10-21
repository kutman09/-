// Контекст для toast-уведомлений
import { createContext, useContext, useCallback, useReducer } from 'react';
import { generateId } from '../utils/helpers';

const ToastContext = createContext(null);

// Редьюсер для управления стеком уведомлений
function toastReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [...state, action.toast];
    case 'REMOVE':
      return state.filter((t) => t.id !== action.id);
    default:
      return state;
  }
}

export function ToastProvider({ children }) {
  const [toasts, dispatch] = useReducer(toastReducer, []);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = generateId();
    dispatch({ type: 'ADD', toast: { id, message, type, duration } });

    // Автоматически убираем toast через duration мс
    if (duration > 0) {
      setTimeout(() => {
        dispatch({ type: 'REMOVE', id });
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    dispatch({ type: 'REMOVE', id });
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast должен использоваться внутри ToastProvider');
  return ctx;
}
