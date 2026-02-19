import Icon from './Icon';

export default function Toast({ toasts, removeToast }) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" id="toast-container">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type}`}
          onClick={() => removeToast(toast.id)}
          role="alert"
        >
          <span className="toast-icon">
            <Icon name={toast.type === 'success' ? 'check' : 'x'} size={18} />
          </span>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
