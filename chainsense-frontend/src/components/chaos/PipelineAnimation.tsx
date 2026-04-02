import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, TrendingUp, CheckCircle2, Loader2 } from 'lucide-react';

type PipelineStatus = 'idle' | 'step1' | 'step2' | 'done';

interface PipelineStep {
  id: number;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  activeStatus: PipelineStatus;
  doneStatus: PipelineStatus[];
}

const STEPS: PipelineStep[] = [
  {
    id: 1,
    icon: <Shield size={18} />,
    title: 'Risk Analyst Agent',
    subtitle: 'Identifying affected products & routes',
    activeStatus: 'step1',
    doneStatus: ['step2', 'done'],
  },
  {
    id: 2,
    icon: <TrendingUp size={18} />,
    title: 'Strategist Agent',
    subtitle: 'Generating action plans & cost analysis',
    activeStatus: 'step2',
    doneStatus: ['done'],
  },
  {
    id: 3,
    icon: <CheckCircle2 size={18} />,
    title: 'Action Plan Ready',
    subtitle: 'Analysis complete — review results',
    activeStatus: 'done',
    doneStatus: [],
  },
];

interface PipelineAnimationProps {
  status: PipelineStatus;
}

export function PipelineAnimation({ status }: PipelineAnimationProps) {
  if (status === 'idle') return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="card"
        style={{ padding: 24, overflow: 'hidden' }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text-tertiary)',
            marginBottom: 20,
          }}
        >
          AI Pipeline
        </div>

        <div style={{ position: 'relative' }}>
          {/* Connector lines between steps */}
          <div
            style={{
              position: 'absolute',
              left: 20,
              top: 44,
              bottom: 44,
              width: 2,
              background: 'var(--border)',
              zIndex: 0,
            }}
          />

          {/* Active progress line */}
          <motion.div
            style={{
              position: 'absolute',
              left: 20,
              top: 44,
              width: 2,
              background: 'var(--accent)',
              zIndex: 1,
              originY: 0,
            }}
            initial={{ height: 0 }}
            animate={{
              height:
                status === 'step1'
                  ? '0%'
                  : status === 'step2'
                  ? '50%'
                  : '100%',
            }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {STEPS.map((step) => {
              const isActive = status === step.activeStatus;
              const isDone = step.doneStatus.includes(status);
              const isPending = !isActive && !isDone;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: isPending ? 0.4 : 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: '10px 0',
                    position: 'relative',
                    zIndex: 2,
                  }}
                >
                  {/* Icon circle */}
                  <motion.div
                    animate={{
                      background: isDone
                        ? 'rgba(16,185,129,0.12)'
                        : isActive
                        ? 'var(--accent-muted)'
                        : 'var(--bg-elevated)',
                      borderColor: isDone
                        ? 'rgba(16,185,129,0.4)'
                        : isActive
                        ? 'var(--border-accent)'
                        : 'var(--border)',
                    }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      border: '1px solid',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      background: 'var(--bg-elevated)',
                      color: isDone
                        ? 'var(--risk-low)'
                        : isActive
                        ? 'var(--accent)'
                        : 'var(--text-tertiary)',
                      transition: 'background 0.3s, border-color 0.3s, color 0.3s',
                    }}
                  >
                    {isActive ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      >
                        <Loader2 size={18} />
                      </motion.div>
                    ) : (
                      step.icon
                    )}
                  </motion.div>

                  {/* Text */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: isDone
                          ? 'var(--risk-low)'
                          : isActive
                          ? 'var(--text-primary)'
                          : 'var(--text-tertiary)',
                        marginBottom: 2,
                        transition: 'color 0.3s',
                      }}
                    >
                      {step.title}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                      {isActive ? (
                        <motion.span
                          animate={{ opacity: [1, 0.4, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          {step.subtitle}
                        </motion.span>
                      ) : (
                        step.subtitle
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div style={{ flexShrink: 0 }}>
                    {isDone && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '3px 8px',
                          borderRadius: 99,
                          background: 'rgba(16,185,129,0.1)',
                          border: '1px solid rgba(16,185,129,0.25)',
                          fontSize: 10,
                          fontWeight: 600,
                          color: 'var(--risk-low)',
                        }}
                      >
                        Done
                      </motion.span>
                    )}
                    {isActive && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          padding: '3px 8px',
                          borderRadius: 99,
                          background: 'var(--accent-muted)',
                          border: '1px solid var(--border-accent)',
                          fontSize: 10,
                          fontWeight: 600,
                          color: 'var(--accent)',
                        }}
                      >
                        Running
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
