function Spinner({ size = 24, className = '' }) {
  return (
    <div
      className={`spinner ${className}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  );
}

export function PageLoader() {
  return (
    <div className="page-loader">
      <Spinner size={40} />
      <p className="page-loader-text">Loading…</p>
    </div>
  );
}

export default Spinner;
