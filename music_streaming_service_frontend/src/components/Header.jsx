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
      className="surface gradient-header header-strip"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        marginBottom: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <div className="h2">{title}</div>
          <div className="text-muted subtle">
            Ocean Professional
          </div>
        </div>
        {actions ? <div style={{ display: 'flex', alignItems: 'center' }} className="gap-8">{actions}</div> : null}
      </div>
    </header>
  );
}
