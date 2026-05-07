import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sun, Moon, Bell, Plus, X } from 'lucide-react';
import useUIStore from '../../store/uiStore.js';
import useAuthStore from '../../store/authStore.js';
import useTaskStore from '../../store/taskStore.js';
import useProjectStore from '../../store/projectStore.js';
import { useDebounce } from '../../hooks/useDebounce.js';
import Avatar from '../ui/Avatar.jsx';

function Topbar({ title }) {
  const { theme, toggleTheme, notifications, openModal } = useUIStore();
  const { user } = useAuthStore();
  const { projects } = useProjectStore();
  const { tasksByProject } = useTaskStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const debounced = useDebounce(searchQuery, 200);

  // Search across all tasks
  const allTasks = Object.values(tasksByProject).flat();
  const results = debounced.length > 1
    ? allTasks.filter(t =>
        t.title?.toLowerCase().includes(debounced.toLowerCase()) ||
        t.description?.toLowerCase().includes(debounced.toLowerCase())
      ).slice(0, 8)
    : [];

  const unread = notifications.length;

  return (
    <header className="topbar">
      <div className="topbar-left">
        {title && <h1 className="topbar-title">{title}</h1>}
      </div>

      <div className="topbar-right">
        {/* Search */}
        <div className="topbar-search" ref={searchRef}>
          <div className={`search-input-wrap ${searchOpen ? 'search-open' : ''}`}>
            <Search size={16} className="search-icon" />
            <input
              id="global-search"
              className="search-input"
              placeholder="Search tasks…"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setSearchOpen(true); }}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
              aria-label="Search tasks"
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => { setSearchQuery(''); }}>
                <X size={14} />
              </button>
            )}
          </div>
          {searchOpen && results.length > 0 && (
            <div className="search-dropdown" role="listbox">
              {results.map(t => {
                const project = projects.find(p => p.id === t.projectId);
                return (
                  <button
                    key={t.id}
                    className="search-result-item"
                    onMouseDown={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                      navigate(`/projects/${t.projectId}?task=${t.id}`);
                    }}
                  >
                    <span className="search-result-title">{t.title}</span>
                    {project && (
                      <span className="search-result-project" style={{ color: project.color }}>
                        {project.name}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* New task */}
        <button
          className="btn btn-primary btn-sm topbar-action"
          onClick={() => openModal('createTask')}
          id="topbar-new-task-btn"
        >
          <Plus size={15} />
          <span>New Task</span>
        </button>

        {/* Notifications */}
        <button
          className="topbar-icon-btn"
          onClick={() => navigate('/notifications')}
          aria-label="Notifications"
          id="topbar-notifications-btn"
          title="Notifications"
        >
          <Bell size={18} />
          {unread > 0 && <span className="notif-badge">{unread > 9 ? '9+' : unread}</span>}
        </button>

        {/* Theme toggle */}
        <button
          className="topbar-icon-btn"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          id="topbar-theme-btn"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Avatar */}
        <button
          className="topbar-avatar-btn"
          onClick={() => navigate('/profile')}
          id="topbar-avatar-btn"
          aria-label="Profile"
        >
          <Avatar name={user?.displayName || user?.email} photoURL={user?.photoURL} size={32} />
        </button>
      </div>
    </header>
  );
}

export default Topbar;
