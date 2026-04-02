import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Zap,
  History,
  Package,
  Truck,
  GitCompare,
  Search,
} from 'lucide-react';

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
}

interface CommandPaletteProps {
  onClose: () => void;
}

export function CommandPalette({ onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const execute = useCallback(
    (action: () => void) => {
      action();
      onClose();
    },
    [onClose],
  );

  const commands: Command[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      description: 'Go to supply chain dashboard',
      icon: <LayoutDashboard size={15} />,
      action: () => navigate('/'),
    },
    {
      id: 'chaos',
      label: 'Chaos Analysis',
      description: 'Open disruption analysis page',
      icon: <Zap size={15} />,
      action: () => navigate('/chaos'),
    },
    {
      id: 'new-analysis',
      label: 'New Analysis',
      description: 'Start a new disruption analysis',
      icon: <Zap size={15} />,
      action: () => navigate('/chaos'),
    },
    {
      id: 'history',
      label: 'History',
      description: 'View analysis history',
      icon: <History size={15} />,
      action: () => navigate('/history'),
    },
    {
      id: 'inventory',
      label: 'Inventory',
      description: 'Manage inventory and stock levels',
      icon: <Package size={15} />,
      action: () => navigate('/inventory'),
    },
    {
      id: 'suppliers',
      label: 'Suppliers',
      description: 'View and manage supplier relationships',
      icon: <Truck size={15} />,
      action: () => navigate('/suppliers'),
    },
    {
      id: 'compare',
      label: 'Compare Mode',
      description: 'then click Compare Mode on Chaos Analysis',
      icon: <GitCompare size={15} />,
      action: () => navigate('/chaos'),
    },
  ];

  const filtered = commands.filter((cmd) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      cmd.label.toLowerCase().includes(q) ||
      (cmd.description ?? '').toLowerCase().includes(q)
    );
  });

  // Reset active index when filter changes
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Scroll active item into view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const items = list.querySelectorAll<HTMLElement>('[data-cmd-item]');
    if (items[activeIndex]) {
      items[activeIndex].scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filtered.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const cmd = filtered[activeIndex];
      if (cmd) execute(cmd.action);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 10000,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: '15vh',
        }}
      >
        {/* Palette box */}
        <motion.div
          key="palette"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxWidth: 560,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-accent)',
            borderRadius: 14,
            overflow: 'hidden',
            boxShadow: 'var(--shadow-elevated)',
            margin: '0 20px',
          }}
        >
          {/* Search row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 16px',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <Search size={16} color="var(--text-tertiary)" style={{ flexShrink: 0 }} />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search commands..."
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: 18,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                flex: 1,
                caretColor: 'var(--accent)',
              }}
            />
            <kbd
              style={{
                fontSize: 11,
                color: 'var(--text-tertiary)',
                background: 'var(--bg-overlay)',
                border: '1px solid var(--border)',
                borderRadius: 5,
                padding: '2px 6px',
                fontFamily: 'monospace',
                flexShrink: 0,
              }}
            >
              ESC
            </kbd>
          </div>

          {/* Command list */}
          <div
            ref={listRef}
            style={{
              maxHeight: 340,
              overflowY: 'auto',
              padding: '6px 6px',
            }}
          >
            {filtered.length === 0 ? (
              <div
                style={{
                  padding: '24px 16px',
                  textAlign: 'center',
                  fontSize: 13,
                  color: 'var(--text-tertiary)',
                }}
              >
                No commands found for "{query}"
              </div>
            ) : (
              filtered.map((cmd, i) => {
                const isActive = i === activeIndex;
                return (
                  <div
                    key={cmd.id}
                    data-cmd-item
                    onClick={() => execute(cmd.action)}
                    onMouseEnter={() => setActiveIndex(i)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 12px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      background: isActive ? 'var(--accent-muted)' : 'transparent',
                      transition: 'background 0.1s',
                    }}
                  >
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 7,
                        background: isActive ? 'rgba(79,143,247,0.15)' : 'var(--bg-overlay)',
                        border: `1px solid ${isActive ? 'var(--border-accent)' : 'var(--border)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        color: isActive ? 'var(--accent)' : 'var(--text-tertiary)',
                        transition: 'all 0.1s',
                      }}
                    >
                      {cmd.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: isActive ? 'var(--accent)' : 'var(--text-primary)',
                          marginBottom: cmd.description ? 2 : 0,
                          transition: 'color 0.1s',
                        }}
                      >
                        {cmd.label}
                      </div>
                      {cmd.description && (
                        <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                          {cmd.description}
                        </div>
                      )}
                    </div>
                    {isActive && (
                      <kbd
                        style={{
                          fontSize: 11,
                          color: 'var(--accent)',
                          background: 'rgba(79,143,247,0.1)',
                          border: '1px solid var(--border-accent)',
                          borderRadius: 5,
                          padding: '2px 6px',
                          fontFamily: 'monospace',
                          flexShrink: 0,
                        }}
                      >
                        Enter
                      </kbd>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer hint */}
          <div
            style={{
              padding: '8px 16px',
              borderTop: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            {[
              { keys: ['↑', '↓'], label: 'Navigate' },
              { keys: ['Enter'], label: 'Select' },
              { keys: ['Esc'], label: 'Close' },
            ].map(({ keys, label }) => (
              <div
                key={label}
                style={{ display: 'flex', alignItems: 'center', gap: 4 }}
              >
                {keys.map((k) => (
                  <kbd
                    key={k}
                    style={{
                      fontSize: 10,
                      color: 'var(--text-tertiary)',
                      background: 'var(--bg-overlay)',
                      border: '1px solid var(--border)',
                      borderRadius: 4,
                      padding: '1px 5px',
                      fontFamily: 'monospace',
                    }}
                  >
                    {k}
                  </kbd>
                ))}
                <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
