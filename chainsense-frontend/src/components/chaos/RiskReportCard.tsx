import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, Clock, Package, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import type { RiskReport } from '../../types/risk.types';
import { RiskGauge } from '../shared/RiskGauge';
import { RiskBadge } from '../shared/RiskBadge';

interface RiskReportCardProps {
  report: RiskReport;
}

export function RiskReportCard({ report }: RiskReportCardProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
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
              background: 'rgba(239,68,68,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Shield size={15} color="var(--risk-critical)" />
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
            Risk Assessment
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <RiskBadge score={report.overallRiskScore} />
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
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: 20 }}>
              {/* Top row: gauge + meta */}
              <div style={{ display: 'flex', gap: 24, marginBottom: 20 }}>
                <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <RiskGauge score={report.overallRiskScore} size={130} />
                </div>

                <div style={{ flex: 1 }}>
                  {/* Summary */}
                  <p
                    style={{
                      fontSize: 13,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.65,
                      marginBottom: 16,
                    }}
                  >
                    {report.summary}
                  </p>

                  {/* Meta chips */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '5px 10px',
                        borderRadius: 7,
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                        fontSize: 12,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      <AlertTriangle size={12} color="var(--risk-medium)" />
                      {report.disruptionType.replace(/_/g, ' ')}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '5px 10px',
                        borderRadius: 7,
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                        fontSize: 12,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      <Clock size={12} color="var(--accent)" />
                      ~{report.estimatedDurationDays} days
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 5,
                        padding: '5px 10px',
                        borderRadius: 7,
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                        fontSize: 12,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      <Package size={12} color="var(--risk-high)" />
                      {report.affectedProducts.length} products at risk
                    </div>
                  </div>
                </div>
              </div>

              {/* Affected Products */}
              {report.affectedProducts.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div className="section-label" style={{ marginBottom: 10 }}>
                    Affected Products
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {report.affectedProducts.map((p) => (
                      <div
                        key={p.productId}
                        className="card-overlay"
                        style={{ padding: '12px 14px' }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            marginBottom: 6,
                          }}
                        >
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                              {p.productName}
                            </div>
                            <div
                              style={{
                                fontSize: 11,
                                color: 'var(--text-tertiary)',
                                fontFamily: 'JetBrains Mono, monospace',
                              }}
                            >
                              {p.sku}
                            </div>
                          </div>
                          <RiskBadge score={p.productRiskScore} size="sm" />
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            gap: 16,
                            marginBottom: 6,
                            flexWrap: 'wrap',
                          }}
                        >
                          {[
                            { label: 'Stock', value: p.currentStock.toLocaleString() + ' u' },
                            { label: 'Daily use', value: p.dailyConsumption + '/d' },
                            {
                              label: 'Days left',
                              value: p.daysOfStockRemaining + 'd',
                              danger: p.daysOfStockRemaining <= 7,
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
                                  color: danger ? 'var(--risk-critical)' : 'var(--text-primary)',
                                }}
                              >
                                {value}
                              </div>
                            </div>
                          ))}
                        </div>

                        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
                          {p.impactReason}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Affected Routes */}
              {report.affectedRoutes.length > 0 && (
                <div>
                  <div className="section-label" style={{ marginBottom: 10 }}>
                    Affected Routes
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {report.affectedRoutes.map((route, i) => (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          padding: '8px 12px',
                          borderRadius: 7,
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border)',
                          fontSize: 12,
                          color: 'var(--text-secondary)',
                          fontFamily: 'JetBrains Mono, monospace',
                        }}
                      >
                        <MapPin size={12} color="var(--risk-high)" style={{ flexShrink: 0 }} />
                        {route}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
