import type { ActionStatus } from '../../types/risk.types';

interface StatusBadgeProps {
  status: ActionStatus | 'PROPOSED';
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<string, { bg: string; color: string; border: string; label: string }> =
  {
    PENDING: {
      bg: 'rgba(167,139,250,0.1)',
      color: 'var(--status-pending)',
      border: 'rgba(167,139,250,0.25)',
      label: 'PENDING',
    },
    PROPOSED: {
      bg: 'rgba(167,139,250,0.1)',
      color: 'var(--status-pending)',
      border: 'rgba(167,139,250,0.25)',
      label: 'PROPOSED',
    },
    APPROVED: {
      bg: 'rgba(16,185,129,0.1)',
      color: 'var(--status-approved)',
      border: 'rgba(16,185,129,0.25)',
      label: 'APPROVED',
    },
    REJECTED: {
      bg: 'rgba(239,68,68,0.1)',
      color: 'var(--status-rejected)',
      border: 'rgba(239,68,68,0.25)',
      label: 'REJECTED',
    },
    RESOLVED: {
      bg: 'rgba(79,143,247,0.1)',
      color: 'var(--accent)',
      border: 'rgba(79,143,247,0.25)',
      label: 'RESOLVED',
    },
  };

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: size === 'sm' ? '2px 7px' : '3px 9px',
        borderRadius: 99,
        fontSize: size === 'sm' ? 10 : 11,
        fontWeight: 700,
        letterSpacing: '0.06em',
        background: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: config.color,
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
      {config.label}
    </span>
  );
}
