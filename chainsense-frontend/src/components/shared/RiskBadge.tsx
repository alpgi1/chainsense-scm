import { getRiskLevel } from '../../types/risk.types';
import type { RiskLevel } from '../../types/risk.types';

interface RiskBadgeProps {
  score?: number;
  level?: RiskLevel;
  size?: 'sm' | 'md';
}

const LEVEL_CONFIG: Record<RiskLevel, { bg: string; color: string; border: string }> = {
  LOW: {
    bg: 'rgba(16,185,129,0.1)',
    color: 'var(--risk-low)',
    border: 'rgba(16,185,129,0.25)',
  },
  MEDIUM: {
    bg: 'rgba(245,158,11,0.1)',
    color: 'var(--risk-medium)',
    border: 'rgba(245,158,11,0.25)',
  },
  HIGH: {
    bg: 'rgba(249,115,22,0.1)',
    color: 'var(--risk-high)',
    border: 'rgba(249,115,22,0.25)',
  },
  CRITICAL: {
    bg: 'rgba(239,68,68,0.1)',
    color: 'var(--risk-critical)',
    border: 'rgba(239,68,68,0.25)',
  },
};

export function RiskBadge({ score, level, size = 'md' }: RiskBadgeProps) {
  const riskLevel: RiskLevel = level ?? (score !== undefined ? getRiskLevel(score) : 'LOW');
  const config = LEVEL_CONFIG[riskLevel];

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
      {riskLevel}
    </span>
  );
}
