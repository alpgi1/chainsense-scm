import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import type { Toast, ToastType } from '../../context/ToastContext';

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function getToastStyles(type: ToastType): {
  borderColor: string;
  iconColor: string;
  icon: React.ReactNode;
} {
  switch (type) {
    case 'success':
      return {
        borderColor: 'var(--risk-low)',
        iconColor: 'var(--risk-low)',
        icon: <CheckCircle size={16} />,
      };
    case 'error':
      return {
        borderColor: 'var(--risk-critical)',
        iconColor: 'var(--risk-critical)',
        icon: <XCircle size={16} />,
      };
    case 'info':
      return {
        borderColor: 'var(--accent)',
        iconColor: 'var(--accent)',
        icon: <Info size={16} />,
      };
  }
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const { borderColor, iconColor, icon } = getToastStyles(toast.type);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={{
        width: 300,
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderLeft: `3px solid ${borderColor}`,
        borderRadius: 10,
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        boxShadow: 'var(--shadow-elevated)',
        pointerEvents: 'auto',
      }}
    >
      {/* Icon */}
      <div style={{ color: iconColor, flexShrink: 0, marginTop: 1 }}>{icon}</div>

      {/* Message */}
      <span
        style={{
          fontSize: 13,
          color: 'var(--text-primary)',
          lineHeight: 1.45,
          flex: 1,
        }}
      >
        {toast.message}
      </span>

      {/* Close button */}
      <button
        onClick={() => onRemove(toast.id)}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-tertiary)',
          padding: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          borderRadius: 4,
          transition: 'color 0.15s',
          marginTop: 1,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-tertiary)';
        }}
      >
        <X size={13} />
      </button>
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence mode="sync">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
}
