interface UsageCardProps {
  title: string;
  used: number;
  limit: number;
  unit?: string;
}

export function UsageCard({ title, used, limit, unit }: UsageCardProps) {
  const percentage = (used / limit) * 100;
  return (
    <div className="usage-card">
      <h4>{title}</h4>
      <div className="progress-bar" style={{ width: `${percentage}%` }} />
      <div>
        {used} / {limit} {unit}
      </div>
    </div>
  );
} 