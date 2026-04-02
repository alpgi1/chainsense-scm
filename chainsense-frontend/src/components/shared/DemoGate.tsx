import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Zap, Shield, TrendingUp } from 'lucide-react';

const AUTH_KEY = 'chainsense-demo-auth';
const DEMO_CODE = 'TUM2026';

interface DemoGateProps {
  children: React.ReactNode;
}

export function DemoGate({ children }: DemoGateProps) {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem(AUTH_KEY) === 'true'
  );
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  if (authenticated) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === DEMO_CODE) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      setAuthenticated(true);
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-base)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 600,
          height: 600,
          background: 'radial-gradient(circle, rgba(79,143,247,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: 440, zIndex: 1 }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                background: 'var(--accent-muted)',
                border: '1px solid var(--border-accent)',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Zap size={22} color="var(--accent)" />
            </div>
            <span
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              ChainSense SCM
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}
          >
            AI-Powered Supply Chain Risk Intelligence
            <br />
            for EV Battery Manufacturing
          </motion.p>
        </div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            display: 'flex',
            gap: 8,
            justifyContent: 'center',
            marginBottom: 32,
            flexWrap: 'wrap',
          }}
        >
          {[
            { icon: Shield, label: 'Multi-Agent AI' },
            { icon: TrendingUp, label: 'Enterprise RAG' },
            { icon: Zap, label: 'Real-Time Analysis' },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 10px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 99,
                fontSize: 12,
                color: 'var(--text-secondary)',
              }}
            >
              <Icon size={12} color="var(--accent)" />
              {label}
            </div>
          ))}
        </motion.div>

        {/* Card */}
        <motion.div
          animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : { x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              background: 'var(--bg-surface)',
              border: `1px solid ${error ? 'var(--risk-critical)' : 'var(--border)'}`,
              borderRadius: 16,
              padding: 32,
              boxShadow: error
                ? '0 0 0 3px rgba(239,68,68,0.12), var(--shadow-elevated)'
                : 'var(--shadow-elevated)',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: error ? 'rgba(239,68,68,0.12)' : 'var(--accent-muted)',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s',
                }}
              >
                <Lock size={16} color={error ? 'var(--risk-critical)' : 'var(--accent)'} />
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>
                  Demo Access Required
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 1 }}>
                  Enter your access code to continue
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--text-tertiary)',
                  marginBottom: 8,
                }}
              >
                Access Code
              </label>
              <input
                type="password"
                className="cs-input mono"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter demo code"
                autoFocus
                style={{
                  borderColor: error ? 'var(--risk-critical)' : undefined,
                  letterSpacing: '0.15em',
                }}
              />
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      marginTop: 8,
                      fontSize: 12,
                      color: 'var(--risk-critical)',
                    }}
                  >
                    Invalid access code. Please try again.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px 20px' }}>
              <Lock size={14} />
              Access Platform
            </button>
          </form>
        </motion.div>

        <p
          style={{
            textAlign: 'center',
            marginTop: 20,
            fontSize: 12,
            color: 'var(--text-tertiary)',
          }}
        >
          ChainSense SCM — TUM Capstone Project 2026
        </p>
      </motion.div>
    </div>
  );
}
