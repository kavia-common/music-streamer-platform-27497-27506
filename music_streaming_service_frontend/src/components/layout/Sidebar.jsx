import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Sidebar
 * A responsive left navigation following the Ocean Professional theme.
 * - Fixed left on desktop, collapses to icon-only on small screens.
 * - Provides navigation links to Home, Search, Library, Account.
 * - Uses NavLink for active route styling.
 * - Accessible: <nav> landmark, aria-current on active, focus outlines via global CSS.
 */
export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  // Collapse sidebar for small widths; also allow manual toggle via button (optional).
  useEffect(() => {
    const onResize = () => setCollapsed(window.innerWidth < 900);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const itemCls = ({ isActive }) => `nav-item${isActive ? ' active' : ''}`;

  const labelStyle = {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  return (
    <aside className="sidebar" aria-label="Primary">
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', minWidth: 0 }}>
            <div
              aria-hidden="true"
              style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--color-primary)' }}
            />
            {!collapsed && <strong style={{ ...labelStyle }}>Music Streamer</strong>}
          </div>
          {/* Manual collapse toggle for accessibility on mid-size screens */}
          <button
            type="button"
            aria-pressed={collapsed}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={() => setCollapsed((c) => !c)}
            className="shadow-hover"
            style={{
              padding: '.35rem .6rem',
              borderRadius: 10,
              background: 'rgba(37,99,235,0.08)',
            }}
          >
            {collapsed ? '➡️' : '⬅️'}
          </button>
        </div>
      </div>

      <nav aria-label="Main">
        <ul style={{ display: 'grid', gap: '.25rem' }}>
          <li>
            <NavLink to="/" className={itemCls} end>
              <span aria-hidden="true">🏠</span>
              {!collapsed && <span style={labelStyle}>Home</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/search" className={itemCls}>
              <span aria-hidden="true">🔎</span>
              {!collapsed && <span style={labelStyle}>Search</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/library" className={itemCls}>
              <span aria-hidden="true">🎵</span>
              {!collapsed && <span style={labelStyle}>Library</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/account" className={itemCls}>
              <span aria-hidden="true">👤</span>
              {!collapsed && <span style={labelStyle}>Account</span>}
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
