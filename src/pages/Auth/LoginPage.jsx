import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, User, Eye, EyeOff, Globe } from 'lucide-react';
import useAuthStore from '../../store/authStore.js';
import useUIStore from '../../store/uiStore.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import ErrorMessage from '../../components/ui/ErrorMessage.jsx';
import Spinner from '../../components/ui/Spinner.jsx';

function LoginPage() {
  useDocumentTitle('Sign In');
  const { loginWithEmail, loginWithGoogle, register, clearError, error, demoMode, loginDemo } = useAuthStore();
  const { toast } = useUIStore();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ email: '', password: '', displayName: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  function set(field, val) {
    setForm(f => ({ ...f, [field]: val }));
    setLocalError(null);
    clearError();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setLocalError(null);
    try {
      if (mode === 'login') {
        await loginWithEmail(form.email, form.password);
      } else {
        if (!form.displayName.trim()) { setLocalError('Name is required'); setLoading(false); return; }
        await register(form.email, form.password, form.displayName);
      }
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setLocalError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDemo() {
    loginDemo('Demo User', 'demo@taskflow.app');
    toast.success('Signed in as Demo User');
    navigate('/dashboard', { replace: true });
  }

  const combinedError = localError || error;

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="logo-icon logo-icon-lg">
            <Zap size={28} fill="currentColor" />
          </div>
          <span className="logo-text logo-text-lg">TaskFlow</span>
        </div>
        <h1 className="auth-headline">
          Manage projects.<br />
          <span className="auth-headline-accent">Ship faster.</span>
        </h1>
        <p className="auth-tagline">
          A Trello-inspired project management tool built for modern teams.
          Track tasks, collaborate, and ship with confidence.
        </p>
        <div className="auth-features">
          {['30+ React components', 'Zustand global state', 'Firebase Auth', 'React Router v7'].map(f => (
            <div key={f} className="auth-feature-item">
              <span className="auth-feature-dot" />
              {f}
            </div>
          ))}
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>{mode === 'login' ? 'Welcome back' : 'Create account'}</h2>
            <p>{mode === 'login' ? 'Sign in to your workspace' : 'Start your free workspace'}</p>
          </div>

          {/* Google / Demo */}
          <div className="auth-social">
            <button
              className="btn btn-outline auth-social-btn"
              onClick={handleGoogle}
              disabled={loading}
              id="login-google-btn"
            >
              <Globe size={16} />
              Continue with Google
            </button>
            <button
              className="btn btn-ghost auth-demo-btn"
              onClick={handleDemo}
              disabled={loading}
              id="login-demo-btn"
            >
              Try Demo (no account needed)
            </button>
          </div>

          <div className="auth-divider"><span>or</span></div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label" htmlFor="auth-name">Full name</label>
                <div className="input-icon-wrap">
                  <User size={15} className="input-icon" />
                  <input
                    id="auth-name"
                    className="form-input input-with-icon"
                    placeholder="Jane Smith"
                    value={form.displayName}
                    onChange={e => set('displayName', e.target.value)}
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="auth-email">Email</label>
              <div className="input-icon-wrap">
                <Mail size={15} className="input-icon" />
                <input
                  id="auth-email"
                  type="email"
                  className="form-input input-with-icon"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="auth-password">Password</label>
              <div className="input-icon-wrap">
                <Lock size={15} className="input-icon" />
                <input
                  id="auth-password"
                  type={showPass ? 'text' : 'password'}
                  className="form-input input-with-icon"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="input-icon-right"
                  onClick={() => setShowPass(v => !v)}
                  tabIndex={-1}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <ErrorMessage message={combinedError} />

            <button
              type="submit"
              className="btn btn-primary auth-submit-btn"
              disabled={loading}
              id="auth-submit-btn"
            >
              {loading ? <Spinner size={18} /> : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="auth-switch">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              className="auth-switch-btn"
              onClick={() => { setMode(m => m === 'login' ? 'register' : 'login'); setLocalError(null); clearError(); }}
              id="auth-mode-switch-btn"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
