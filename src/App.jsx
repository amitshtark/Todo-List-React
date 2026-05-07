import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore.js';
import useUIStore from './store/uiStore.js';

// Layout
import AppLayout from './components/layout/AppLayout.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';

// Pages
import LoginPage from './pages/Auth/LoginPage.jsx';
import DashboardPage from './pages/Dashboard/DashboardPage.jsx';
import ProjectsPage from './pages/Projects/ProjectsPage.jsx';
import ProjectDetailPage from './pages/Projects/ProjectDetailPage.jsx';
import MyTasksPage from './pages/Tasks/MyTasksPage.jsx';
import ProfilePage from './pages/Profile/ProfilePage.jsx';
import SettingsPage from './pages/Settings/SettingsPage.jsx';
import NotificationsPage from './pages/Notifications/NotificationsPage.jsx';
import NotFoundPage from './pages/NotFound/NotFoundPage.jsx';

// Global modals
import CreateProjectModal from './components/projects/CreateProjectModal.jsx';
import CreateTaskModal from './components/tasks/CreateTaskModal.jsx';

function App() {
  const { init } = useAuthStore();
  const { theme } = useUIStore();

  useEffect(() => {
    const unsubscribe = init();
    return () => { if (unsubscribe) unsubscribe(); };
  }, []);

  // Apply theme to root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <BrowserRouter>
      {/* Global modals accessible from anywhere */}
      <CreateProjectModal />
      <CreateTaskModal />

      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected app shell */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:projectId" element={<ProjectDetailPage />} />
          <Route path="tasks" element={<MyTasksPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;