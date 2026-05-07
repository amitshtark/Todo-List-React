import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore.js';
import { PageLoader } from '../ui/Spinner.jsx';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore();

  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

export default ProtectedRoute;
