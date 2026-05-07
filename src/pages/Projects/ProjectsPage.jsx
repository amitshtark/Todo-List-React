import { useEffect } from 'react';
import { Plus, FolderOpen } from 'lucide-react';
import useAuthStore from '../../store/authStore.js';
import useProjectStore from '../../store/projectStore.js';
import useTaskStore from '../../store/taskStore.js';
import useUIStore from '../../store/uiStore.js';
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js';
import ProjectCard from '../../components/projects/ProjectCard.jsx';
import CreateProjectModal from '../../components/projects/CreateProjectModal.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { PageLoader } from '../../components/ui/Spinner.jsx';
import { STATUS } from '../../utils/constants.js';

function ProjectsPage() {
  useDocumentTitle('Projects');
  const { user } = useAuthStore();
  const { projects, fetchProjects, loading } = useProjectStore();
  const { tasksByProject, fetchTasks } = useTaskStore();
  const { openModal } = useUIStore();

  useEffect(() => {
    if (user) fetchProjects(user.uid);
  }, [user?.uid]);

  useEffect(() => {
    projects.forEach(p => fetchTasks(p.id));
  }, [projects.length]);

  // Enrich projects with task counts for cards
  const enrichedProjects = projects.map(p => {
    const tasks = tasksByProject[p.id] || [];
    return {
      ...p,
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === STATUS.DONE).length,
    };
  });

  if (loading && projects.length === 0) return <PageLoader />;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Projects</h2>
          <p className="page-subtitle">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => openModal('createProject')}
          id="new-project-btn"
        >
          <Plus size={16} /> New Project
        </button>
      </div>

      {enrichedProjects.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title="No projects yet"
          description="Create your first project to start organizing tasks."
          action={
            <button className="btn btn-primary" onClick={() => openModal('createProject')}>
              <Plus size={16} /> Create Project
            </button>
          }
        />
      ) : (
        <div className="projects-grid">
          {enrichedProjects.map(p => (
            <ProjectCard key={p.id} project={p} />
          ))}
          {/* Add project tile */}
          <button
            className="project-card project-card-new"
            onClick={() => openModal('createProject')}
            id="add-project-tile"
            aria-label="Create new project"
          >
            <Plus size={28} />
            <span>New Project</span>
          </button>
        </div>
      )}

      <CreateProjectModal />
    </div>
  );
}

export default ProjectsPage;
