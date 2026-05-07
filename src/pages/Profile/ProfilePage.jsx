import { useState, useEffect } from 'react';
import { Camera, Save, User } from 'lucide-react';
import useAuthStore from '../../store/authStore.js';
import useUIStore from '../../store/uiStore.js';
import { profileApi } from '../../services/api.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import Avatar from '../../components/ui/Avatar.jsx';
import ErrorMessage from '../../components/ui/ErrorMessage.jsx';
import Spinner from '../../components/ui/Spinner.jsx';
import useProjectStore from '../../store/projectStore.js';
import useTaskStore from '../../store/taskStore.js';
import { STATUS } from '../../utils/constants.js';

function ProfilePage() {
  useDocumentTitle('Profile');
  const { user } = useAuthStore();
  const { toast } = useUIStore();
  const { projects } = useProjectStore();
  const { tasksByProject } = useTaskStore();

  const [form, setForm] = useState({ displayName: '', bio: '', title: '' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    profileApi.get(user.uid).then(profile => {
      setForm({
        displayName: user.displayName || '',
        bio: profile?.bio || '',
        title: profile?.title || '',
      });
      setLoading(false);
    });
  }, [user?.uid]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await profileApi.update(user.uid, form);
      toast.success('Profile updated!');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const allTasks = Object.values(tasksByProject).flat();
  const myTasks = allTasks.filter(t => t.assignee === user?.uid || t.createdBy === user?.uid);
  const doneTasks = myTasks.filter(t => t.status === STATUS.DONE);

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">Profile</h2>
      </div>

      <div className="profile-layout">
        {/* Left — avatar & stats */}
        <div className="profile-sidebar">
          <div className="profile-avatar-wrap">
            <Avatar name={form.displayName || user?.email} photoURL={user?.photoURL} size={96} />
            <div className="profile-avatar-badge">
              <Camera size={14} />
            </div>
          </div>
          <h3 className="profile-name">{form.displayName || user?.email}</h3>
          <p className="profile-title-text">{form.title || 'Team Member'}</p>
          <p className="profile-email">{user?.email}</p>
          {user?.isDemo && (
            <span className="badge" style={{ background: 'var(--badge-warning-bg)', color: 'var(--badge-warning-color)' }}>
              Demo Account
            </span>
          )}

          <div className="profile-stats">
            <div className="profile-stat">
              <span className="profile-stat-value">{projects.length}</span>
              <span className="profile-stat-label">Projects</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-value">{myTasks.length}</span>
              <span className="profile-stat-label">Tasks</span>
            </div>
            <div className="profile-stat">
              <span className="profile-stat-value">{doneTasks.length}</span>
              <span className="profile-stat-label">Completed</span>
            </div>
          </div>
        </div>

        {/* Right — edit form */}
        <div className="profile-main">
          <div className="dashboard-card">
            <h3 style={{ marginBottom: '1.25rem' }}>Edit Profile</h3>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                <Spinner size={32} />
              </div>
            ) : (
              <form onSubmit={handleSave} className="form">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-name">Display name</label>
                    <input
                      id="profile-name"
                      className="form-input"
                      value={form.displayName}
                      onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="profile-title">Job title</label>
                    <input
                      id="profile-title"
                      className="form-input"
                      placeholder="Full-Stack Engineer"
                      value={form.title}
                      onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="profile-bio">Bio</label>
                  <textarea
                    id="profile-bio"
                    className="form-input form-textarea"
                    placeholder="Tell your team about yourself…"
                    value={form.bio}
                    onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                    rows={4}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" value={user?.email || ''} disabled readOnly />
                </div>

                <ErrorMessage message={error} />

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                    id="profile-save-btn"
                  >
                    {saving ? <Spinner size={16} /> : <><Save size={15} /> Save Changes</>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
