
interface SkeletonCardProps {
  height?: number;
  lines?: number;
  className?: string;
}

export function SkeletonCard({ height, lines = 3, className }: SkeletonCardProps) {
  return (
    <div
      className={`card ${className ?? ''}`}
      style={{ padding: 20, height: height ?? 'auto' }}
    >
      <div className="skeleton" style={{ height: 14, width: '45%', marginBottom: 16 }} />
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{
            height: 12,
            width: i === lines - 1 ? '65%' : '100%',
            marginBottom: i < lines - 1 ? 10 : 0,
          }}
        />
      ))}
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 0',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="skeleton" style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div className="skeleton" style={{ height: 12, width: '40%', marginBottom: 6 }} />
        <div className="skeleton" style={{ height: 10, width: '65%' }} />
      </div>
      <div className="skeleton" style={{ width: 60, height: 20, borderRadius: 99 }} />
    </div>
  );
}
