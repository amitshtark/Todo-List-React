import { useState } from 'react';
import { FolderPlus } from 'lucide-react';
import useProjectStore from '../../store/projectStore.js';
import useAuthStore from '../../store/authStore.js';
import useUIStore from '../../store/uiStore.js';
import Modal from '../ui/Modal.jsx';
import ErrorMessage from '../ui/ErrorMessage.jsx';
import { PROJECT_COLORS } from '../../utils/constants.js';

const INITIAL = { name: '', description: '', color: PROJECT_COLORS[0] };

function CreateProjectModal() {
  const { createProject } = useProjectStore();
  const { user } = useAuthStore();
  const { closeModal, toast } = useUIStore();
  const [form, setForm] = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await createProject(user.uid, form);
      toast.success(`Project "${form.name}" created!`);
      setForm(INITIAL);
      closeModal('createProject');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal name="createProject" title="New Project" size="md">
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="form-label" htmlFor="project-name">Project name *</label>
          <input
            id="project-name"
            className="form-input"
            placeholder="e.g. Product Redesign"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            required
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="project-desc">Description</label>
          <textarea
            id="project-desc"
            className="form-input form-textarea"
            placeholder="What is this project about?"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={3}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Color</label>
          <div className="color-picker">
            {PROJECT_COLORS.map(color => (
              <button
                key={color}
                type="button"
                className={`color-swatch ${form.color === color ? 'color-swatch-active' : ''}`}
                style={{ background: color }}
                onClick={() => setForm(f => ({ ...f, color }))}
                aria-label={`Select color ${color}`}
                id={`color-swatch-${color.replace('#', '')}`}
              />
            ))}
          </div>
        </div>

        <ErrorMessage message={error} />

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => closeModal('createProject')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !form.name.trim()}
            id="create-project-submit-btn"
          >
            {loading ? 'Creating…' : (
              <><FolderPlus size={16} /> Create Project</>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateProjectModal;
