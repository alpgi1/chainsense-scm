import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '../components/layout/Header';
import { ChaosInput } from '../components/chaos/ChaosInput';
import { PipelineAnimation } from '../components/chaos/PipelineAnimation';
import { RiskReportCard } from '../components/chaos/RiskReportCard';
import { ActionPlanCard } from '../components/chaos/ActionPlanCard';
import { useDisruption } from '../hooks/useDisruption';
import type { RetrievalMode } from '../types/risk.types';
import { Zap, Database, Brain, Info } from 'lucide-react';

export function ChaosAnalysisPage() {
  const { result, loading, pipelineStatus, analyze, approve, reject, reset } = useDisruption();

  const handleSubmit = (prompt: string, mode: RetrievalMode) => {
    analyze({ chaosPrompt: prompt, retrievalMode: mode });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header
        title="Chaos Analysis"
        subtitle="Multi-agent AI pipeline for supply chain disruption response"
      />

      <div style={{ flex: 1, padding: '24px 28px', overflowY: 'auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '380px 1fr',
            gap: 20,
            alignItems: 'start',
          }}
        >
          {/* Left column: input + pipeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <ChaosInput
              onSubmit={handleSubmit}
              loading={loading}
              onReset={reset}
              hasResult={!!result}
            />

            <PipelineAnimation status={pipelineStatus} />

            {/* Info card */}
            {pipelineStatus === 'idle' && !result && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card"
                style={{ padding: 16 }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  <Info size={14} color="var(--accent)" />
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>
                    How it works
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    {
                      icon: <Zap size={13} color="var(--accent)" />,
                      title: 'Input Chaos Prompt',
                      desc: 'Describe any real-world disruption event',
                    },
                    {
                      icon: <Database size={13} color="var(--risk-medium)" />,
                      title: 'Risk Analyst Agent',
                      desc: 'Identifies affected products, routes & stockout risk',
                    },
                    {
                      icon: <Brain size={13} color="var(--risk-low)" />,
                      title: 'Strategist Agent',
                      desc: 'Generates prioritized action plan with cost analysis',
                    },
                  ].map(({ icon, title, desc }) => (
                    <div key={title} style={{ display: 'flex', gap: 10 }}>
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 6,
                          background: 'var(--bg-elevated)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        {icon}
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                          {title}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.4 }}>
                          {desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right column: results */}
          <div>
            <AnimatePresence mode="wait">
              {!result && !loading && pipelineStatus === 'idle' && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '80px 40px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 18,
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 20,
                    }}
                  >
                    <Zap size={28} color="var(--text-tertiary)" />
                  </div>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      marginBottom: 8,
                    }}
                  >
                    No analysis yet
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-tertiary)', maxWidth: 300 }}>
                    Select a preset scenario or type your own disruption event, then click Run Analysis
                    to engage the AI agents.
                  </div>
                </motion.div>
              )}

              {result && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
                >
                  {/* Meta bar */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 16px',
                      borderRadius: 8,
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                      Analysis ID:
                    </span>
                    <span
                      className="mono"
                      style={{ fontSize: 12, color: 'var(--text-secondary)' }}
                    >
                      {result.id}
                    </span>
                    <span
                      style={{
                        marginLeft: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '3px 8px',
                        borderRadius: 99,
                        background:
                          result.retrievalMode === 'RAG'
                            ? 'var(--accent-muted)'
                            : 'var(--bg-elevated)',
                        border: `1px solid ${result.retrievalMode === 'RAG' ? 'var(--border-accent)' : 'var(--border)'}`,
                        fontSize: 11,
                        fontWeight: 600,
                        color:
                          result.retrievalMode === 'RAG' ? 'var(--accent)' : 'var(--text-tertiary)',
                      }}
                    >
                      {result.retrievalMode === 'RAG' ? <Brain size={10} /> : <Database size={10} />}
                      {result.retrievalMode}
                    </span>
                  </div>

                  <RiskReportCard report={result.riskReport} />
                  <ActionPlanCard
                    plan={result.actionPlan}
                    disruptionId={result.id}
                    overallStatus={result.status}
                    onApprove={approve}
                    onReject={reject}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
