import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Button
 * Reusable button with Ocean Professional styles, variants, sizes, loading state, and icon support.
 *
 * Props:
 *  - variant: 'primary' | 'secondary' | 'ghost' (default: 'primary')
 *  - size: 'sm' | 'md' | 'lg' (default: 'md')
 *  - fullWidth?: boolean
 *  - loading?: boolean
 *  - disabled?: boolean
 *  - leftIcon?: ReactNode
 *  - rightIcon?: ReactNode
 *  - type?: 'button' | 'submit' | 'reset'
 *  - onClick?: (e) => void
 *  - children?: ReactNode
 *  - className?: string (additional classes)
 *  - ariaLabel?: string (optional explicit aria-label)
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  type = 'button',
  onClick,
  children,
  className = '',
  ariaLabel,
  ...rest
}) {
  const isDisabled = disabled || loading;
  const classes = [
    'o-btn',
    `o-btn--${variant}`,
    `o-btn--${size}`,
    fullWidth ? 'o-btn--block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // If no textual children and icons exist, ensure accessible name via aria-label
  const computedAriaLabel = ariaLabel || (typeof children === 'string' ? undefined : (rest['aria-label'] || rest['ariaLabel']));

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      aria-label={computedAriaLabel}
      {...rest}
    >
      {/* Content layout */}
      <span className="o-btn__inner">
        {leftIcon ? <span className="o-btn__icon o-btn__icon--left" aria-hidden="true">{leftIcon}</span> : null}
        <span className="o-btn__label">{children}</span>
        {rightIcon ? <span className="o-btn__icon o-btn__icon--right" aria-hidden="true">{rightIcon}</span> : null}
      </span>

      {loading ? (
        <span className="o-btn__spinner" aria-hidden="true">
          <span className="o-spinner" />
        </span>
      ) : null}
    </button>
  );
}
