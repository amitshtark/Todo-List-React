import { useState } from 'react';
import { Plus } from 'lucide-react';
import useTaskStore from '../../store/taskStore.js';
import useAuthStore from '../../store/authStore.js';
import useUIStore from '../../store/uiStore.js';
import useProjectStore from '../../store/projectStore.js';
import Modal from '../ui/Modal.jsx';
import ErrorMessage from '../ui/ErrorMessage.jsx';
import { STATUS, PRIORITY, STATUS_LABELS, PRIORITY_LABELS } from '../../utils/constants.js';

const INITIAL = {
  title: '',
  description: '',
  status: STATUS.TODO,
  priority: PRIORITY.MEDIUM,
  dueDate: '',
  projectId: '',
};

function CreateTaskModal({ defaultProjectId }) {
  const { createTask } = useTaskStore();
  const { user } = useAuthStore();
  const { closeModal, toast } = useUIStore();
  const { projects } = useProjectStore();
  const [form, setForm] = useState({ ...INITIAL, projectId: defaultProjectId || '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.projectId) return;
    setLoading(true);
    setError(null);
    try {
      await createTask(form.projectId, {
        ...form,
        createdBy: user.uid,
        assignee: user.uid,
        assigneeName: user.displayName || user.email,
      });
      toast.success('Task created!');
      setForm({ ...INITIAL, projectId: defaultProjectId || '' });
      closeModal('createTask');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal name="createTask" title="New Task" size="md">
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="form-label" htmlFor="task-title">Title *</label>
          <input
            id="task-title"
            className="form-input"
            placeholder="What needs to be done?"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            required
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="task-desc">Description</label>
          <textarea
            id="task-desc"
            className="form-input form-textarea"
            placeholder="Add details…"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            rows={3}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="task-project">Project *</label>
            <select
              id="task-project"
              className="form-input form-select"
              value={form.projectId}
              onChange={e => setForm(f => ({ ...f, projectId: e.target.value }))}
              required
            >
              <option value="">Select project…</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-status">Status</label>
            <select
              id="task-status"
              className="form-input form-select"
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
            >
              {Object.entries(STATUS_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="task-priority">Priority</label>
            <select
              id="task-priority"
              className="form-input form-select"
              value={form.priority}
              onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
            >
              {Object.entries(PRIORITY_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-due">Due Date</label>
            <input
              id="task-due"
              type="date"
              className="form-input"
              value={form.dueDate}
              onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
            />
          </div>
        </div>

        <ErrorMessage message={error} />

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={() => closeModal('createTask')}>
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !form.title.trim() || !form.projectId}
            id="create-task-submit-btn"
          >
            {loading ? 'Creating…' : (<><Plus size={16} /> Create Task</>)}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateTaskModal;
