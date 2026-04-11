import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  DollarSign,
  Clock,
  Package,
  Zap,
  RefreshCw,
} from 'lucide-react';
import type { ActionPlan, ActionItem } from '../../types/risk.types';
import { StatusBadge } from '../shared/StatusBadge';
import { useToast } from '../../context/ToastContext';
import { ExecutionModal } from './ExecutionModal';

interface ActionPlanCardProps {
  plan: ActionPlan;
  disruptionId: string;
  overallStatus: string;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
}

const ACTION_ICONS: Record<string, React.ReactNode> = {
  SWITCH_SUPPLIER: <RefreshCw size={14} />,
  REROUTE: <ArrowRight size={14} />,
  INCREASE_STOCK: <Package size={14} />,
  HOLD: <Clock size={14} />,
};

const PRIORITY_COLORS: Record<string, string> = {
  URGENT: 'var(--risk-critical)',
  HIGH: 'var(--risk-high)',
  MEDIUM: 'var(--risk-medium)',
  LOW: 'var(--risk-low)',
};

function formatCurrency(value: number): string {
  if (value === 0) return '€0';
  if (Math.abs(value) >= 1_000_000) return `€${(value / 1_000_000).toFixed(2)}M`;
  if (Math.abs(value) >= 1_000) return `€${(value / 1_000).toFixed(1)}K`;
  return `€${value.toFixed(0)}`;
}

function ActionItemRow({ action }: { action: ActionItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      {/* Row header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 14px',
          cursor: 'pointer',
        }}
        onClick={() => setOpen(!open)}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: 'var(--bg-overlay)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            color: 'var(--text-secondary)',
          }}
        >
          {ACTION_ICONS[action.actionType] ?? <Zap size={14} />}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: 2,
            }}
          >
            {action.productName}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
            {action.actionType.replace(/_/g, ' ')}
            {action.supplierName && ` → ${action.supplierName}`}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: PRIORITY_COLORS[action.priority],
              letterSpacing: '0.05em',
            }}
          >
            {action.priority}
          </span>
          {action.status && <StatusBadge status={action.status as 'PROPOSED' | 'APPROVED' | 'REJECTED'} size="sm" />}
          {open ? (
            <ChevronUp size={14} color="var(--text-tertiary)" />
          ) : (
            <ChevronDown size={14} color="var(--text-tertiary)" />
          )}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{
                padding: '0 14px 14px',
                borderTop: '1px solid var(--border)',
                paddingTop: 12,
              }}
            >
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>
                {action.rationale}
              </p>

              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {[
                  {
                    label: 'Cost change',
                    value: `${action.costDifferencePercent > 0 ? '+' : ''}${action.costDifferencePercent.toFixed(1)}%`,
                    danger: action.costDifferencePercent > 20,
                  },
                  {
                    label: 'Current cost',
                    value: `€${action.currentUnitCost.toFixed(2)}/u`,
                    danger: false,
                  },
                  {
                    label: 'New cost',
                    value: `€${action.newUnitCost.toFixed(2)}/u`,
                    danger: false,
                  },
                  {
                    label: 'Current transit',
                    value: `${action.currentTransitDays}d`,
                    danger: false,
                  },
                  {
                    label: 'New transit',
                    value: `${action.newTransitDays}d`,
                    danger: false,
                  },
                ].map(({ label, value, danger }) => (
                  <div key={label}>
                    <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginBottom: 1 }}>
                      {label}
                    </div>
                    <div
                      className="mono"
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: danger ? 'var(--risk-high)' : 'var(--text-primary)',
                      }}
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ActionPlanCard({
  plan,
  disruptionId,
  overallStatus,
  onApprove,
  onReject,
}: ActionPlanCardProps) {
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [expanded, setExpanded] = useState(true);
  const [showExecution, setShowExecution] = useState(false);
  const { addToast } = useToast();

  const isPending = overallStatus === 'PENDING';
  const isApproved = overallStatus === 'APPROVED';
  const isRejected = overallStatus === 'REJECTED';

  const handleApprove = async () => {
    setApproving(true);
    await onApprove(disruptionId);
    setShowExecution(true);
  };

  const handleReject = async () => {
    setRejecting(true);
    try {
      await onReject(disruptionId);
      addToast('Action plan rejected', 'error');
    } catch {
      addToast('Failed to reject plan', 'error');
    } finally {
      setRejecting(false);
    }
  };

  return (
    <>
    {showExecution && (
      <ExecutionModal
        plan={plan}
        disruptionId={disruptionId}
        onComplete={() => {
          setApproving(false);
          addToast('Plan executed — supply chain updated', 'success');
        }}
        onClose={() => setShowExecution(false)}
      />
    )}
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
      style={{ overflow: 'hidden' }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid var(--border)',
          cursor: 'pointer',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: 'var(--accent-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TrendingUp size={15} color="var(--accent)" />
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
            Action Plan
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              padding: '3px 8px',
              borderRadius: 99,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--text-secondary)',
            }}
          >
            {plan.actions.length} actions
          </span>
          {expanded ? (
            <ChevronUp size={16} color="var(--text-tertiary)" />
          ) : (
            <ChevronDown size={16} color="var(--text-tertiary)" />
          )}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: 20 }}>
              {/* Executive summary */}
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: 8,
                  background: 'var(--accent-muted)',
                  border: '1px solid var(--border-accent)',
                  marginBottom: 20,
                }}
              >
                <div className="section-label" style={{ marginBottom: 6 }}>
                  Executive Summary
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                  {plan.executiveSummary}
                </p>
              </div>

              {/* Cost summary */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                {[
                  {
                    icon: <DollarSign size={14} color="var(--risk-high)" />,
                    label: 'Additional cost/day',
                    value: formatCurrency(plan.costSummary.totalAdditionalCostPerDay),
                    danger: true,
                  },
                  {
                    icon: <TrendingUp size={14} color="var(--risk-critical)" />,
                    label: 'Total impact est.',
                    value: formatCurrency(plan.costSummary.estimatedTotalImpact),
                    danger: true,
                  },
                  {
                    icon: <Package size={14} color="var(--risk-medium)" />,
                    label: 'Products at risk',
                    value: plan.costSummary.productsAtRisk.toString(),
                    danger: false,
                  },
                  {
                    icon: <CheckCircle size={14} color="var(--risk-low)" />,
                    label: 'With alternatives',
                    value: plan.costSummary.productsWithAlternatives.toString(),
                    danger: false,
                  },
                ].map(({ icon, label, value, danger }) => (
                  <div
                    key={label}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 8,
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        marginBottom: 4,
                      }}
                    >
                      {icon}
                      <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{label}</span>
                    </div>
                    <div
                      className="mono"
                      style={{
                        fontSize: 18,
                        fontWeight: 600,
                        color: danger ? 'var(--risk-high)' : 'var(--text-primary)',
                      }}
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action items */}
              <div style={{ marginBottom: 20 }}>
                <div className="section-label" style={{ marginBottom: 10 }}>
                  Recommended Actions
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {plan.actions.map((action) => (
                    <ActionItemRow key={action.id ?? action.affectedProductId} action={action} />
                  ))}
                </div>
              </div>

              {/* Approve / Reject */}
              {isPending && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    display: 'flex',
                    gap: 10,
                    paddingTop: 16,
                    borderTop: '1px solid var(--border)',
                  }}
                >
                  <button
                    className="btn-primary"
                    onClick={handleApprove}
                    disabled={approving || rejecting}
                    style={{ flex: 1, justifyContent: 'center', padding: '10px 16px' }}
                  >
                    <CheckCircle size={15} />
                    {approving ? 'Approving…' : 'Approve Plan'}
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={handleReject}
                    disabled={approving || rejecting}
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      padding: '10px 16px',
                      borderColor: 'rgba(239,68,68,0.3)',
                      color: 'var(--risk-critical)',
                    }}
                  >
                    <XCircle size={15} />
                    {rejecting ? 'Rejecting…' : 'Reject Plan'}
                  </button>
                </motion.div>
              )}

              {(isApproved || isRejected) && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '12px 14px',
                    borderRadius: 8,
                    background: isApproved ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                    border: `1px solid ${isApproved ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
                    marginTop: 16,
                  }}
                >
                  {isApproved ? (
                    <CheckCircle size={16} color="var(--risk-low)" />
                  ) : (
                    <XCircle size={16} color="var(--risk-critical)" />
                  )}
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: isApproved ? 'var(--risk-low)' : 'var(--risk-critical)',
                    }}
                  >
                    {isApproved ? 'Plan approved and queued for execution' : 'Plan rejected'}
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
    </>
  );
}
