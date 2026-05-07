import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';
import NotificationCenter from '../ui/NotificationCenter.jsx';
import useUIStore from '../../store/uiStore.js';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/projects': 'Projects',
  '/tasks': 'My Tasks',
  '/notifications': 'Notifications',
  '/settings': 'Settings',
  '/profile': 'Profile',
};

function AppLayout() {
  const { sidebarCollapsed, theme } = useUIStore();
  const { pathname } = useLocation();

  const title = Object.entries(PAGE_TITLES).find(([path]) =>
    pathname === path || pathname.startsWith(path + '/')
  )?.[1];

  return (
    <div className={`app-layout ${theme}`} data-theme={theme}>
      <Sidebar />
      <div className={`main-area ${sidebarCollapsed ? 'main-area-expanded' : ''}`}>
        <Topbar title={title} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
      <NotificationCenter />
    </div>
  );
}

export default AppLayout;
