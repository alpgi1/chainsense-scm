import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Brain, Database, ChevronRight, Zap } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { StatusBadge } from '../components/shared/StatusBadge';
import { SkeletonRow } from '../components/shared/SkeletonCard';
import { EmptyState } from '../components/shared/EmptyState';
import { disruptionsApi } from '../api/disruptions';
import type { DisruptionResponse } from '../types/risk.types';
import { MOCK_DISRUPTIONS } from '../data/mockData';

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

export function HistoryPage() {
  const navigate = useNavigate();
  const [disruptions, setDisruptions] = useState<DisruptionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await disruptionsApi.getAll();
        setDisruptions(data);
      } catch {
        setDisruptions(MOCK_DISRUPTIONS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = disruptions.filter((d) => {
    const matchesSearch =
      search === '' ||
      d.chaosPrompt.toLowerCase().includes(search.toLowerCase()) ||
      d.riskReport.disruptionType.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const STATUSES = ['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'RESOLVED'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header
        title="Analysis History"
        subtitle={`${disruptions.length} disruption analyses`}
        actions={
          <button className="btn-primary" onClick={() => navigate('/chaos')} style={{ padding: '8px 14px' }}>
            <Zap size={14} />
            New Analysis
          </button>
        }
      />

      <div style={{ flex: 1, padding: '24px 28px', overflowY: 'auto' }}>
        {/* Filters */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            marginBottom: 20,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
            <Search
              size={14}
              color="var(--text-tertiary)"
              style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              className="cs-input"
              placeholder="Search disruptions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 36 }}
            />
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            <Filter size={14} color="var(--text-tertiary)" style={{ alignSelf: 'center' }} />
            {STATUSES.map((s) => (
              <button
                key={s}
                className={statusFilter === s ? 'btn-primary' : 'btn-secondary'}
                onClick={() => setStatusFilter(s)}
                style={{ padding: '7px 12px', fontSize: 12 }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="card" style={{ overflow: 'hidden' }}>
          {/* Table header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '60px 1fr 130px 90px 90px 100px 40px',
              padding: '10px 20px',
              borderBottom: '1px solid var(--border)',
              gap: 12,
            }}
          >
            {['Score', 'Disruption Prompt', 'Type', 'Mode', 'Status', 'Time', ''].map((h) => (
              <span key={h} className="section-label">
                {h}
              </span>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: '0 20px' }}>
              {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No analyses found"
              description="Try adjusting your filters or run a new chaos analysis."
              action={
                <button className="btn-primary" onClick={() => navigate('/chaos')}>
                  <Zap size={14} />
                  New Analysis
                </button>
              }
            />
          ) : (
            filtered.map((d, i) => (
              <motion.div
                key={d.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => navigate(`/disruptions/${d.id}`)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '60px 1fr 130px 90px 90px 100px 40px',
                  padding: '14px 20px',
                  borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
                  cursor: 'pointer',
                  gap: 12,
                  alignItems: 'center',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-elevated)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                }}
              >
                {/* Score */}
                <div
                  className="mono"
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
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

                {/* Prompt */}
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      color: 'var(--text-primary)',
                      fontWeight: 500,
                      marginBottom: 2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {d.chaosPrompt.length > 80 ? d.chaosPrompt.slice(0, 80) + '…' : d.chaosPrompt}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                    {d.riskReport.affectedProducts.length} products affected ·{' '}
                    {d.riskReport.estimatedDurationDays}d estimated
                  </div>
                </div>

                {/* Type */}
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  {d.riskReport.disruptionType.replace(/_/g, ' ')}
                </div>

                {/* Mode */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 11,
                    fontWeight: 600,
                    color: d.retrievalMode === 'RAG' ? 'var(--accent)' : 'var(--text-tertiary)',
                  }}
                >
                  {d.retrievalMode === 'RAG' ? <Brain size={11} /> : <Database size={11} />}
                  {d.retrievalMode}
                </div>

                {/* Status */}
                <StatusBadge status={d.status} size="sm" />

                {/* Time */}
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                  {timeAgo(d.createdAt)}
                </div>

                {/* Arrow */}
                <ChevronRight size={14} color="var(--text-tertiary)" />
              </motion.div>
            ))
          )}
        </div>

        <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-tertiary)', textAlign: 'right' }}>
          Showing {filtered.length} of {disruptions.length} analyses
        </div>
      </div>
    </div>
  );
}
