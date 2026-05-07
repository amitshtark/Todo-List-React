import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, ArrowLeft, CheckSquare, Settings2 } from 'lucide-react';
import useProjectStore from '../../store/projectStore.js';
import useTaskStore from '../../store/taskStore.js';
import useAuthStore from '../../store/authStore.js';
import useUIStore from '../../store/uiStore.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import TaskCard from '../../components/tasks/TaskCard.jsx';
import FilterBar from '../../components/tasks/FilterBar.jsx';
import TaskDetailPanel from '../../components/tasks/TaskDetailPanel.jsx';
import CreateTaskModal from '../../components/tasks/CreateTaskModal.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { PageLoader } from '../../components/ui/Spinner.jsx';
import { STATUS, STATUS_LABELS } from '../../utils/constants.js';

function ProjectDetailPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { projects, fetchProjects } = useProjectStore();
  const { fetchTasks, getFilteredTasks, deleteTask, loading } = useTaskStore();
  const { user } = useAuthStore();
  const { openModal, toast } = useUIStore();
  const [viewMode, setViewMode] = useState('board'); // 'board' | 'list'

  const project = projects.find(p => p.id === projectId);
  useDocumentTitle(project?.name || 'Project');

  useEffect(() => {
    if (user && projects.length === 0) fetchProjects(user.uid);
  }, [user?.uid]);

  useEffect(() => {
    if (projectId) fetchTasks(projectId);
  }, [projectId]);

  const tasks = getFilteredTasks(projectId);

  async function handleDelete(taskId) {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(projectId, taskId);
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  }

  if (!project && !loading) {
    return (
      <div className="page">
        <EmptyState title="Project not found" description="This project may have been deleted." />
      </div>
    );
  }

  if (!project) return <PageLoader />;

  // Group tasks by status for board view
  const columns = Object.entries(STATUS_LABELS).map(([status, label]) => ({
    status,
    label,
    tasks: tasks.filter(t => t.status === status),
  }));

  return (
    <div className="page page-project">
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button className="btn btn-ghost btn-icon-sm" onClick={() => navigate('/projects')} aria-label="Back">
            <ArrowLeft size={18} />
          </button>
          <div
            className="project-header-dot"
            style={{ background: project.color || '#6366f1' }}
          />
          <div>
            <h2 className="page-title">{project.name}</h2>
            {project.description && <p className="page-subtitle">{project.description}</p>}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {/* View toggle */}
          <div className="view-toggle">
            <button
              className={`view-toggle-btn ${viewMode === 'board' ? 'active' : ''}`}
              onClick={() => setViewMode('board')}
              id="view-board-btn"
              title="Board view"
            >
              Board
            </button>
            <button
              className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              id="view-list-btn"
              title="List view"
            >
              List
            </button>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => openModal('createTask')}
            id="project-new-task-btn"
          >
            <Plus size={16} /> New Task
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <FilterBar />

      {/* Board view */}
      {viewMode === 'board' && (
        <div className="board-view">
          {columns.map(col => (
            <div key={col.status} className="board-column">
              <div className="board-column-header">
                <span className="board-column-label">{col.label}</span>
                <span className="board-column-count">{col.tasks.length}</span>
              </div>
              <div className="board-column-tasks">
                {col.tasks.length === 0 ? (
                  <div className="board-column-empty">No tasks</div>
                ) : (
                  col.tasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      projectId={projectId}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List view */}
      {viewMode === 'list' && (
        <div className="list-view">
          {tasks.length === 0 ? (
            <EmptyState
              icon={CheckSquare}
              title="No tasks yet"
              description="Create your first task to get started."
              action={
                <button className="btn btn-primary" onClick={() => openModal('createTask')}>
                  <Plus size={16} /> New Task
                </button>
              }
            />
          ) : (
            <div className="task-list">
              {tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  projectId={projectId}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Task detail panel */}
      {searchParams.get('task') && <TaskDetailPanel projectId={projectId} />}

      {/* Modals */}
      <CreateTaskModal defaultProjectId={projectId} />
    </div>
  );
}

export default ProjectDetailPage;
