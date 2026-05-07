import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FolderKanban, CheckSquare, Bell,
  Settings, LogOut, ChevronLeft, ChevronRight, Plus,
  Zap,
} from 'lucide-react';
import useAuthStore from '../../store/authStore.js';
import useUIStore from '../../store/uiStore.js';
import useProjectStore from '../../store/projectStore.js';
import Avatar from '../ui/Avatar.jsx';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/tasks', icon: CheckSquare, label: 'My Tasks' },
  { to: '/notifications', icon: Bell, label: 'Notifications' },
];

function Sidebar() {
  const { user, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar, openModal } = useUIStore();
  const { projects } = useProjectStore();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <aside className={`sidebar ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Zap size={18} fill="currentColor" />
        </div>
        {!sidebarCollapsed && <span className="logo-text">TaskFlow</span>}
      </div>

      {/* Collapse toggle */}
      <button
        className="sidebar-toggle"
        onClick={toggleSidebar}
        aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        id="sidebar-toggle-btn"
      >
        {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Main nav */}
      <nav className="sidebar-nav" aria-label="Main navigation">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
            title={sidebarCollapsed ? label : undefined}
          >
            <Icon size={18} />
            {!sidebarCollapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Projects quick list */}
      {!sidebarCollapsed && projects.length > 0 && (
        <div className="sidebar-section">
          <div className="sidebar-section-header">
            <span>Projects</span>
            <button
              className="sidebar-new-btn"
              onClick={() => openModal('createProject')}
              title="New project"
              id="sidebar-new-project-btn"
            >
              <Plus size={14} />
            </button>
          </div>
          <div className="sidebar-projects">
            {projects.slice(0, 6).map(p => (
              <NavLink
                key={p.id}
                to={`/projects/${p.id}`}
                className={({ isActive }) => `sidebar-project-link ${isActive ? 'sidebar-link-active' : ''}`}
              >
                <span
                  className="project-dot"
                  style={{ background: p.color || '#6366f1' }}
                />
                <span className="project-link-label">{p.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      )}

      {/* Bottom: settings + user */}
      <div className="sidebar-bottom">
        <NavLink
          to="/settings"
          className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
          title={sidebarCollapsed ? 'Settings' : undefined}
        >
          <Settings size={18} />
          {!sidebarCollapsed && <span>Settings</span>}
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) => `sidebar-user ${isActive ? 'sidebar-link-active' : ''}`}
          title={sidebarCollapsed ? user?.displayName : undefined}
        >
          <Avatar name={user?.displayName || user?.email} photoURL={user?.photoURL} size={32} />
          {!sidebarCollapsed && (
            <div className="sidebar-user-info">
              <span className="sidebar-user-name">{user?.displayName || 'User'}</span>
              <span className="sidebar-user-email">{user?.email}</span>
            </div>
          )}
        </NavLink>

        <button
          className="sidebar-link sidebar-logout"
          onClick={handleLogout}
          title={sidebarCollapsed ? 'Logout' : undefined}
          id="logout-btn"
        >
          <LogOut size={18} />
          {!sidebarCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
