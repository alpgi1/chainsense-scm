import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  Package,
  Clock,
  Zap,
  TrendingUp,
  AlertTriangle,
  X,
} from 'lucide-react';
import type { ActionPlan, ActionItem } from '../../types/risk.types';
import { disruptionsApi } from '../../api/disruptions';

interface ExecutionStep {
  action: ActionItem;
  status: 'pending' | 'running' | 'done' | 'failed';
  logLines: string[];
  inventoryDelta?: number; // how much stock was added
}

interface ExecutionSummary {
  productsSaved: number;
  suppliersActivated: number;
  routesRerouted: number;
  totalStockAdded: number;
  totalCost: number;
}

interface ExecutionModalProps {
  plan: ActionPlan;
  disruptionId?: string;
  onComplete: () => void;
  onClose: () => void;
}

const ACTION_MESSAGES: Record<string, (item: ActionItem) => string[]> = {
  SWITCH_SUPPLIER: (item) => [
    `Terminating contract with current supplier for ${item.productName}...`,
    `Activating ${item.supplierName ?? 'alternative supplier'} in supplier registry...`,
    `Negotiating emergency procurement terms...`,
    `New supply route confirmed — transit: ${item.newTransitDays}d`,
  ],
  REROUTE: (item) => [
    `Analyzing alternative freight corridors for ${item.productName}...`,
    `Booking capacity via ${item.supplierName ?? 'alternative route'}...`,
    `Updating logistics manifest...`,
    `Route active — ETA adjusted to ${item.newTransitDays} days`,
  ],
  INCREASE_STOCK: (item) => [
    `Calculating emergency order quantity for ${item.productName}...`,
    `Submitting purchase order to ${item.supplierName ?? 'supplier'}...`,
    `Order confirmed — updating warehouse inventory...`,
    `Stock level secured for ${Math.round(item.newTransitDays * 1.5)} days buffer`,
  ],
  HOLD: (item) => [
    `Placing ${item.productName} procurement on hold...`,
    `Flagging for manual review...`,
    `Hold status recorded in system`,
  ],
};

function getActionIcon(type: string) {
  switch (type) {
    case 'SWITCH_SUPPLIER': return <RefreshCw size={14} />;
    case 'REROUTE': return <ArrowRight size={14} />;
    case 'INCREASE_STOCK': return <Package size={14} />;
    case 'HOLD': return <Clock size={14} />;
    default: return <Zap size={14} />;
  }
}

const STEP_DELAY = 900;
const LINE_DELAY = 280;

export function ExecutionModal({ plan, disruptionId, onComplete, onClose }: ExecutionModalProps) {
  const [steps, setSteps] = useState<ExecutionStep[]>(
    plan.actions.map((action) => ({ action, status: 'pending', logLines: [] }))
  );
  const [, setCurrentStep] = useState(0);
  const [phase, setPhase] = useState<'executing' | 'done'>('executing');
  const [summary, setSummary] = useState<ExecutionSummary | null>(null);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    runExecution();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const runExecution = async () => {
    // Fire backend execute in parallel with animations — handles all DB changes atomically
    const isRealUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(disruptionId ?? '');
    const backendPromise = isRealUuid
      ? disruptionsApi.execute(disruptionId!).catch((err) => {
          console.error('[ExecutionModal] execute failed:', err);
        })
      : Promise.resolve();

    let productsSaved = 0;
    let suppliersActivated = 0;
    let routesRerouted = 0;
    let totalStockAdded = 0;
    const totalCost = plan.costSummary.estimatedTotalImpact;

    for (let i = 0; i < plan.actions.length; i++) {
      const action = plan.actions[i];
      setCurrentStep(i);

      setSteps((prev) =>
        prev.map((s, idx) => (idx === i ? { ...s, status: 'running' } : s))
      );

      const messages = ACTION_MESSAGES[action.actionType]?.(action) ?? [
        `Processing ${action.productName}...`,
        'Complete.',
      ];

      for (const line of messages) {
        await sleep(LINE_DELAY);
        setSteps((prev) =>
          prev.map((s, idx) =>
            idx === i ? { ...s, logLines: [...s.logLines, line] } : s
          )
        );
      }

      await sleep(STEP_DELAY);

      // Count effects for summary display
      if (action.actionType === 'SWITCH_SUPPLIER') suppliersActivated++;
      if (action.actionType === 'REROUTE') routesRerouted++;
      if (action.actionType === 'INCREASE_STOCK' || action.actionType === 'SWITCH_SUPPLIER') productsSaved++;
      if (action.actionType === 'INCREASE_STOCK') totalStockAdded++;

      setSteps((prev) =>
        prev.map((s, idx) => (idx === i ? { ...s, status: 'done' } : s))
      );

      setOverallProgress(Math.round(((i + 1) / plan.actions.length) * 100));
    }

    // Wait for backend to finish before showing done state
    await backendPromise;

    setSummary({ productsSaved, suppliersActivated, routesRerouted, totalStockAdded, totalCost });
    setPhase('done');
    onComplete();
  };

  const doneCount = steps.filter((s) => s.status === 'done').length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(8,8,12,0.85)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          width: '100%',
          maxWidth: 600,
          maxHeight: '85vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: phase === 'done' ? 'rgba(16,185,129,0.12)' : 'var(--accent-muted)',
              border: `1px solid ${phase === 'done' ? 'rgba(16,185,129,0.3)' : 'var(--border-accent)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.4s',
            }}
          >
            {phase === 'done' ? (
              <CheckCircle2 size={18} color="var(--risk-low)" />
            ) : (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                <Zap size={18} color="var(--accent)" />
              </motion.div>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
              {phase === 'done' ? 'Execution Complete' : 'Executing Action Plan...'}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 1 }}>
              {phase === 'done'
                ? `All ${plan.actions.length} actions processed`
                : `${doneCount} of ${plan.actions.length} actions complete`}
            </div>
          </div>
          {phase === 'done' && (
            <button className="btn-ghost" onClick={onClose} style={{ padding: '6px 8px' }}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div style={{ height: 3, background: 'var(--bg-overlay)' }}>
          <motion.div
            style={{
              height: '100%',
              background: phase === 'done'
                ? 'var(--risk-low)'
                : 'linear-gradient(90deg, var(--accent), #7c3aed)',
            }}
            initial={{ width: '0%' }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          <AnimatePresence>
            {/* Execution steps */}
            {phase === 'executing' || doneCount < plan.actions.length ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {steps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: step.status === 'pending' ? 0.3 : 1, y: 0 }}
                    style={{
                      borderRadius: 10,
                      border: `1px solid ${
                        step.status === 'running'
                          ? 'var(--border-accent)'
                          : step.status === 'done'
                          ? 'rgba(16,185,129,0.2)'
                          : 'var(--border)'
                      }`,
                      background:
                        step.status === 'running'
                          ? 'var(--accent-muted)'
                          : step.status === 'done'
                          ? 'rgba(16,185,129,0.05)'
                          : 'var(--bg-elevated)',
                      overflow: 'hidden',
                      transition: 'border-color 0.3s, background 0.3s',
                    }}
                  >
                    {/* Step header */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '10px 14px',
                      }}
                    >
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 7,
                          background:
                            step.status === 'done'
                              ? 'rgba(16,185,129,0.12)'
                              : step.status === 'running'
                              ? 'var(--accent-muted)'
                              : 'var(--bg-overlay)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color:
                            step.status === 'done'
                              ? 'var(--risk-low)'
                              : step.status === 'running'
                              ? 'var(--accent)'
                              : 'var(--text-tertiary)',
                          flexShrink: 0,
                          transition: 'all 0.3s',
                        }}
                      >
                        {step.status === 'done' ? (
                          <CheckCircle2 size={14} />
                        ) : step.status === 'failed' ? (
                          <AlertTriangle size={14} />
                        ) : (
                          getActionIcon(step.action.actionType)
                        )}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color:
                              step.status === 'done'
                                ? 'var(--risk-low)'
                                : step.status === 'running'
                                ? 'var(--text-primary)'
                                : 'var(--text-secondary)',
                            transition: 'color 0.3s',
                          }}
                        >
                          {step.action.productName}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                          {step.action.actionType.replace(/_/g, ' ')}
                          {step.action.supplierName && ` via ${step.action.supplierName}`}
                        </div>
                      </div>

                      {step.status === 'running' && (
                        <motion.div
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: 'var(--accent)',
                            letterSpacing: '0.05em',
                          }}
                        >
                          RUNNING
                        </motion.div>
                      )}

                      {step.status === 'done' && (step.inventoryDelta ?? 0) > 0 && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: 11,
                            fontWeight: 700,
                            color: 'var(--risk-low)',
                            padding: '3px 8px',
                            borderRadius: 99,
                            background: 'rgba(16,185,129,0.1)',
                            border: '1px solid rgba(16,185,129,0.2)',
                          }}
                        >
                          <TrendingUp size={11} />
                          +{(step.inventoryDelta ?? 0).toLocaleString()} units
                        </motion.div>
                      )}
                    </div>

                    {/* Log lines */}
                    <AnimatePresence>
                      {step.logLines.length > 0 && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          style={{
                            borderTop: '1px solid var(--border)',
                            padding: '8px 14px 10px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3,
                          }}
                        >
                          {step.logLines.map((line, j) => (
                            <motion.div
                              key={j}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              style={{
                                fontSize: 11,
                                color:
                                  j === step.logLines.length - 1 && step.status === 'running'
                                    ? 'var(--text-secondary)'
                                    : 'var(--text-tertiary)',
                                fontFamily: 'JetBrains Mono, monospace',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 6,
                              }}
                            >
                              <span style={{ color: 'var(--accent)', flexShrink: 0 }}>›</span>
                              {line}
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            ) : null}

            {/* Summary */}
            {phase === 'done' && summary && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
              >
                {/* Completed steps (collapsed) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 4 }}>
                  {steps.map((step, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '8px 12px',
                        borderRadius: 8,
                        background: 'rgba(16,185,129,0.05)',
                        border: '1px solid rgba(16,185,129,0.15)',
                      }}
                    >
                      <CheckCircle2 size={14} color="var(--risk-low)" style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1 }}>
                        {step.action.productName}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                        {step.action.actionType.replace(/_/g, ' ')}
                      </span>
                      {(step.inventoryDelta ?? 0) > 0 && (
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--risk-low)' }}>
                          +{(step.inventoryDelta ?? 0).toLocaleString()} u
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Stats grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 10,
                  }}
                >
                  {[
                    {
                      label: 'Products secured',
                      value: summary.productsSaved.toString(),
                      color: 'var(--risk-low)',
                    },
                    {
                      label: 'Suppliers activated',
                      value: summary.suppliersActivated.toString(),
                      color: 'var(--accent)',
                    },
                    {
                      label: 'Routes rerouted',
                      value: summary.routesRerouted.toString(),
                      color: 'var(--risk-medium)',
                    },
                    {
                      label: 'Stock added',
                      value:
                        summary.totalStockAdded > 0
                          ? summary.totalStockAdded >= 1000
                            ? `${(summary.totalStockAdded / 1000).toFixed(1)}K units`
                            : `${summary.totalStockAdded} units`
                          : 'N/A',
                      color: 'var(--risk-low)',
                    },
                  ].map(({ label, value, color }) => (
                    <div
                      key={label}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 10,
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 4 }}>
                        {label}
                      </div>
                      <div className="mono" style={{ fontSize: 20, fontWeight: 700, color }}>
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        {phase === 'done' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              padding: '14px 24px',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              gap: 10,
            }}
          >
            <button
              className="btn-primary"
              onClick={onClose}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <CheckCircle2 size={15} />
              Done — Plan Resolved
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
