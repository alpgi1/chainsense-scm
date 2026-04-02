import { motion } from 'framer-motion';
import { AlertTriangle, Clock } from 'lucide-react';
import type { Product } from '../../types/inventory.types';
import { RiskBadge } from '../shared/RiskBadge';
import type { RiskLevel } from '../../types/risk.types';

interface InventoryCardProps {
  product: Product;
  index?: number;
}

function getStockColor(days: number): string {
  if (days <= 5) return 'var(--risk-critical)';
  if (days <= 10) return 'var(--risk-high)';
  if (days <= 20) return 'var(--risk-medium)';
  return 'var(--risk-low)';
}

function criticalityToRiskLevel(c: Product['criticality']): RiskLevel {
  switch (c) {
    case 'CRITICAL': return 'CRITICAL';
    case 'HIGH': return 'HIGH';
    case 'MEDIUM': return 'MEDIUM';
    case 'LOW': return 'LOW';
  }
}

export function InventoryCard({ product, index = 0 }: InventoryCardProps) {
  const days = product.daysOfStockRemaining ?? Math.floor(product.quantityOnHand / product.dailyConsumptionRate);
  const fillPct = Math.min((product.quantityOnHand / product.maxCapacity) * 100, 100);
  const stockColor = getStockColor(days);
  const isCritical = days <= 7;

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      style={{ padding: 16 }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--text-primary)',
              marginBottom: 2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {product.name}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'JetBrains Mono, monospace' }}>
            {product.sku}
          </div>
        </div>
        <RiskBadge level={criticalityToRiskLevel(product.criticality)} size="sm" />
      </div>

      {/* Stock bar */}
      <div style={{ marginBottom: 10 }}>
        <div className="progress-bar">
          <motion.div
            className="progress-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${fillPct}%` }}
            transition={{ duration: 0.8, delay: index * 0.05 + 0.2, ease: 'easeOut' }}
            style={{ background: stockColor }}
          />
        </div>
      </div>

      {/* Metrics row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {isCritical && <AlertTriangle size={12} color="var(--risk-critical)" />}
          <Clock size={12} color={stockColor} />
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: stockColor,
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            {days}d
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>remaining</span>
        </div>
        <span
          style={{
            fontSize: 11,
            color: 'var(--text-tertiary)',
            fontFamily: 'JetBrains Mono, monospace',
          }}
        >
          {product.quantityOnHand.toLocaleString()} units
        </span>
      </div>

      {product.supplierName && (
        <div
          style={{
            marginTop: 8,
            paddingTop: 8,
            borderTop: '1px solid var(--border)',
            fontSize: 11,
            color: 'var(--text-tertiary)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <span>Supplier:</span>
          <span style={{ color: 'var(--text-secondary)' }}>{product.supplierName}</span>
        </div>
      )}
    </motion.div>
  );
}
