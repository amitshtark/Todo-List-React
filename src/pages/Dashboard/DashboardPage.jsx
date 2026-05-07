import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, CheckSquare, CheckCircle2, Clock, Zap, Plus } from 'lucide-react';
import useAuthStore from '../../store/authStore.js';
import useProjectStore from '../../store/projectStore.js';
import useTaskStore from '../../store/taskStore.js';
import useUIStore from '../../store/uiStore.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import StatCard from '../../components/dashboard/StatCard.jsx';
import RecentTasksList from '../../components/dashboard/RecentTasksList.jsx';
import { PageLoader } from '../../components/ui/Spinner.jsx';
import { STATUS } from '../../utils/constants.js';

function DashboardPage() {
  useDocumentTitle('Dashboard');
  const { user } = useAuthStore();
  const { projects, fetchProjects, loading: projectsLoading } = useProjectStore();
  const { tasksByProject, fetchTasks } = useTaskStore();
  const { openModal } = useUIStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) fetchProjects(user.uid);
  }, [user?.uid]);

  useEffect(() => {
    projects.forEach(p => fetchTasks(p.id));
  }, [projects.length]);

  const allTasks = Object.values(tasksByProject).flat();
  const doneTasks = allTasks.filter(t => t.status === STATUS.DONE);
  const inProgress = allTasks.filter(t => t.status === STATUS.IN_PROGRESS);
  const overdue = allTasks.filter(t =>
    t.dueDate && new Date(t.dueDate) < new Date() && t.status !== STATUS.DONE
  );

  // Enrich tasks with project info for display
  const enrichedTasks = allTasks.map(t => {
    const proj = projects.find(p => p.id === t.projectId);
    return { ...t, projectName: proj?.name, projectColor: proj?.color };
  });

  const recent = [...enrichedTasks]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 8);

  if (projectsLoading && projects.length === 0) return <PageLoader />;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.displayName?.split(' ')[0] || 'there';

  return (
    <div className="page">
      {/* Greeting */}
      <div className="dashboard-greeting">
        <div>
          <h2 className="greeting-title">{greeting}, {firstName} 👋</h2>
          <p className="greeting-subtitle">Here's what's happening with your projects today.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => openModal('createProject')}
          id="dashboard-new-project-btn"
        >
          <Plus size={16} /> New Project
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard
          id="stat-projects"
          label="Total Projects"
          value={projects.length}
          icon={FolderKanban}
          color="#6366f1"
        />
        <StatCard
          id="stat-tasks"
          label="Total Tasks"
          value={allTasks.length}
          icon={CheckSquare}
          color="#8b5cf6"
        />
        <StatCard
          id="stat-done"
          label="Completed"
          value={doneTasks.length}
          icon={CheckCircle2}
          color="#22c55e"
          trend="up"
          trendValue={`${allTasks.length > 0 ? Math.round(doneTasks.length / allTasks.length * 100) : 0}%`}
        />
        <StatCard
          id="stat-inprogress"
          label="In Progress"
          value={inProgress.length}
          icon={Clock}
          color="#f97316"
        />
        <StatCard
          id="stat-overdue"
          label="Overdue"
          value={overdue.length}
          icon={Zap}
          color={overdue.length > 0 ? '#ef4444' : '#6366f1'}
          trend={overdue.length > 0 ? 'down' : undefined}
        />
      </div>

      {/* Bottom grid */}
      <div className="dashboard-grid">
        {/* Recent Tasks */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3>Recent Tasks</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/tasks')}>
              View all
            </button>
          </div>
          <RecentTasksList tasks={recent} />
        </div>

        {/* Projects overview */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h3>Projects</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/projects')}>
              View all
            </button>
          </div>
          {projects.length === 0 ? (
            <div className="empty-mini">
              <p>No projects yet.</p>
              <button className="btn btn-primary btn-sm" onClick={() => openModal('createProject')}>
                Create one
              </button>
            </div>
          ) : (
            <div className="mini-project-list">
              {projects.map(p => {
                const ptasks = tasksByProject[p.id] || [];
                const done = ptasks.filter(t => t.status === STATUS.DONE).length;
                const pct = ptasks.length > 0 ? Math.round(done / ptasks.length * 100) : 0;
                return (
                  <div
                    key={p.id}
                    className="mini-project-item"
                    onClick={() => navigate(`/projects/${p.id}`)}
                    tabIndex={0}
                    role="button"
                    onKeyDown={e => e.key === 'Enter' && navigate(`/projects/${p.id}`)}
                  >
                    <div className="mini-project-dot" style={{ background: p.color }} />
                    <div className="mini-project-info">
                      <span className="mini-project-name">{p.name}</span>
                      <div className="mini-progress-bar">
                        <div className="mini-progress-fill" style={{ width: `${pct}%`, background: p.color }} />
                      </div>
                    </div>
                    <span className="mini-project-pct">{pct}%</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
