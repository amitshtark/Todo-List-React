import { useEffect } from 'react';
import { Plus, CheckSquare } from 'lucide-react';
import useAuthStore from '../../store/authStore.js';
import useProjectStore from '../../store/projectStore.js';
import useTaskStore from '../../store/taskStore.js';
import useUIStore from '../../store/uiStore.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import TaskCard from '../../components/tasks/TaskCard.jsx';
import FilterBar from '../../components/tasks/FilterBar.jsx';
import CreateTaskModal from '../../components/tasks/CreateTaskModal.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { PageLoader } from '../../components/ui/Spinner.jsx';

function MyTasksPage() {
  useDocumentTitle('My Tasks');
  const { user } = useAuthStore();
  const { projects, fetchProjects } = useProjectStore();
  const { tasksByProject, fetchTasks, getFilteredTasks, deleteTask, loading } = useTaskStore();
  const { openModal, toast } = useUIStore();

  useEffect(() => {
    if (user) fetchProjects(user.uid);
  }, [user?.uid]);

  useEffect(() => {
    projects.forEach(p => fetchTasks(p.id));
  }, [projects.length]);

  // Aggregate filtered tasks from all projects assigned to current user
  const allProjectIds = projects.map(p => p.id);
  const tasks = allProjectIds.flatMap(pid => getFilteredTasks(pid))
    .filter(t => t.assignee === user?.uid || t.createdBy === user?.uid);

  async function handleDelete(projectId, taskId) {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(projectId, taskId);
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    }
  }

  if (loading && Object.keys(tasksByProject).length === 0) return <PageLoader />;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">My Tasks</h2>
          <p className="page-subtitle">{tasks.length} task{tasks.length !== 1 ? 's' : ''} assigned to you</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal('createTask')} id="mytasks-new-btn">
          <Plus size={16} /> New Task
        </button>
      </div>

      <FilterBar />

      {tasks.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No tasks assigned to you"
          description="Create a task or have one assigned to you."
          action={
            <button className="btn btn-primary" onClick={() => openModal('createTask')}>
              <Plus size={16} /> New Task
            </button>
          }
        />
      ) : (
        <div className="task-list task-list-wide">
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              projectId={task.projectId}
              onDelete={(id) => handleDelete(task.projectId, id)}
            />
          ))}
        </div>
      )}

      <CreateTaskModal />
    </div>
  );
}

export default MyTasksPage;
