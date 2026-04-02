import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Sidebar } from './Sidebar';

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Hamburger button — hidden on desktop via CSS, shown on mobile */}
      <button
        className="hamburger-btn btn-ghost"
        onClick={() => setSidebarOpen(true)}
        style={{
          display: 'none', // overridden by CSS media query
          position: 'fixed',
          top: 14,
          left: 14,
          zIndex: 200,
          padding: '8px',
        }}
        title="Open navigation"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 99,
            display: 'none', // shown only on mobile via class + CSS
          }}
          className="sidebar-overlay"
        />
      )}

      {/* Sidebar wrapper — adds sidebar-open class when mobile menu is open */}
      <div className={sidebarOpen ? 'sidebar-open' : ''}>
        <Sidebar />
        {/* Mobile close button inside sidebar overlay */}
        {sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed',
              top: 14,
              left: 14,
              zIndex: 201,
              display: 'none',
              padding: 8,
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
            className="hamburger-btn"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Main content area */}
      <div
        className="main-content"
        style={{
          flex: 1,
          marginLeft: 240,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          overflow: 'auto',
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}
