import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { X, Trash2, Calendar, User, MessageCircle, Send } from 'lucide-react';
import useTaskStore from '../../store/taskStore.js';
import useAuthStore from '../../store/authStore.js';
import useUIStore from '../../store/uiStore.js';
import { StatusBadge, PriorityBadge } from '../ui/Badge.jsx';
import { formatDateTime, formatRelative } from '../../utils/helpers.js';
import { STATUS, STATUS_LABELS, PRIORITY, PRIORITY_LABELS } from '../../utils/constants.js';
import Avatar from '../ui/Avatar.jsx';

function TaskDetailPanel({ projectId }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const taskId = searchParams.get('task');
  const { tasksByProject, updateTask, deleteTask, addComment } = useTaskStore();
  const { user } = useAuthStore();
  const { toast } = useUIStore();
  const navigate = useNavigate();

  const tasks = tasksByProject[projectId] || [];
  const task = tasks.find(t => t.id === taskId);

  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setEditTitle(task.title || '');
      setEditDesc(task.description || '');
    }
  }, [task?.id]);

  if (!taskId || !task) return null;

  function close() {
    const params = new URLSearchParams(searchParams);
    params.delete('task');
    setSearchParams(params);
  }

  async function handleSave() {
    if (!editTitle.trim()) return;
    setSaving(true);
    try {
      await updateTask(projectId, task.id, { title: editTitle, description: editDesc });
      toast.success('Task updated');
    } catch {
      toast.error('Failed to update task');
    } finally {
      setSaving(false);
    }
  }

  async function handleFieldUpdate(field, value) {
    try {
      await updateTask(projectId, task.id, { [field]: value });
      toast.info('Updated');
    } catch {
      toast.error('Failed to update');
    }
  }

  async function handleDelete() {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(projectId, task.id);
      toast.success('Task deleted');
      close();
    } catch {
      toast.error('Failed to delete');
    }
  }

  async function handleComment(e) {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await addComment(projectId, task.id, {
        text: comment,
        authorId: user.uid,
        authorName: user.displayName || user.email,
        authorPhoto: user.photoURL,
      });
      setComment('');
    } catch {
      toast.error('Failed to add comment');
    }
  }

  return (
    <div className="task-detail-overlay" onClick={close}>
      <div
        className="task-detail-panel"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-label={`Task: ${task.title}`}
      >
        {/* Header */}
        <div className="detail-header">
          <div className="detail-badges">
            <PriorityBadge priority={task.priority} />
            <StatusBadge status={task.status} />
          </div>
          <div className="detail-actions">
            <button className="btn-icon btn-icon-danger" onClick={handleDelete} title="Delete task" id="detail-delete-btn">
              <Trash2 size={16} />
            </button>
            <button className="btn-icon" onClick={close} title="Close" id="detail-close-btn">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Title */}
        <input
          className="detail-title-input"
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          onBlur={handleSave}
          aria-label="Task title"
          id="detail-title-input"
        />

        {/* Description */}
        <textarea
          className="detail-desc-input"
          placeholder="Add a description…"
          value={editDesc}
          onChange={e => setEditDesc(e.target.value)}
          onBlur={handleSave}
          rows={4}
          aria-label="Task description"
          id="detail-desc-input"
        />

        {/* Metadata fields */}
        <div className="detail-meta-grid">
          <div className="detail-meta-row">
            <span className="detail-meta-label">Status</span>
            <select
              className="form-input form-select detail-select"
              value={task.status}
              onChange={e => handleFieldUpdate('status', e.target.value)}
              id="detail-status-select"
            >
              {Object.entries(STATUS_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>

          <div className="detail-meta-row">
            <span className="detail-meta-label">Priority</span>
            <select
              className="form-input form-select detail-select"
              value={task.priority}
              onChange={e => handleFieldUpdate('priority', e.target.value)}
              id="detail-priority-select"
            >
              {Object.entries(PRIORITY_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>

          <div className="detail-meta-row">
            <span className="detail-meta-label"><Calendar size={13} /> Due</span>
            <input
              type="date"
              className="form-input detail-date-input"
              value={task.dueDate || ''}
              onChange={e => handleFieldUpdate('dueDate', e.target.value)}
              id="detail-due-input"
            />
          </div>

          <div className="detail-meta-row">
            <span className="detail-meta-label"><User size={13} /> Assignee</span>
            <span className="detail-meta-value">{task.assigneeName || '—'}</span>
          </div>

          <div className="detail-meta-row">
            <span className="detail-meta-label">Created</span>
            <span className="detail-meta-value">{formatDateTime(task.createdAt)}</span>
          </div>

          <div className="detail-meta-row">
            <span className="detail-meta-label">Updated</span>
            <span className="detail-meta-value">{formatRelative(task.updatedAt)}</span>
          </div>
        </div>

        {/* Comments */}
        <div className="detail-comments">
          <h4 className="detail-comments-title">
            <MessageCircle size={15} /> Comments ({(task.comments || []).length})
          </h4>

          <div className="comments-list">
            {(task.comments || []).length === 0 ? (
              <p className="comments-empty">No comments yet.</p>
            ) : (
              task.comments.map(c => (
                <div key={c.id} className="comment-item">
                  <Avatar name={c.authorName} photoURL={c.authorPhoto} size={28} />
                  <div className="comment-body">
                    <div className="comment-header">
                      <span className="comment-author">{c.authorName}</span>
                      <span className="comment-time">{formatRelative(c.createdAt)}</span>
                    </div>
                    <p className="comment-text">{c.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <form className="comment-form" onSubmit={handleComment}>
            <Avatar name={user?.displayName} photoURL={user?.photoURL} size={28} />
            <input
              className="form-input comment-input"
              placeholder="Add a comment…"
              value={comment}
              onChange={e => setComment(e.target.value)}
              id="comment-input"
              aria-label="Add comment"
            />
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={!comment.trim()}
              id="comment-submit-btn"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TaskDetailPanel;
