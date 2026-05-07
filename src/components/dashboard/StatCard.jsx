import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

function StatCard({ label, value, icon: Icon, trend, trendValue, color = '#6366f1', id }) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'var(--color-success)' : trend === 'down' ? 'var(--color-error)' : 'var(--text-tertiary)';

  return (
    <div className="stat-card" id={id}>
      <div className="stat-icon" style={{ background: `${color}18`, color }}>
        <Icon size={22} />
      </div>
      <div className="stat-body">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
        {trendValue !== undefined && (
          <span className="stat-trend" style={{ color: trendColor }}>
            <TrendIcon size={12} />
            {trendValue}
          </span>
        )}
      </div>
    </div>
  );
}

export default StatCard;
