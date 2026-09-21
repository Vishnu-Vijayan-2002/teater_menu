export default function LoadingSkeleton({ count = 6 }) {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div className="skeleton-card" key={i}>
          <div className="skeleton-image shimmer" />
          <div className="skeleton-content">
            <div className="skeleton-badge shimmer" />
            <div className="skeleton-title shimmer" />
            <div className="skeleton-desc shimmer" />
            <div className="skeleton-footer">
              <div className="skeleton-price shimmer" />
              <div className="skeleton-button shimmer" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
