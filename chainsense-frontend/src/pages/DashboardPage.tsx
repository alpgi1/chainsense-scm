import { motion } from 'framer-motion';
import {
  Package,
  AlertTriangle,
  Zap,
  Clock,
  TrendingDown,
  Activity,
  DollarSign,
  Truck,
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { AlertBanner } from '../components/dashboard/AlertBanner';
import { KpiCard } from '../components/dashboard/KpiCard';
import { InventoryCard } from '../components/dashboard/InventoryCard';
import { RecentDisruptions } from '../components/dashboard/RecentDisruptions';
import { SkeletonCard } from '../components/shared/SkeletonCard';
import { useDashboard } from '../hooks/useDashboard';

export function DashboardPage() {
  const { stats, criticalProducts, recentDisruptions, loading, refresh } = useDashboard();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header
        title="Supply Chain Dashboard"
        subtitle="Real-time risk intelligence for EV battery manufacturing"
        onRefresh={refresh}
      />

      <AlertBanner criticalCount={stats.criticalStockItems} />

      <div style={{ flex: 1, padding: '24px 28px', overflowY: 'auto' }}>
        {/* KPI Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 14,
            marginBottom: 24,
          }}
        >
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} height={100} lines={2} />)
          ) : (
            <>
              <KpiCard
                label="Total Products"
                value={stats.totalProducts}
                icon={<Package size={14} color="var(--accent)" />}
                accent
                trend="neutral"
              />
              <KpiCard
                label="Critical Stock Alerts"
                value={stats.criticalStockItems}
                icon={<AlertTriangle size={14} color="var(--risk-critical)" />}
                danger
                trend="up"
                trendLabel="vs last week"
              />
              <KpiCard
                label="Active Disruptions"
                value={stats.activeDisruptions}
                icon={<Zap size={14} color="var(--risk-high)" />}
                trend="neutral"
              />
              <KpiCard
                label="Pending Actions"
                value={stats.pendingActions}
                icon={<Clock size={14} color="var(--risk-medium)" />}
                trend="neutral"
              />
              <KpiCard
                label="Avg Risk Score"
                value={stats.avgRiskScore}
                unit="/ 100"
                icon={<Activity size={14} color="var(--risk-high)" />}
                trend="down"
                trendLabel="↓ 4pts this week"
                danger={stats.avgRiskScore > 60}
              />
              <KpiCard
                label="Suppliers at Risk"
                value={stats.suppliersAtRisk}
                icon={<Truck size={14} color="var(--risk-high)" />}
                trend="neutral"
              />
              <KpiCard
                label="Inventory Value"
                value={stats.totalInventoryValue / 1000000}
                prefix="€"
                unit="M"
                decimals={2}
                icon={<DollarSign size={14} color="var(--risk-low)" />}
                trend="neutral"
              />
              <KpiCard
                label="On-Time Delivery"
                value={stats.onTimeDeliveryRate}
                unit="%"
                decimals={1}
                icon={<TrendingDown size={14} color="var(--risk-medium)" />}
                trend="down"
                trendLabel="Below 90% target"
              />
            </>
          )}
        </div>

        {/* Bottom row: Critical inventory + Recent disruptions */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.5fr',
            gap: 20,
            alignItems: 'start',
          }}
        >
          {/* Critical Inventory */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}
            >
              <h2
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.04em',
                }}
              >
                Critical Stock Items
              </h2>
              <span
                style={{
                  fontSize: 11,
                  color: 'var(--text-tertiary)',
                  padding: '2px 7px',
                  background: 'var(--bg-elevated)',
                  borderRadius: 99,
                  border: '1px solid var(--border)',
                }}
              >
                {criticalProducts.length} items
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonCard key={i} height={96} lines={2} />
                  ))
                : criticalProducts.slice(0, 6).map((p, i) => (
                    <InventoryCard key={p.id} product={p} index={i} />
                  ))}
            </div>
          </div>

          {/* Recent Disruptions */}
          <div>
            {loading ? (
              <SkeletonCard height={320} lines={5} />
            ) : (
              <RecentDisruptions disruptions={recentDisruptions} />
            )}

            {/* Risk overview mini chart placeholder */}
            <motion.div
              className="card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ padding: 20, marginTop: 16 }}
            >
              <div className="section-label" style={{ marginBottom: 14 }}>
                Supply Chain Health
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Tier 1 Suppliers', score: 72, total: 8 },
                  { label: 'Raw Materials', score: 58, total: 6 },
                  { label: 'Electronics & ICs', score: 84, total: 3 },
                  { label: 'Logistics Routes', score: 65, total: 12 },
                ].map(({ label, score, total }) => (
                  <div key={label}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 5,
                      }}
                    >
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{label}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                          {total} active
                        </span>
                        <span
                          className="mono"
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color:
                              score >= 80
                                ? 'var(--risk-critical)'
                                : score >= 60
                                ? 'var(--risk-high)'
                                : score >= 40
                                ? 'var(--risk-medium)'
                                : 'var(--risk-low)',
                          }}
                        >
                          {score}
                        </span>
                      </div>
                    </div>
                    <div className="progress-bar">
                      <motion.div
                        className="progress-bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        style={{
                          background:
                            score >= 80
                              ? 'var(--risk-critical)'
                              : score >= 60
                              ? 'var(--risk-high)'
                              : score >= 40
                              ? 'var(--risk-medium)'
                              : 'var(--risk-low)',
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
