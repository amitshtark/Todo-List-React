import { useNavigate } from 'react-router-dom';
import { FolderOpen, Trash2, Edit3, MoreVertical, Users, CheckSquare } from 'lucide-react';
import { useState, useRef } from 'react';
import useProjectStore from '../../store/projectStore.js';
import useAuthStore from '../../store/authStore.js';
import useUIStore from '../../store/uiStore.js';
import { formatRelative } from '../../utils/helpers.js';
import { useClickOutside } from '../../hooks/useClickOutside.js';

function ProjectCard({ project }) {
  const navigate = useNavigate();
  const { deleteProject, setActiveProject } = useProjectStore();
  const { user } = useAuthStore();
  const { toast, openModal, setDeleteTarget, modals, closeModal } = useUIStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useClickOutside(menuRef, () => setMenuOpen(false));

  function handleOpen() {
    setActiveProject(project.id);
    navigate(`/projects/${project.id}`);
  }

  async function handleDelete(e) {
    e.stopPropagation();
    setMenuOpen(false);
    if (!window.confirm(`Delete project "${project.name}"? This cannot be undone.`)) return;
    try {
      await deleteProject(user.uid, project.id);
      toast.success(`Project "${project.name}" deleted.`);
    } catch {
      toast.error('Failed to delete project.');
    }
  }

  const progress = project.totalTasks > 0
    ? Math.round((project.completedTasks / project.totalTasks) * 100)
    : 0;

  return (
    <div
      className="project-card"
      onClick={handleOpen}
      tabIndex={0}
      role="button"
      onKeyDown={e => e.key === 'Enter' && handleOpen()}
      aria-label={`Open project ${project.name}`}
    >
      {/* Color accent */}
      <div className="project-card-accent" style={{ background: project.color || '#6366f1' }} />

      <div className="project-card-header">
        <div className="project-card-icon" style={{ background: `${project.color}22`, color: project.color }}>
          <FolderOpen size={20} />
        </div>
        <div ref={menuRef} style={{ position: 'relative' }}>
          <button
            className="btn-icon project-menu-btn"
            onClick={e => { e.stopPropagation(); setMenuOpen(v => !v); }}
            aria-label="Project actions"
            id={`project-menu-${project.id}`}
          >
            <MoreVertical size={16} />
          </button>
          {menuOpen && (
            <div className="dropdown-menu" onClick={e => e.stopPropagation()}>
              <button
                className="dropdown-item"
                onClick={e => { e.stopPropagation(); setMenuOpen(false); navigate(`/projects/${project.id}/settings`); }}
              >
                <Edit3 size={14} /> Edit
              </button>
              <button
                className="dropdown-item dropdown-item-danger"
                onClick={handleDelete}
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="project-card-body">
        <h3 className="project-card-title">{project.name}</h3>
        {project.description && (
          <p className="project-card-desc">{project.description}</p>
        )}
      </div>

      {/* Stats */}
      <div className="project-card-stats">
        <span className="project-stat">
          <CheckSquare size={13} />
          {project.totalTasks || 0} tasks
        </span>
        <span className="project-stat">
          <Users size={13} />
          {project.memberCount || 1}
        </span>
      </div>

      {/* Progress bar */}
      {project.totalTasks > 0 && (
        <div className="project-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%`, background: project.color || '#6366f1' }}
            />
          </div>
          <span className="progress-label">{progress}%</span>
        </div>
      )}

      <div className="project-card-footer">
        <span className="project-updated">{formatRelative(project.updatedAt)}</span>
        <span
          className="project-status-dot"
          style={{ background: project.color || '#6366f1' }}
          title="Active"
        />
      </div>
    </div>
  );
}

export default ProjectCard;
