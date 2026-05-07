import { getInitials } from '../../utils/helpers.js';

function Avatar({ name = '', photoURL, size = 36, className = '' }) {
  const initials = getInitials(name);
  const colors = [
    '#6366f1','#8b5cf6','#ec4899','#f43f5e',
    '#f97316','#14b8a6','#0ea5e9','#22c55e',
  ];
  // Deterministic color from name
  const color = colors[(name.charCodeAt(0) || 0) % colors.length];

  if (photoURL) {
    return (
      <img
        src={photoURL}
        alt={name}
        className={`avatar ${className}`}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }}
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div
      className={`avatar avatar-initials ${className}`}
      style={{
        width: size,
        height: size,
        background: color,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: Math.floor(size * 0.38),
        fontWeight: 700,
        color: '#fff',
        flexShrink: 0,
        userSelect: 'none',
      }}
      aria-label={name}
    >
      {initials || '?'}
    </div>
  );
}

export default Avatar;
