import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Brain, Database, Clock, AlertTriangle } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { RiskReportCard } from '../components/chaos/RiskReportCard';
import { ActionPlanCard } from '../components/chaos/ActionPlanCard';
import { StatusBadge } from '../components/shared/StatusBadge';
import { SkeletonCard } from '../components/shared/SkeletonCard';
import { disruptionsApi } from '../api/disruptions';
import type { DisruptionResponse } from '../types/risk.types';

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

export function DisruptionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [disruption, setDisruption] = useState<DisruptionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await disruptionsApi.getById(id);
        setDisruption(data);
      } catch {
        setError('Failed to load disruption details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleApprove = async (disruptionId: string) => {
    if (disruption && disruption.id === disruptionId) {
      setDisruption({ ...disruption, status: 'RESOLVED' });
    }
  };

  const handleReject = async (disruptionId: string) => {
    if (disruption && disruption.id === disruptionId) {
      setDisruption({ ...disruption, status: 'REJECTED' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header
        title="Disruption Detail"
        subtitle={disruption ? timeAgo(disruption.createdAt) : ''}
        actions={
          <button
            className="btn-secondary"
            onClick={() => navigate('/history')}
            style={{ padding: '7px 14px', fontSize: 13 }}
          >
            <ArrowLeft size={14} />
            Back to History
          </button>
        }
      />

      <div style={{ flex: 1, padding: '24px 28px', overflowY: 'auto' }}>
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <SkeletonCard height={80} lines={2} />
            <SkeletonCard height={320} lines={5} />
            <SkeletonCard height={400} lines={6} />
          </div>
        )}

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '16px 20px',
              borderRadius: 12,
              background: 'rgba(239,68,68,0.05)',
              border: '1px solid rgba(239,68,68,0.25)',
            }}
          >
            <AlertTriangle size={18} color="var(--risk-critical)" />
            <span style={{ fontSize: 14, color: 'var(--risk-critical)' }}>{error}</span>
            <button
              className="btn-secondary"
              onClick={() => navigate('/history')}
              style={{ marginLeft: 'auto', padding: '6px 12px', fontSize: 12 }}
            >
              Back
            </button>
          </div>
        )}

        {!loading && !error && disruption && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            {/* Meta bar */}
            <div
              className="card"
              style={{
                padding: '14px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                flexWrap: 'wrap',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    color: 'var(--text-primary)',
                    fontWeight: 500,
                    lineHeight: 1.5,
                  }}
                >
                  {disruption.chaosPrompt}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                {/* Mode badge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '4px 10px',
                    borderRadius: 99,
                    background:
                      disruption.retrievalMode === 'RAG'
                        ? 'var(--accent-muted)'
                        : 'var(--bg-elevated)',
                    border: `1px solid ${
                      disruption.retrievalMode === 'RAG'
                        ? 'var(--border-accent)'
                        : 'var(--border)'
                    }`,
                    fontSize: 11,
                    fontWeight: 700,
                    color:
                      disruption.retrievalMode === 'RAG'
                        ? 'var(--accent)'
                        : 'var(--text-tertiary)',
                  }}
                >
                  {disruption.retrievalMode === 'RAG' ? (
                    <Brain size={11} />
                  ) : (
                    <Database size={11} />
                  )}
                  {disruption.retrievalMode}
                </div>

                <StatusBadge status={disruption.status} />

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    fontSize: 12,
                    color: 'var(--text-tertiary)',
                  }}
                >
                  <Clock size={12} />
                  {timeAgo(disruption.createdAt)}
                </div>
              </div>
            </div>

            {/* Risk Report + Action Plan */}
            <RiskReportCard report={disruption.riskReport} />
            <ActionPlanCard
              plan={disruption.actionPlan}
              disruptionId={disruption.id}
              overallStatus={disruption.status}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
