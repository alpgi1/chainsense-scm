import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: number | string;
  unit?: string;
  prefix?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  icon?: React.ReactNode;
  accent?: boolean;
  danger?: boolean;
  decimals?: number;
  formatValue?: (v: number) => string;
}

function useCountUp(target: number, decimals: number = 0): number {
  const [val, setVal] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const duration = 1000;
    const animate = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const raw = eased * target;
      setVal(parseFloat(raw.toFixed(decimals)));
      if (p < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [target, decimals]);

  return val;
}

export function KpiCard({
  label,
  value,
  unit,
  prefix,
  trend,
  trendLabel,
  icon,
  accent,
  danger,
  decimals = 0,
  formatValue,
}: KpiCardProps) {
  const numericValue = typeof value === 'number' ? value : parseFloat(value as string) || 0;
  const animated = useCountUp(numericValue, decimals);

  const displayValue = typeof value === 'string' && isNaN(parseFloat(value))
    ? value
    : formatValue
    ? formatValue(animated)
    : animated.toFixed(decimals);

  const accentColor = danger
    ? 'var(--risk-critical)'
    : accent
    ? 'var(--accent)'
    : 'var(--text-primary)';

  const TrendIcon =
    trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor =
    trend === 'up'
      ? 'var(--risk-low)'
      : trend === 'down'
      ? 'var(--risk-critical)'
      : 'var(--text-tertiary)';

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{ padding: 20 }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 600, letterSpacing: '0.04em' }}>
          {label}
        </span>
        {icon && (
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: danger
                ? 'rgba(239,68,68,0.1)'
                : accent
                ? 'var(--accent-muted)'
                : 'var(--bg-elevated)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
        {prefix && (
          <span className="mono" style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            {prefix}
          </span>
        )}
        <span
          className="mono"
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: accentColor,
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}
        >
          {displayValue}
        </span>
        {unit && (
          <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{unit}</span>
        )}
      </div>

      {trend && trendLabel && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 11,
            color: trendColor,
          }}
        >
          <TrendIcon size={12} />
          {trendLabel}
        </div>
      )}
    </motion.div>
  );
}
