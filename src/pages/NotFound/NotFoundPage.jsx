import { Link } from 'react-router-dom';
import { Home, Zap } from 'lucide-react';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';

function NotFoundPage() {
  useDocumentTitle('404 Not Found');
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="logo-icon logo-icon-lg" style={{ margin: '0 auto 1.5rem' }}>
          <Zap size={28} fill="currentColor" />
        </div>
        <h1 className="not-found-code">404</h1>
        <h2 className="not-found-title">Page not found</h2>
        <p className="not-found-desc">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/dashboard" className="btn btn-primary" id="not-found-home-btn">
          <Home size={16} /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
