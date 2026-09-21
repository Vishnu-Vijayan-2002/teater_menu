export default function StatCard({
  title,
  value,
  change,
  icon: Icon,
  variant = "gold",
}) {
  return (
    <div className={`stat-card stat-${variant}`}>
      <div className="stat-card-top">
        <div className="stat-icon">
          <Icon size={21} />
        </div>

        {change && (
          <span className="stat-change">
            {change}
          </span>
        )}
      </div>

      <div className="stat-card-content">
        <span>{title}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}