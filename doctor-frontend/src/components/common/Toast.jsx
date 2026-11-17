import { useEffect } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import './Toast.css';

export default function Toast() {
  const { toast, hideToast } = useApp();

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      hideToast();
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast, hideToast]);

  if (!toast) return null;

  const iconMap = {
    success: <CheckCircle2 size={20} />,
    error: <AlertCircle size={20} />,
    warning: <AlertTriangle size={20} />,
    info: <Info size={20} />,
  };

  const currentType = toast.type || 'success';

  return (
    <div className="toast-container" aria-live="polite">
      <div className={`toast-card toast-card--${currentType}`} role="alert">
        <div className="toast-icon">
          {iconMap[currentType] || iconMap.success}
        </div>

        <div className="toast-content">
          <h4 className="toast-title">{toast.title || 'Notification'}</h4>
          {toast.message && <p className="toast-message">{toast.message}</p>}
        </div>

        <button className="toast-close" onClick={hideToast} aria-label="Close notification">
          <X size={16} />
        </button>

        <div
          className="toast-progress"
          style={{ animationDuration: `${(toast.duration || 5000) / 1000}s` }}
        />
      </div>
    </div>
  );
}
