// Компонент Toast-уведомлений
import { useToast } from '../../context/ToastContext';

// Иконки по типу уведомления
const icons = {
  success: '✅',
  error: '❌',
  info: '🎬',
  warning: '⚠️',
};

function Toast({ toast }) {
  const { removeToast } = useToast();

  return (
    <div className={`toast toast--${toast.type}`} role="alert" aria-live="polite">
      <span className="toast__icon" aria-hidden="true">{icons[toast.type] || '📢'}</span>
      <span className="toast__message">{toast.message}</span>
      <button
        className="toast__close"
        onClick={() => removeToast(toast.id)}
        aria-label="Закрыть уведомление"
      >
        ✕
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-label="Уведомления">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
