import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Zap,
  History,
  Package,
  Truck,
  Database,
  Brain,
} from 'lucide-react';
import * as Switch from '@radix-ui/react-switch';
import { useRetrievalMode } from '../../hooks/useRetrievalMode';

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/chaos', icon: Zap, label: 'Chaos Analysis' },
  { to: '/history', icon: History, label: 'History' },
  { to: '/inventory', icon: Package, label: 'Inventory' },
  { to: '/suppliers', icon: Truck, label: 'Suppliers' },
];

export function Sidebar() {
  const location = useLocation();
  const { mode, setMode } = useRetrievalMode();
  const ragEnabled = mode === 'RAG';

  return (
    <div
      style={{
        width: 240,
        minWidth: 240,
        height: '100vh',
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: 'var(--accent-muted)',
              border: '1px solid var(--border-accent)',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Zap size={18} color="var(--accent)" />
          </div>
          <div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
              }}
            >
              ChainSense
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-tertiary)', fontWeight: 500 }}>
              SCM Intelligence
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 10px', flex: 1 }}>
        <div style={{ marginBottom: 4 }}>
          <span
            style={{
              display: 'block',
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-tertiary)',
              padding: '4px 10px 8px',
            }}
          >
            Navigation
          </span>
        </div>

        {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
          const isActive =
            to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

          return (
            <NavLink
              key={to}
              to={to}
              style={{ textDecoration: 'none', display: 'block', marginBottom: 2 }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 10px',
                  borderRadius: 8,
                  position: 'relative',
                  background: isActive ? 'var(--accent-muted)' : 'transparent',
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  transition: 'background 0.15s, color 0.15s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-elevated)';
                    (e.currentTarget as HTMLDivElement).style.color = 'var(--text-primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                    (e.currentTarget as HTMLDivElement).style.color = 'var(--text-secondary)';
                  }
                }}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '20%',
                      bottom: '20%',
                      width: 3,
                      background: 'var(--accent)',
                      borderRadius: '0 2px 2px 0',
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon size={16} style={{ flexShrink: 0 }} />
                {label}
              </div>
            </NavLink>
          );
        })}
      </nav>

      {/* RAG Mode toggle */}
      <div
        style={{
          padding: 16,
          borderTop: '1px solid var(--border)',
          margin: '0 10px 10px',
          background: ragEnabled ? 'rgba(79,143,247,0.04)' : 'var(--bg-elevated)',
          borderRadius: 10,
          border: `1px solid ${ragEnabled ? 'var(--border-accent)' : 'var(--border)'}`,
          transition: 'all 0.3s',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: ragEnabled ? 'var(--accent-muted)' : 'var(--bg-overlay)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'background 0.3s',
            }}
          >
            {ragEnabled ? (
              <Brain size={14} color="var(--accent)" />
            ) : (
              <Database size={14} color="var(--text-tertiary)" />
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 3,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: ragEnabled ? 'var(--accent)' : 'var(--text-secondary)',
                  transition: 'color 0.3s',
                }}
              >
                Enterprise RAG
              </span>
              <Switch.Root
                checked={ragEnabled}
                onCheckedChange={(checked) => setMode(checked ? 'RAG' : 'CONTEXT')}
                style={{
                  width: 32,
                  height: 18,
                  background: ragEnabled ? 'var(--accent)' : 'var(--bg-overlay)',
                  borderRadius: 99,
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                  position: 'relative',
                  outline: 'none',
                  flexShrink: 0,
                  transition: 'background 0.2s',
                }}
              >
                <Switch.Thumb
                  style={{
                    display: 'block',
                    width: 12,
                    height: 12,
                    background: 'white',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: 2,
                    left: ragEnabled ? 16 : 2,
                    transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
              </Switch.Root>
            </div>
            <div style={{ fontSize: 10, color: 'var(--text-tertiary)', lineHeight: 1.4 }}>
              {ragEnabled
                ? 'Semantic vector search active'
                : 'Context-only retrieval mode'}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '12px 20px',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div style={{ fontSize: 10, color: 'var(--text-tertiary)', textAlign: 'center' }}>
          ChainSense SCM v2.0
        </div>
      </div>
    </div>
  );
}
