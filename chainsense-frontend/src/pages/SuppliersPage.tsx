import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, Search, Globe, Star, AlertTriangle, CheckCircle } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { RiskBadge } from '../components/shared/RiskBadge';
import { EmptyState } from '../components/shared/EmptyState';
import { suppliersApi } from '../api/suppliers';
import type { Supplier } from '../types/inventory.types';
import type { RiskLevel } from '../types/risk.types';
import { MOCK_SUPPLIERS } from '../data/mockData';

function supplierRiskToRiskLevel(r: Supplier['riskLevel']): RiskLevel {
  return r as RiskLevel;
}

function getReliabilityColor(score: number): string {
  if (score >= 90) return 'var(--risk-low)';
  if (score >= 75) return 'var(--risk-medium)';
  if (score >= 60) return 'var(--risk-high)';
  return 'var(--risk-critical)';
}

export function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [tierFilter, setTierFilter] = useState<string>('ALL');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await suppliersApi.getAll();
        setSuppliers(data);
      } catch {
        setSuppliers(MOCK_SUPPLIERS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = suppliers.filter((s) => {
    const matchesSearch =
      search === '' ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.country.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase());
    const matchesRisk = riskFilter === 'ALL' || s.riskLevel === riskFilter;
    const matchesTier = tierFilter === 'ALL' || s.tier.toString() === tierFilter;
    return matchesSearch && matchesRisk && matchesTier;
  });

  const riskCounts = {
    ALL: suppliers.length,
    LOW: suppliers.filter((s) => s.riskLevel === 'LOW').length,
    MEDIUM: suppliers.filter((s) => s.riskLevel === 'MEDIUM').length,
    HIGH: suppliers.filter((s) => s.riskLevel === 'HIGH').length,
    CRITICAL: suppliers.filter((s) => s.riskLevel === 'CRITICAL').length,
  };

  const avgReliability =
    suppliers.length > 0
      ? Math.round(suppliers.reduce((sum, s) => sum + s.reliabilityScore, 0) / suppliers.length)
      : 0;

  const atRiskCount = suppliers.filter((s) => s.riskLevel === 'HIGH' || s.riskLevel === 'CRITICAL').length;

  const totalContractValue = suppliers.reduce((sum, s) => sum + (s.annualContractValue ?? 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header
        title="Supplier Network"
        subtitle={`${suppliers.length} active suppliers across ${new Set(suppliers.map((s) => s.country)).size} countries`}
      />

      <div style={{ flex: 1, padding: '24px 28px', overflowY: 'auto' }}>
        {/* Stats row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 12,
            marginBottom: 20,
          }}
        >
          {[
            {
              label: 'Total Suppliers',
              value: suppliers.length,
              icon: <Truck size={14} color="var(--accent)" />,
              color: 'var(--text-primary)',
            },
            {
              label: 'At-Risk Suppliers',
              value: atRiskCount,
              icon: <AlertTriangle size={14} color="var(--risk-critical)" />,
              color: 'var(--risk-critical)',
            },
            {
              label: 'Avg Reliability',
              value: `${avgReliability}%`,
              icon: <Star size={14} color="var(--risk-medium)" />,
              color: getReliabilityColor(avgReliability),
            },
            {
              label: 'Contract Value',
              value: `€${(totalContractValue / 1000000).toFixed(1)}M`,
              icon: <CheckCircle size={14} color="var(--risk-low)" />,
              color: 'var(--risk-low)',
            },
          ].map(({ label, value, icon, color }) => (
            <motion.div
              key={label}
              className="card"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ padding: '14px 16px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                {icon}
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600 }}>
                  {label}
                </span>
              </div>
              <div className="mono" style={{ fontSize: 24, fontWeight: 600, color }}>
                {value}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            marginBottom: 16,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search
              size={14}
              color="var(--text-tertiary)"
              style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              className="cs-input"
              placeholder="Search by name, country or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 36 }}
            />
          </div>

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {Object.entries(riskCounts).map(([key, count]) => (
              <button
                key={key}
                className={riskFilter === key ? 'btn-primary' : 'btn-secondary'}
                onClick={() => setRiskFilter(key)}
                style={{ padding: '7px 12px', fontSize: 12 }}
              >
                {key} ({count})
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            {['ALL', '1', '2'].map((tier) => (
              <button
                key={tier}
                className={tierFilter === tier ? 'btn-primary' : 'btn-secondary'}
                onClick={() => setTierFilter(tier)}
                style={{ padding: '7px 12px', fontSize: 12 }}
              >
                {tier === 'ALL' ? 'All Tiers' : `Tier ${tier}`}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <table className="cs-table">
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Location</th>
                <th>Category</th>
                <th>Tier</th>
                <th>Reliability</th>
                <th>Lead Time</th>
                <th>Risk Level</th>
                <th>Contract Value</th>
                <th>Contracts</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 9 }).map((__, j) => (
                      <td key={j}>
                        <div className="skeleton" style={{ height: 12, width: '80%' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <EmptyState
                      title="No suppliers found"
                      description="Try adjusting your search or filters."
                    />
                  </td>
                </tr>
              ) : (
                filtered.map((s, i) => {
                  const reliabilityColor = getReliabilityColor(s.reliabilityScore);
                  return (
                    <motion.tr
                      key={s.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                    >
                      <td>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>
                          {s.name}
                        </div>
                        {s.contactEmail && (
                          <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{s.contactEmail}</div>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <Globe size={11} color="var(--text-tertiary)" />
                          <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                            {s.city}, {s.country}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: 12,
                            padding: '2px 7px',
                            borderRadius: 4,
                            background: 'var(--bg-overlay)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {s.category}
                        </span>
                      </td>
                      <td>
                        <span
                          className="mono"
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: s.tier === 1 ? 'var(--accent)' : 'var(--text-secondary)',
                          }}
                        >
                          T{s.tier}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 48 }}>
                            <div className="progress-bar" style={{ height: 3, marginBottom: 3 }}>
                              <div
                                className="progress-bar-fill"
                                style={{
                                  width: `${s.reliabilityScore}%`,
                                  background: reliabilityColor,
                                }}
                              />
                            </div>
                          </div>
                          <span
                            className="mono"
                            style={{ fontSize: 12, fontWeight: 700, color: reliabilityColor }}
                          >
                            {s.reliabilityScore}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="mono" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                          {s.leadTimeDays}d
                        </span>
                      </td>
                      <td>
                        <RiskBadge level={supplierRiskToRiskLevel(s.riskLevel)} size="sm" />
                      </td>
                      <td>
                        <span className="mono" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                          {s.annualContractValue
                            ? `€${(s.annualContractValue / 1000000).toFixed(1)}M`
                            : '—'}
                        </span>
                      </td>
                      <td>
                        <span className="mono" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                          {s.activeContracts ?? '—'}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 10, fontSize: 12, color: 'var(--text-tertiary)', textAlign: 'right' }}>
          {filtered.length} of {suppliers.length} suppliers
        </div>
      </div>
    </div>
  );
}
