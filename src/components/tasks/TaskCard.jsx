import { useState } from 'react';
import { Trash2, ExternalLink, Calendar, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useTaskStore from '../../store/taskStore.js';
import useUIStore from '../../store/uiStore.js';
import { StatusBadge, PriorityBadge } from '../ui/Badge.jsx';
import { formatDate } from '../../utils/helpers.js';
import { STATUS, STATUS_LABELS } from '../../utils/constants.js';

function TaskCard({ task, projectId, onDelete }) {
  const { updateTask } = useTaskStore();
  const { toast } = useUIStore();
  const navigate = useNavigate();
  const [statusUpdating, setStatusUpdating] = useState(false);

  async function handleStatusChange(e) {
    e.stopPropagation();
    setStatusUpdating(true);
    try {
      await updateTask(projectId, task.id, { status: e.target.value });
      toast.info('Status updated');
    } catch {
      toast.error('Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  }

  const isOverdue = task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== STATUS.DONE;

  return (
    <div
      className={`task-card ${task.status === STATUS.DONE ? 'task-card-done' : ''} ${isOverdue ? 'task-card-overdue' : ''}`}
      onClick={() => navigate(`/projects/${projectId}?task=${task.id}`)}
      tabIndex={0}
      role="button"
      onKeyDown={e => e.key === 'Enter' && navigate(`/projects/${projectId}?task=${task.id}`)}
      aria-label={`Task: ${task.title}`}
    >
      <div className="task-card-header">
        <div className="task-badges">
          <PriorityBadge priority={task.priority} />
        </div>
        <div className="task-card-actions" onClick={e => e.stopPropagation()}>
          <button
            className="btn-icon"
            onClick={() => navigate(`/projects/${projectId}?task=${task.id}`)}
            title="View details"
            aria-label="View task details"
          >
            <ExternalLink size={13} />
          </button>
          {onDelete && (
            <button
              className="btn-icon btn-icon-danger"
              onClick={e => { e.stopPropagation(); onDelete(task.id); }}
              title="Delete task"
              aria-label="Delete task"
              id={`delete-task-${task.id}`}
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>

      <h4 className={`task-title ${task.status === STATUS.DONE ? 'task-title-done' : ''}`}>
        {task.title}
      </h4>

      {task.description && (
        <p className="task-desc">{task.description}</p>
      )}

      <div className="task-meta">
        {task.dueDate && (
          <span className={`task-meta-item ${isOverdue ? 'task-meta-overdue' : ''}`}>
            <Calendar size={12} />
            {formatDate(task.dueDate)}
          </span>
        )}
        {task.assigneeName && (
          <span className="task-meta-item">
            <User size={12} />
            {task.assigneeName}
          </span>
        )}
      </div>

      <div className="task-card-footer" onClick={e => e.stopPropagation()}>
        <select
          className="task-status-select"
          value={task.status}
          onChange={handleStatusChange}
          disabled={statusUpdating}
          aria-label="Change task status"
          id={`task-status-${task.id}`}
        >
          {Object.entries(STATUS_LABELS).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
        <StatusBadge status={task.status} />
      </div>
    </div>
  );
}

export default TaskCard;
