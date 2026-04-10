import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, TrendingUp, CheckCircle2 } from 'lucide-react';

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
    icon: <Shield size={16} />,
    title: 'Risk Analyst Agent',
    subtitle: 'Identifying affected products & routes',
    activeStatus: 'step1',
    doneStatus: ['step2', 'done'],
  },
  {
    id: 2,
    icon: <TrendingUp size={16} />,
    title: 'Strategist Agent',
    subtitle: 'Generating action plans & cost analysis',
    activeStatus: 'step2',
    doneStatus: ['done'],
  },
  {
    id: 3,
    icon: <CheckCircle2 size={16} />,
    title: 'Action Plan Ready',
    subtitle: 'Analysis complete - review results',
    activeStatus: 'done',
    doneStatus: [],
  },
];

interface PipelineAnimationProps {
  status: PipelineStatus;
}

export function PipelineAnimation({ status }: PipelineAnimationProps) {
  if (status === 'idle') return null;

  const progressPercent =
    status === 'step1' ? 0 :
    status === 'step2' ? 50 :
    100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="card"
        style={{ padding: '20px 20px', overflow: 'hidden' }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text-tertiary)',
            marginBottom: 18,
          }}
        >
          AI Pipeline
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {STEPS.map((step, index) => {
            const isActive = status === step.activeStatus;
            const isDone = step.doneStatus.includes(status);
            const isPending = !isActive && !isDone;
            const isLast = index === STEPS.length - 1;

            return (
              <React.Fragment key={step.id}>
                {/* Step row */}
                <motion.div
                  animate={{ opacity: isPending ? 0.35 : 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '8px 10px',
                    borderRadius: 10,
                    background: isActive
                      ? 'var(--accent-muted)'
                      : isDone
                      ? 'rgba(16,185,129,0.06)'
                      : 'transparent',
                    border: `1px solid ${
                      isActive
                        ? 'var(--border-accent)'
                        : isDone
                        ? 'rgba(16,185,129,0.2)'
                        : 'transparent'
                    }`,
                    transition: 'background 0.3s, border-color 0.3s',
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 9,
                      flexShrink: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isDone
                        ? 'rgba(16,185,129,0.12)'
                        : isActive
                        ? 'var(--accent-muted)'
                        : 'var(--bg-elevated)',
                      border: `1px solid ${
                        isDone
                          ? 'rgba(16,185,129,0.3)'
                          : isActive
                          ? 'var(--border-accent)'
                          : 'var(--border)'
                      }`,
                      color: isDone
                        ? 'var(--risk-low)'
                        : isActive
                        ? 'var(--accent)'
                        : 'var(--text-tertiary)',
                      transition: 'all 0.3s',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {isActive && (
                      <motion.div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background:
                            'linear-gradient(90deg, transparent, rgba(79,143,247,0.15), transparent)',
                        }}
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      />
                    )}
                    {step.icon}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: isDone
                          ? 'var(--risk-low)'
                          : isActive
                          ? 'var(--text-primary)'
                          : 'var(--text-tertiary)',
                        marginBottom: 1,
                        transition: 'color 0.3s',
                      }}
                    >
                      {step.title}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.4 }}>
                      {isActive ? (
                        <motion.span
                          animate={{ opacity: [1, 0.4, 1] }}
                          transition={{ duration: 1.4, repeat: Infinity }}
                        >
                          {step.subtitle}
                        </motion.span>
                      ) : (
                        step.subtitle
                      )}
                    </div>
                  </div>

                  {/* Badge */}
                  <div style={{ flexShrink: 0 }}>
                    <AnimatePresence mode="wait">
                      {isDone && (
                        <motion.span
                          key="done"
                          initial={{ scale: 0.7, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.7, opacity: 0 }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            padding: '3px 9px',
                            borderRadius: 99,
                            background: 'rgba(16,185,129,0.1)',
                            border: '1px solid rgba(16,185,129,0.25)',
                            fontSize: 10,
                            fontWeight: 700,
                            color: 'var(--risk-low)',
                            letterSpacing: '0.04em',
                          }}
                        >
                          Done
                        </motion.span>
                      )}
                      {isActive && (
                        <motion.span
                          key="running"
                          initial={{ scale: 0.7, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.7, opacity: 0 }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            padding: '3px 9px',
                            borderRadius: 99,
                            background: 'var(--accent-muted)',
                            border: '1px solid var(--border-accent)',
                            fontSize: 10,
                            fontWeight: 700,
                            color: 'var(--accent)',
                            letterSpacing: '0.04em',
                          }}
                        >
                          <motion.span
                            style={{
                              width: 5,
                              height: 5,
                              borderRadius: '50%',
                              background: 'var(--accent)',
                              display: 'inline-block',
                            }}
                            animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                          Running
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>

                {/* Connector between steps */}
                {!isLast && (
                  <div style={{ display: 'flex', alignItems: 'center', paddingLeft: 26, height: 14 }}>
                    <div
                      style={{
                        width: 2,
                        height: '100%',
                        borderRadius: 99,
                        background: 'var(--border)',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <motion.div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          background: 'var(--accent)',
                          borderRadius: 99,
                        }}
                        initial={{ height: '0%' }}
                        animate={{
                          height:
                            (index === 0 && (status === 'step2' || status === 'done')) ||
                            (index === 1 && status === 'done')
                              ? '100%'
                              : '0%',
                        }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                      />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Bottom progress bar */}
        <div
          style={{
            marginTop: 16,
            height: 3,
            borderRadius: 99,
            background: 'var(--bg-overlay)',
            overflow: 'hidden',
          }}
        >
          <motion.div
            style={{
              height: '100%',
              borderRadius: 99,
              background: 'linear-gradient(90deg, var(--accent), var(--risk-low))',
            }}
            initial={{ width: '0%' }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
          />
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: 10,
            color: 'var(--text-tertiary)',
            textAlign: 'right',
            fontWeight: 600,
          }}
        >
          {progressPercent}%
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
