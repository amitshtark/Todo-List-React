import { Bell, BellOff, Trash2 } from 'lucide-react';
import useUIStore from '../../store/uiStore.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import { formatRelative } from '../../utils/helpers.js';

const TYPE_COLORS = {
  success: 'var(--color-success)',
  error: 'var(--color-error)',
  warning: 'var(--badge-warning-color)',
  info: 'var(--accent)',
};

function NotificationsPage() {
  useDocumentTitle('Notifications');
  const { notifications, removeNotification, clearNotifications } = useUIStore();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Notifications</h2>
          <p className="page-subtitle">{notifications.length} notification{notifications.length !== 1 ? 's' : ''}</p>
        </div>
        {notifications.length > 0 && (
          <button
            className="btn btn-ghost btn-sm"
            onClick={clearNotifications}
            id="clear-notifs-btn"
          >
            <Trash2 size={14} /> Clear all
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <BellOff size={40} strokeWidth={1.5} />
          </div>
          <h3 className="empty-state-title">No notifications</h3>
          <p className="empty-state-desc">You're all caught up!</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map(n => (
            <div key={n.id} className="notification-item">
              <div
                className="notification-type-bar"
                style={{ background: TYPE_COLORS[n.type] || TYPE_COLORS.info }}
              />
              <div className="notification-content">
                <div className="notification-header">
                  <Bell size={14} style={{ color: TYPE_COLORS[n.type] }} />
                  <span className="notification-message">{n.message}</span>
                </div>
                <span className="notification-time">{formatRelative(n.timestamp)}</span>
              </div>
              <button
                className="btn-icon notification-dismiss"
                onClick={() => removeNotification(n.id)}
                aria-label="Dismiss"
                id={`dismiss-notif-${n.id}`}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;
