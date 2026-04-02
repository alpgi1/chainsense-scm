import React from 'react';
import { motion } from 'framer-motion';
import { Bell, RefreshCw } from 'lucide-react';
import { useRetrievalMode } from '../../hooks/useRetrievalMode';

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  onRefresh?: () => void;
}

export function Header({ title, subtitle, actions, onRefresh }: HeaderProps) {
  const { mode } = useRetrievalMode();

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 28px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-surface)',
        flexShrink: 0,
      }}
    >
      <div>
        <h1
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Mode indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '5px 10px',
            borderRadius: 99,
            background: mode === 'RAG' ? 'var(--accent-muted)' : 'var(--bg-elevated)',
            border: `1px solid ${mode === 'RAG' ? 'var(--border-accent)' : 'var(--border)'}`,
            fontSize: 11,
            fontWeight: 600,
            color: mode === 'RAG' ? 'var(--accent)' : 'var(--text-tertiary)',
            transition: 'all 0.3s',
          }}
        >
          <span
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: mode === 'RAG' ? 'var(--accent)' : 'var(--text-tertiary)',
              display: 'inline-block',
            }}
          />
          {mode === 'RAG' ? 'RAG Mode' : 'Context Mode'}
        </div>

        {onRefresh && (
          <button
            className="btn-ghost"
            onClick={onRefresh}
            title="Refresh"
            style={{ padding: '6px 8px' }}
          >
            <RefreshCw size={15} />
          </button>
        )}

        <button
          className="btn-ghost"
          style={{ padding: '6px 8px', position: 'relative' }}
          title="Notifications"
        >
          <Bell size={15} />
          <span
            style={{
              position: 'absolute',
              top: 5,
              right: 5,
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: 'var(--risk-critical)',
              border: '1.5px solid var(--bg-surface)',
            }}
          />
        </button>

        {actions}
      </div>
    </motion.header>
  );
}
