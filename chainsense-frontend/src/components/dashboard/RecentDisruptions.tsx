import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, ChevronRight } from 'lucide-react';
import type { DisruptionResponse } from '../../types/risk.types';
import { RiskBadge } from '../shared/RiskBadge';
import { StatusBadge } from '../shared/StatusBadge';
import { EmptyState } from '../shared/EmptyState';

interface RecentDisruptionsProps {
  disruptions: DisruptionResponse[];
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  return `${days}d ago`;
}

export function RecentDisruptions({ disruptions }: RecentDisruptionsProps) {
  const navigate = useNavigate();

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Zap size={15} color="var(--accent)" />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
            Recent Disruption Analyses
          </span>
        </div>
        <button
          className="btn-ghost"
          onClick={() => navigate('/history')}
          style={{ fontSize: 12, gap: 4 }}
        >
          View all <ChevronRight size={12} />
        </button>
      </div>

      {disruptions.length === 0 ? (
        <EmptyState
          title="No disruptions analyzed"
          description="Run a chaos analysis to see results here."
          action={
            <button className="btn-primary" onClick={() => navigate('/chaos')} style={{ fontSize: 13 }}>
              Start Analysis
            </button>
          }
        />
      ) : (
        <div>
          {disruptions.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate('/chaos')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 20px',
                borderBottom: i < disruptions.length - 1 ? '1px solid var(--border)' : 'none',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-elevated)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background = 'transparent';
              }}
            >
              {/* Risk score circle */}
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 9,
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 13,
                  fontWeight: 600,
                  color:
                    d.overallRiskScore >= 80
                      ? 'var(--risk-critical)'
                      : d.overallRiskScore >= 60
                      ? 'var(--risk-high)'
                      : d.overallRiskScore >= 40
                      ? 'var(--risk-medium)'
                      : 'var(--risk-low)',
                }}
              >
                {d.overallRiskScore}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    marginBottom: 3,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {d.chaosPrompt.length > 70
                    ? d.chaosPrompt.slice(0, 70) + '…'
                    : d.chaosPrompt}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                    {timeAgo(d.createdAt)}
                  </span>
                  <span style={{ color: 'var(--border-hover)', fontSize: 10 }}>•</span>
                  <span
                    style={{
                      fontSize: 11,
                      color: 'var(--text-tertiary)',
                      fontFamily: 'JetBrains Mono, monospace',
                    }}
                  >
                    {d.retrievalMode}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <RiskBadge score={d.overallRiskScore} size="sm" />
                <StatusBadge status={d.status} size="sm" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
