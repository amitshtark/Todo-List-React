import { useState } from 'react';
import { Moon, Sun, Monitor, Palette, Bell, Shield, Trash2 } from 'lucide-react';
import useUIStore from '../../store/uiStore.js';
import useAuthStore from '../../store/authStore.js';
import useProjectStore from '../../store/projectStore.js';
import useTaskStore from '../../store/taskStore.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

function SettingsPage() {
  useDocumentTitle('Settings');
  const { theme, setTheme, toast } = useUIStore();
  const { user } = useAuthStore();
  const [notifs, setNotifs] = useState({
    taskCreated: true,
    taskDone: true,
    mentions: true,
    weekly: false,
  });

  function handleTheme(t) {
    setTheme(t);
    toast.info(`Switched to ${t} mode`);
  }

  function clearData() {
    if (!window.confirm('Clear all local data? This cannot be undone.')) return;
    const keys = Object.keys(localStorage).filter(k =>
      k.startsWith('projects_') || k.startsWith('tasks_') || k.startsWith('profile_')
    );
    keys.forEach(k => localStorage.removeItem(k));
    toast.success('Local data cleared. Refresh to start fresh.');
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Settings</h2>
      </div>

      <div className="settings-layout">
        {/* Appearance */}
        <div className="dashboard-card settings-section">
          <div className="settings-section-header">
            <Palette size={18} />
            <h3>Appearance</h3>
          </div>
          <p className="settings-desc">Choose how TaskFlow looks for you.</p>
          <div className="theme-options">
            {[
              { value: 'dark', label: 'Dark', icon: Moon },
              { value: 'light', label: 'Light', icon: Sun },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                className={`theme-option ${theme === value ? 'theme-option-active' : ''}`}
                onClick={() => handleTheme(value)}
                id={`theme-${value}-btn`}
              >
                <Icon size={20} />
                <span>{label}</span>
                {theme === value && <span className="theme-check">✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="dashboard-card settings-section">
          <div className="settings-section-header">
            <Bell size={18} />
            <h3>Notifications</h3>
          </div>
          <p className="settings-desc">Control which events notify you.</p>
          <div className="settings-toggles">
            {[
              { key: 'taskCreated', label: 'Task created' },
              { key: 'taskDone', label: 'Task completed' },
              { key: 'mentions', label: 'Mentions' },
              { key: 'weekly', label: 'Weekly digest' },
            ].map(({ key, label }) => (
              <label key={key} className="toggle-row">
                <span className="toggle-label">{label}</span>
                <input
                  type="checkbox"
                  className="toggle-checkbox"
                  checked={notifs[key]}
                  onChange={e => setNotifs(n => ({ ...n, [key]: e.target.checked }))}
                  id={`notif-${key}`}
                />
                <span className="toggle-switch" />
              </label>
            ))}
          </div>
        </div>

        {/* Account */}
        <div className="dashboard-card settings-section">
          <div className="settings-section-header">
            <Shield size={18} />
            <h3>Account</h3>
          </div>
          <div className="settings-info-row">
            <span className="settings-info-label">Email</span>
            <span className="settings-info-value">{user?.email}</span>
          </div>
          <div className="settings-info-row">
            <span className="settings-info-label">Account type</span>
            <span className="settings-info-value">{user?.isDemo ? 'Demo' : 'Firebase'}</span>
          </div>
        </div>

        {/* Danger zone */}
        <div className="dashboard-card settings-section settings-danger">
          <div className="settings-section-header">
            <Trash2 size={18} />
            <h3>Danger Zone</h3>
          </div>
          <p className="settings-desc">Destructive actions. Be careful.</p>
          <button
            className="btn btn-danger"
            onClick={clearData}
            id="clear-data-btn"
          >
            <Trash2 size={15} /> Clear All Local Data
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
