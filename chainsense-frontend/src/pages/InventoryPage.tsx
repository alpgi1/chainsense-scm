import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Search, AlertTriangle, TrendingDown } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { RiskBadge } from '../components/shared/RiskBadge';
import { EmptyState } from '../components/shared/EmptyState';
import { inventoryApi } from '../api/inventory';
import type { Product } from '../types/inventory.types';
import { MOCK_PRODUCTS } from '../data/mockData';
import type { RiskLevel } from '../types/risk.types';

function criticalityToRiskLevel(c: Product['criticality']): RiskLevel {
  switch (c) {
    case 'CRITICAL': return 'CRITICAL';
    case 'HIGH': return 'HIGH';
    case 'MEDIUM': return 'MEDIUM';
    case 'LOW': return 'LOW';
  }
}

function getDaysColor(days: number): string {
  if (days <= 5) return 'var(--risk-critical)';
  if (days <= 10) return 'var(--risk-high)';
  if (days <= 20) return 'var(--risk-medium)';
  return 'var(--risk-low)';
}

export function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [critFilter, setCritFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'days' | 'stock' | 'name'>('days');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await inventoryApi.getAll();
        setProducts(data);
      } catch {
        setProducts(MOCK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = products
    .filter((p) => {
      const matchesSearch =
        search === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());
      const matchesCrit = critFilter === 'ALL' || p.criticality === critFilter;
      return matchesSearch && matchesCrit;
    })
    .sort((a, b) => {
      const aDays = a.daysOfStockRemaining ?? Math.floor(a.quantityOnHand / a.dailyConsumptionRate);
      const bDays = b.daysOfStockRemaining ?? Math.floor(b.quantityOnHand / b.dailyConsumptionRate);
      if (sortBy === 'days') return aDays - bDays;
      if (sortBy === 'stock') return b.quantityOnHand - a.quantityOnHand;
      return a.name.localeCompare(b.name);
    });

  const critCounts = {
    ALL: products.length,
    CRITICAL: products.filter((p) => p.criticality === 'CRITICAL').length,
    HIGH: products.filter((p) => p.criticality === 'HIGH').length,
    MEDIUM: products.filter((p) => p.criticality === 'MEDIUM').length,
    LOW: products.filter((p) => p.criticality === 'LOW').length,
  };

  const atRisk = products.filter((p) => {
    const days = p.daysOfStockRemaining ?? Math.floor(p.quantityOnHand / p.dailyConsumptionRate);
    return days <= 14;
  }).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header
        title="Inventory Management"
        subtitle={`${products.length} products tracked across ${new Set(products.map((p) => p.category)).size} categories`}
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
              label: 'Total Products',
              value: products.length,
              icon: <Package size={14} color="var(--accent)" />,
              color: 'var(--text-primary)',
            },
            {
              label: 'Critical Items',
              value: critCounts.CRITICAL,
              icon: <AlertTriangle size={14} color="var(--risk-critical)" />,
              color: 'var(--risk-critical)',
            },
            {
              label: 'At Risk (< 14d)',
              value: atRisk,
              icon: <TrendingDown size={14} color="var(--risk-high)" />,
              color: 'var(--risk-high)',
            },
            {
              label: 'Healthy Stock',
              value: products.length - atRisk,
              icon: <Package size={14} color="var(--risk-low)" />,
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
              placeholder="Search by name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: 36 }}
            />
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            {Object.entries(critCounts).map(([key, count]) => (
              <button
                key={key}
                className={critFilter === key ? 'btn-primary' : 'btn-secondary'}
                onClick={() => setCritFilter(key)}
                style={{ padding: '7px 12px', fontSize: 12 }}
              >
                {key} ({count})
              </button>
            ))}
          </div>

          <select
            className="cs-input"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            style={{ width: 'auto', cursor: 'pointer' }}
          >
            <option value="days">Sort: Days Remaining</option>
            <option value="stock">Sort: Stock Level</option>
            <option value="name">Sort: Name</option>
          </select>
        </div>

        {/* Table */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <table className="cs-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Criticality</th>
                <th>Stock</th>
                <th>Daily Use</th>
                <th>Days Left</th>
                <th>Reorder Point</th>
                <th>Unit Cost</th>
                <th>Lead Time</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 10 }).map((__, j) => (
                      <td key={j}>
                        <div className="skeleton" style={{ height: 12, width: '80%' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={10}>
                    <EmptyState
                      title="No products found"
                      description="Try adjusting your search or filters."
                    />
                  </td>
                </tr>
              ) : (
                filtered.map((p, i) => {
                  const days =
                    p.daysOfStockRemaining ??
                    Math.floor(p.quantityOnHand / p.dailyConsumptionRate);
                  const daysColor = getDaysColor(days);
                  const fillPct = Math.min((p.quantityOnHand / p.maxCapacity) * 100, 100);
                  const belowReorder = p.quantityOnHand <= p.reorderPoint;

                  return (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                    >
                      <td>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: 'var(--text-primary)',
                            marginBottom: 2,
                          }}
                        >
                          {p.name}
                        </div>
                        {p.supplierName && (
                          <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                            {p.supplierName}
                          </div>
                        )}
                      </td>
                      <td>
                        <span
                          className="mono"
                          style={{ fontSize: 11, color: 'var(--text-tertiary)' }}
                        >
                          {p.sku}
                        </span>
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
                          {p.category}
                        </span>
                      </td>
                      <td>
                        <RiskBadge level={criticalityToRiskLevel(p.criticality)} size="sm" />
                      </td>
                      <td>
                        <div style={{ minWidth: 80 }}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              marginBottom: 3,
                              fontSize: 12,
                            }}
                          >
                            <span className="mono" style={{ color: 'var(--text-primary)' }}>
                              {p.quantityOnHand.toLocaleString()}
                            </span>
                            {belowReorder && (
                              <AlertTriangle
                                size={11}
                                color="var(--risk-critical)"
                                style={{ flexShrink: 0 }}
                              />
                            )}
                          </div>
                          <div className="progress-bar" style={{ height: 3 }}>
                            <div
                              className="progress-bar-fill"
                              style={{
                                width: `${fillPct}%`,
                                background: belowReorder ? 'var(--risk-critical)' : 'var(--accent)',
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="mono" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                          {p.dailyConsumptionRate}/d
                        </span>
                      </td>
                      <td>
                        <span
                          className="mono"
                          style={{ fontSize: 13, fontWeight: 700, color: daysColor }}
                        >
                          {days}d
                        </span>
                      </td>
                      <td>
                        <span className="mono" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                          {p.reorderPoint.toLocaleString()}
                        </span>
                      </td>
                      <td>
                        <span className="mono" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                          €{p.unitCost.toFixed(2)}
                        </span>
                      </td>
                      <td>
                        <span className="mono" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                          {p.leadTimeDays}d
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
          {filtered.length} of {products.length} products
        </div>
      </div>
    </div>
  );
}
