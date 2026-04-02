import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, GitCompare, Loader2 } from 'lucide-react';
import { disruptionsApi } from '../../api/disruptions';
import { useRetrievalMode } from '../../hooks/useRetrievalMode';
import { useToast } from '../../context/ToastContext';
import type { CompareResponse, DisruptionResponse } from '../../types/risk.types';
import { getRiskLevel, getRiskColor } from '../../types/risk.types';
import { CHAOS_PRESETS, MOCK_DISRUPTIONS } from '../../data/mockData';

interface CompareViewProps {
  onBack: () => void;
}

interface ScenarioPanelProps {
  label: 'A' | 'B';
  prompt: string;
  onPromptChange: (v: string) => void;
  selectedPreset: number | null;
  onPresetSelect: (i: number) => void;
  result: DisruptionResponse | null;
}

function ScenarioPanel({
  label,
  prompt,
  onPromptChange,
  selectedPreset,
  onPresetSelect,
  result,
}: ScenarioPanelProps) {
  const labelColor = label === 'A' ? 'var(--accent)' : '#a78bfa';
  const labelBg = label === 'A' ? 'var(--accent-muted)' : 'rgba(167,139,250,0.12)';
  const labelBorder = label === 'A' ? 'var(--border-accent)' : 'rgba(167,139,250,0.3)';

  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      {/* Label chip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 10px',
            borderRadius: 99,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: '0.04em',
            color: labelColor,
            background: labelBg,
            border: `1px solid ${labelBorder}`,
          }}
        >
          Scenario {label}
        </span>
      </div>

      {/* Presets */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {CHAOS_PRESETS.map((p, i) => (
          <button
            key={i}
            className={selectedPreset === i ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '5px 10px', fontSize: 11 }}
            onClick={() => onPresetSelect(i)}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Textarea */}
      <textarea
        className="cs-textarea"
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        placeholder={`Describe scenario ${label} disruption event...`}
        style={{ minHeight: 100 }}
      />

      {/* Result card */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="card"
            style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            {/* Risk score */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: `${getRiskColor(getRiskLevel(result.overallRiskScore))}20`,
                  border: `1px solid ${getRiskColor(getRiskLevel(result.overallRiskScore))}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <span
                  className="mono"
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: getRiskColor(getRiskLevel(result.overallRiskScore)),
                  }}
                >
                  {result.overallRiskScore}
                </span>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>
                  Risk Score
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: getRiskColor(getRiskLevel(result.overallRiskScore)),
                    fontWeight: 600,
                  }}
                >
                  {getRiskLevel(result.overallRiskScore)}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {result.riskReport.summary.slice(0, 200)}
              {result.riskReport.summary.length > 200 ? '…' : ''}
            </div>

            {/* Meta chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <span
                style={{
                  fontSize: 11,
                  padding: '3px 8px',
                  borderRadius: 99,
                  background: 'var(--bg-overlay)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                }}
              >
                {result.riskReport.disruptionType.replace(/_/g, ' ')}
              </span>
              <span
                style={{
                  fontSize: 11,
                  padding: '3px 8px',
                  borderRadius: 99,
                  background: 'var(--bg-overlay)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                }}
              >
                {result.riskReport.estimatedDurationDays}d duration
              </span>
              <span
                style={{
                  fontSize: 11,
                  padding: '3px 8px',
                  borderRadius: 99,
                  background: 'var(--bg-overlay)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                }}
              >
                {result.riskReport.affectedProducts.length} products affected
              </span>
            </div>

            {/* Cost summary */}
            <div
              style={{
                padding: '10px 12px',
                borderRadius: 8,
                background: 'var(--bg-overlay)',
                border: '1px solid var(--border)',
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--text-tertiary)',
                  marginBottom: 8,
                }}
              >
                Cost Summary
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ textAlign: 'center' }}>
                  <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: 'var(--risk-high)' }}>
                    €{(result.actionPlan.costSummary.estimatedTotalImpact / 1000).toFixed(0)}K
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2 }}>
                    Total Impact
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                    {result.actionPlan.costSummary.productsAtRisk}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2 }}>
                    Products at Risk
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div className="mono" style={{ fontSize: 13, fontWeight: 700, color: 'var(--risk-medium)' }}>
                    €{(result.actionPlan.costSummary.totalAdditionalCostPerDay / 1000).toFixed(0)}K/d
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2 }}>
                    Cost/Day
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface DeltaCardProps {
  label: string;
  value: React.ReactNode;
  color: string;
}

function DeltaCard({ label, value, color }: DeltaCardProps) {
  return (
    <div
      className="card"
      style={{
        padding: '12px 14px',
        borderLeft: `3px solid ${color}`,
      }}
    >
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color }}>{value}</div>
    </div>
  );
}

function DeltaColumn({ a, b }: { a: DisruptionResponse; b: DisruptionResponse }) {
  const scoreA = a.overallRiskScore;
  const scoreB = b.overallRiskScore;
  const scoreDiff = Math.abs(scoreA - scoreB);
  const moreRiskyScore = scoreA > scoreB ? 'A' : scoreA < scoreB ? 'B' : null;

  const costA = a.actionPlan.costSummary.estimatedTotalImpact;
  const costB = b.actionPlan.costSummary.estimatedTotalImpact;
  const costDiff = Math.abs(costA - costB);
  const higherCost = costA > costB ? 'A' : costA < costB ? 'B' : null;

  const prodA = a.actionPlan.costSummary.productsAtRisk;
  const prodB = b.actionPlan.costSummary.productsAtRisk;
  const prodDiff = Math.abs(prodA - prodB);
  const moreProd = prodA > prodB ? 'A' : prodA < prodB ? 'B' : null;

  const durA = a.riskReport.estimatedDurationDays;
  const durB = b.riskReport.estimatedDurationDays;
  const durDiff = Math.abs(durA - durB);
  const longerDur = durA > durB ? 'A' : durA < durB ? 'B' : null;

  return (
    <div
      style={{
        width: 200,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--text-tertiary)',
          textAlign: 'center',
          padding: '6px 0',
          borderBottom: '1px solid var(--border)',
          marginBottom: 4,
        }}
      >
        Delta Analysis
      </div>

      <DeltaCard
        label="Risk Difference"
        color={moreRiskyScore ? 'var(--risk-critical)' : 'var(--text-tertiary)'}
        value={
          moreRiskyScore
            ? `${moreRiskyScore} is ${scoreDiff}pts higher`
            : 'Equal risk'
        }
      />

      <DeltaCard
        label="Cost Impact"
        color={higherCost ? 'var(--risk-high)' : 'var(--text-tertiary)'}
        value={
          higherCost
            ? `${higherCost} +€${(costDiff / 1000).toFixed(0)}K`
            : 'Equal cost'
        }
      />

      <DeltaCard
        label="Products at Risk"
        color={moreProd ? 'var(--risk-medium)' : 'var(--text-tertiary)'}
        value={
          moreProd
            ? `${moreProd} has +${prodDiff} more`
            : 'Same count'
        }
      />

      <DeltaCard
        label="Duration"
        color={longerDur ? 'var(--risk-high)' : 'var(--text-tertiary)'}
        value={
          longerDur
            ? `${longerDur} is +${durDiff}d longer`
            : 'Same duration'
        }
      />

      {/* Score summary */}
      <div
        style={{
          padding: '10px 12px',
          borderRadius: 8,
          background: moreRiskyScore === 'A'
            ? 'rgba(239,68,68,0.06)'
            : moreRiskyScore === 'B'
            ? 'rgba(239,68,68,0.06)'
            : 'var(--bg-elevated)',
          border: `1px solid ${moreRiskyScore ? 'rgba(239,68,68,0.2)' : 'var(--border)'}`,
          marginTop: 4,
        }}
      >
        <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginBottom: 8, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          Recommendation
        </div>
        {moreRiskyScore ? (
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Scenario{' '}
            <span style={{ color: 'var(--risk-low)', fontWeight: 700 }}>
              {moreRiskyScore === 'A' ? 'B' : 'A'}
            </span>{' '}
            poses lower risk. Prioritize its action plan.
          </div>
        ) : (
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Both scenarios have equal risk. Evaluate cost plans individually.
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 40,
        padding: '60px 20px',
      }}
    >
      {['Scenario A', 'Scenario B'].map((label) => (
        <div
          key={label}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <Loader2 size={28} color="var(--accent)" />
          </motion.div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>
            Analyzing {label}...
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
            Multi-agent pipeline active
          </div>
        </div>
      ))}
    </div>
  );
}

export function CompareView({ onBack }: CompareViewProps) {
  const { mode } = useRetrievalMode();
  const { addToast } = useToast();

  const [promptA, setPromptA] = useState('');
  const [promptB, setPromptB] = useState('');
  const [selectedPresetA, setSelectedPresetA] = useState<number | null>(null);
  const [selectedPresetB, setSelectedPresetB] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompareResponse | null>(null);

  const handlePresetA = (i: number) => {
    setSelectedPresetA(i);
    setPromptA(CHAOS_PRESETS[i].prompt);
  };

  const handlePresetB = (i: number) => {
    setSelectedPresetB(i);
    setPromptB(CHAOS_PRESETS[i].prompt);
  };

  const handleCompare = async () => {
    if (!promptA.trim() || !promptB.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await disruptionsApi.compare(promptA.trim(), promptB.trim(), mode);
      setResult(data);
      addToast('Comparison complete — results ready.', 'success');
    } catch {
      // Fallback to mock data
      const mockResult: CompareResponse = {
        scenarioA: MOCK_DISRUPTIONS[0],
        scenarioB: MOCK_DISRUPTIONS[1],
      };
      setResult(mockResult);
      addToast('API unavailable — showing mock comparison.', 'info');
    } finally {
      setLoading(false);
    }
  };

  const canCompare = promptA.trim().length > 0 && promptB.trim().length > 0 && !loading;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 28px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-surface)',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            className="btn-ghost"
            onClick={onBack}
            style={{ padding: '7px 10px' }}
          >
            <ArrowLeft size={15} />
            Back
          </button>
          <div
            style={{
              width: 1,
              height: 20,
              background: 'var(--border)',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <GitCompare size={18} color="var(--accent)" />
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
              Compare Mode
            </span>
          </div>
          <span
            style={{
              fontSize: 11,
              color: 'var(--text-tertiary)',
              padding: '3px 8px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 99,
            }}
          >
            Side-by-side disruption analysis
          </span>
        </div>

        <button
          className="btn-primary"
          onClick={handleCompare}
          disabled={!canCompare}
          style={{ gap: 6 }}
        >
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'flex' }}
              >
                <Loader2 size={14} />
              </motion.div>
              Analyzing...
            </>
          ) : (
            <>
              <GitCompare size={14} />
              Compare
            </>
          )}
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '24px 28px', overflowY: 'auto' }}>
        {/* Loading state */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="card"
              style={{ marginBottom: 20, padding: 0, overflow: 'hidden' }}
            >
              <LoadingState />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main layout: A | Delta | B */}
        <div
          style={{
            display: 'flex',
            gap: 20,
            alignItems: 'flex-start',
          }}
        >
          {/* Scenario A */}
          <ScenarioPanel
            label="A"
            prompt={promptA}
            onPromptChange={setPromptA}
            selectedPreset={selectedPresetA}
            onPresetSelect={handlePresetA}
            result={result?.scenarioA ?? null}
          />

          {/* Delta column — only when results exist */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <DeltaColumn a={result.scenarioA} b={result.scenarioB} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scenario B */}
          <ScenarioPanel
            label="B"
            prompt={promptB}
            onPromptChange={setPromptB}
            selectedPreset={selectedPresetB}
            onPresetSelect={handlePresetB}
            result={result?.scenarioB ?? null}
          />
        </div>
      </div>
    </div>
  );
}
