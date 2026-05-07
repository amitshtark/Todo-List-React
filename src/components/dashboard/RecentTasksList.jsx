import { useNavigate } from 'react-router-dom';
import { StatusBadge, PriorityBadge } from '../ui/Badge.jsx';
import { formatDate } from '../../utils/helpers.js';
import { STATUS } from '../../utils/constants.js';
import { Calendar } from 'lucide-react';

function RecentTasksList({ tasks }) {
  const navigate = useNavigate();

  if (!tasks || tasks.length === 0) {
    return <p className="recent-empty">No recent tasks.</p>;
  }

  return (
    <div className="recent-tasks-list">
      {tasks.map(task => (
        <div
          key={task.id}
          className="recent-task-item"
          onClick={() => navigate(`/projects/${task.projectId}?task=${task.id}`)}
          tabIndex={0}
          role="button"
          onKeyDown={e => e.key === 'Enter' && navigate(`/projects/${task.projectId}?task=${task.id}`)}
        >
          <div className="recent-task-left">
            <span
              className={`recent-task-title ${task.status === STATUS.DONE ? 'done-text' : ''}`}
            >
              {task.title}
            </span>
            {task.projectName && (
              <span className="recent-task-project" style={{ color: task.projectColor }}>
                {task.projectName}
              </span>
            )}
          </div>
          <div className="recent-task-right">
            {task.dueDate && (
              <span className="recent-task-due">
                <Calendar size={11} />
                {formatDate(task.dueDate)}
              </span>
            )}
            <PriorityBadge priority={task.priority} />
            <StatusBadge status={task.status} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecentTasksList;
