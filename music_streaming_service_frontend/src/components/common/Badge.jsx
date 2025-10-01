import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Badge
 * Small label/pill with variant-based colors and optional icon.
 *
 * Props:
 *  - variant: 'info' | 'success' | 'warning' | 'error' | 'neutral' (default: 'neutral')
 *  - children?: ReactNode
 *  - icon?: ReactNode
 *  - className?: string
 *  - title?: string
 */
export default function Badge({ variant = 'neutral', children, icon = null, className = '', title, ...rest }) {
  const classes = ['o-badge', `o-badge--${variant}`, className].filter(Boolean).join(' ');
  return (
    <span className={classes} title={title} {...rest}>
      {icon ? <span className="o-badge__icon" aria-hidden="true">{icon}</span> : null}
      <span className="o-badge__label">{children}</span>
    </span>
  );
}
