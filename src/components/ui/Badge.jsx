import { STATUS_LABELS, PRIORITY_LABELS, STATUS, PRIORITY } from '../../utils/constants.js';

const STATUS_STYLES = {
  [STATUS.BACKLOG]: { bg: 'var(--badge-neutral-bg)', color: 'var(--badge-neutral-color)' },
  [STATUS.TODO]: { bg: 'var(--badge-info-bg)', color: 'var(--badge-info-color)' },
  [STATUS.IN_PROGRESS]: { bg: 'var(--badge-warning-bg)', color: 'var(--badge-warning-color)' },
  [STATUS.IN_REVIEW]: { bg: 'var(--badge-purple-bg)', color: 'var(--badge-purple-color)' },
  [STATUS.DONE]: { bg: 'var(--badge-success-bg)', color: 'var(--badge-success-color)' },
  [STATUS.CANCELLED]: { bg: 'var(--badge-neutral-bg)', color: 'var(--badge-neutral-color)' },
};

const PRIORITY_STYLES = {
  [PRIORITY.LOW]: { bg: 'var(--badge-neutral-bg)', color: 'var(--badge-neutral-color)', dot: '#64748b' },
  [PRIORITY.MEDIUM]: { bg: 'var(--badge-info-bg)', color: 'var(--badge-info-color)', dot: '#38bdf8' },
  [PRIORITY.HIGH]: { bg: 'var(--badge-warning-bg)', color: 'var(--badge-warning-color)', dot: '#fb923c' },
  [PRIORITY.URGENT]: { bg: 'var(--badge-error-bg)', color: 'var(--badge-error-color)', dot: '#f87171' },
};

export function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES[STATUS.BACKLOG];
  return (
    <span
      className="badge"
      style={{ background: style.bg, color: style.color }}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  const style = PRIORITY_STYLES[priority] || PRIORITY_STYLES[PRIORITY.MEDIUM];
  return (
    <span
      className="badge"
      style={{ background: style.bg, color: style.color, display: 'inline-flex', alignItems: 'center', gap: 5 }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: style.dot, flexShrink: 0 }} />
      {PRIORITY_LABELS[priority] || priority}
    </span>
  );
}
