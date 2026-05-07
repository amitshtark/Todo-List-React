import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import useUIStore from '../../store/uiStore.js';

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

function NotificationItem({ notification }) {
  const { removeNotification } = useUIStore();
  const Icon = ICONS[notification.type] || Info;

  return (
    <div className={`toast toast-${notification.type}`} role="alert">
      <Icon size={18} className="toast-icon" />
      <span className="toast-message">{notification.message}</span>
      <button
        className="toast-close"
        onClick={() => removeNotification(notification.id)}
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  );
}

function NotificationCenter() {
  const { notifications } = useUIStore();

  return (
    <div className="toast-container" aria-live="polite">
      {notifications.map(n => (
        <NotificationItem key={n.id} notification={n} />
      ))}
    </div>
  );
}

export default NotificationCenter;
