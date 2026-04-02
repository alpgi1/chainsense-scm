import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { getRiskLevel } from '../../types/risk.types';
import type { RiskLevel } from '../../types/risk.types';

interface RiskGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  animated?: boolean;
}

const LEVEL_COLORS: Record<RiskLevel, string> = {
  LOW: '#10b981',
  MEDIUM: '#f59e0b',
  HIGH: '#f97316',
  CRITICAL: '#ef4444',
};

function useCountUp(target: number, duration: number = 1200, enabled: boolean = true) {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      setValue(target);
      return;
    }
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration, enabled]);

  return value;
}

export function RiskGauge({
  score,
  size = 120,
  strokeWidth = 8,
  label,
  animated = true,
}: RiskGaugeProps) {
  const level = getRiskLevel(score);
  const color = LEVEL_COLORS[level];

  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  // Use 270° arc (from 135° to 405°)
  const arcAngle = 270;
  const startAngle = 135;

  const displayScore = useCountUp(score, 1200, animated);
  const progress = displayScore / 100;

  // SVG arc path
  const polarToCartesian = (cx: number, cy: number, r: number, angleDeg: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  const describeArc = (cx: number, cy: number, r: number, startDeg: number, endDeg: number) => {
    const start = polarToCartesian(cx, cy, r, endDeg);
    const end = polarToCartesian(cx, cy, r, startDeg);
    const largeArc = endDeg - startDeg <= 180 ? '0' : '1';
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
  };

  const trackPath = describeArc(center, center, radius, startAngle, startAngle + arcAngle);

  // For the filled arc, we compute the end angle based on progress
  const endAngle = startAngle + arcAngle * progress;
  const filledPath = describeArc(center, center, radius, startAngle, Math.max(startAngle + 0.01, endAngle));

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ display: 'block' }}>
          {/* Track */}
          <path
            d={trackPath}
            fill="none"
            stroke="var(--bg-overlay)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Fill */}
          <motion.path
            d={filledPath}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              filter: `drop-shadow(0 0 6px ${color}60)`,
            }}
          />
        </svg>

        {/* Center text */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            className="mono"
            style={{
              fontSize: size < 100 ? 20 : 26,
              fontWeight: 600,
              color: color,
              lineHeight: 1,
            }}
          >
            {displayScore}
          </span>
          {size >= 100 && (
            <span style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 2 }}>
              / 100
            </span>
          )}
        </div>
      </div>

      {label && (
        <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 600 }}>
          {label}
        </span>
      )}

      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: color,
          letterSpacing: '0.06em',
        }}
      >
        {level} RISK
      </span>
    </div>
  );
}
