import React from 'react';
import { useLocation } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * TopBar
 * Ocean Professional top bar with subtle gradient background. Sticky at the top of the main content.
 * Props:
 *  - title?: string (if omitted, derived from current route)
 *  - right?: ReactNode (optional right-aligned actions slot)
 */
export default function TopBar({ title, right = null }) {
  const location = useLocation();

  // Derive a basic title from pathname if not provided
  const routeTitle = React.useMemo(() => {
    if (title) return title;
    const path = location.pathname;
    if (path === '/' || path === '') return 'Home';
    if (path.startsWith('/search')) return 'Search';
    if (path.startsWith('/library')) return 'Your Library';
    if (path.startsWith('/playlist')) return 'Playlist';
    if (path.startsWith('/account')) return 'Account';
    // Fallback: capitalize last segment
    const seg = path.split('/').filter(Boolean).pop() || 'App';
    return seg.charAt(0).toUpperCase() + seg.slice(1);
  }, [location.pathname, title]);

  return (
    <div
      className="surface gradient-header"
      role="banner"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        padding: '0.75rem 1rem',
        borderRadius: '12px',
        marginBottom: '1rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '.75rem' }}>
        <div>
          <div style={{ fontWeight: 700 }}>{routeTitle}</div>
          <div className="text-muted" style={{ fontSize: '.9rem' }}>
            Ocean Professional
          </div>
        </div>
        {right ? (
          <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>{right}</div>
        ) : (
          <div style={{ display: 'flex', gap: '.5rem' }}>
            {/* Example default actions (can be overridden via props.right) */}
            <button
              className="shadow-hover"
              style={{
                padding: '.45rem .8rem',
                borderRadius: '10px',
                background: 'var(--color-surface)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              Upgrade
            </button>
            <button
              className="shadow-hover"
              style={{ padding: '.45rem .8rem', borderRadius: '10px', background: 'var(--color-primary)', color: 'white' }}
            >
              Play
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
