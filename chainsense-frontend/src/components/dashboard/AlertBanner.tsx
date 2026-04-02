import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AlertBannerProps {
  criticalCount: number;
  onDismiss?: () => void;
}

export function AlertBanner({ criticalCount, onDismiss }: AlertBannerProps) {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = React.useState(false);

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  return (
    <AnimatePresence>
      {criticalCount > 0 && !dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -16, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -8, height: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{
            background: 'rgba(239, 68, 68, 0.06)',
            borderLeft: '3px solid var(--risk-critical)',
            borderBottom: '1px solid rgba(239,68,68,0.15)',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: 'rgba(239,68,68,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={14} color="var(--risk-critical)" />
          </div>

          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--risk-critical)' }}>
              {criticalCount} Critical Stock Alert{criticalCount > 1 ? 's' : ''}
            </span>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', marginLeft: 8 }}>
              {criticalCount} product{criticalCount > 1 ? 's' : ''} will stockout within 7 days.
              Immediate action required.
            </span>
          </div>

          <button
            className="btn-ghost"
            onClick={() => navigate('/chaos')}
            style={{
              color: 'var(--risk-critical)',
              fontSize: 12,
              fontWeight: 600,
              gap: 4,
              padding: '5px 10px',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 6,
            }}
          >
            Analyze Now
            <ArrowRight size={12} />
          </button>

          <button
            className="btn-ghost"
            onClick={handleDismiss}
            style={{ padding: '4px 6px', flexShrink: 0 }}
          >
            <X size={14} color="var(--text-tertiary)" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
