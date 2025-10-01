import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Header
 * Gradient strip header with page title and optional actions on the right.
 *
 * Props:
 * - title: string
 * - actions?: ReactNode
 */
export default function Header({ title, actions = null }) {
  return (
    <header
      className="surface gradient-header"
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
          <div style={{ fontWeight: 700 }}>{title}</div>
          <div className="text-muted" style={{ fontSize: '.9rem' }}>
            Ocean Professional
          </div>
        </div>
        {actions ? <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>{actions}</div> : null}
      </div>
    </header>
  );
}
