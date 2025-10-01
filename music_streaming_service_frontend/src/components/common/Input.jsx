import React, { useId } from 'react';

/**
 * PUBLIC_INTERFACE
 * Input
 * Accessible text input with label, help/error text, and optional left/right adornments.
 *
 * Props:
 *  - id?: string (auto-generated if omitted)
 *  - label?: string
 *  - type?: string (default 'text')
 *  - placeholder?: string
 *  - value?: string
 *  - onChange?: (e) => void
 *  - error?: string (if present, styles input as invalid and announces via aria-describedby)
 *  - helpText?: string (optional helper description below input)
 *  - leftAdornment?: ReactNode
 *  - rightAdornment?: ReactNode
 *  - disabled?: boolean
 *  - required?: boolean
 *  - className?: string
 *  - inputProps?: object (spread onto the <input>)
 */
export default function Input({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helpText,
  leftAdornment = null,
  rightAdornment = null,
  disabled = false,
  required = false,
  className = '',
  inputProps = {},
  ...rest
}) {
  const autoId = useId();
  const inputId = id || `inp-${autoId}`;

  const helpId = helpText ? `${inputId}-help` : undefined;
  const errId = error ? `${inputId}-error` : undefined;
  const describedBy = [helpId, errId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={['o-field', className].filter(Boolean).join(' ')} {...rest}>
      {label ? (
        <label htmlFor={inputId} className="o-field__label">
          {label} {required ? <span className="o-field__required" aria-hidden="true">*</span> : null}
        </label>
      ) : null}

      <div className={['o-input', error ? 'is-invalid' : ''].filter(Boolean).join(' ')}>
        {leftAdornment ? (
          <span className="o-input__adornment o-input__adornment--left" aria-hidden="true">
            {leftAdornment}
          </span>
        ) : null}
        <input
          id={inputId}
          className="o-input__control"
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          aria-invalid={!!error || undefined}
          aria-describedby={describedBy}
          disabled={disabled}
          required={required}
          {...inputProps}
        />
        {rightAdornment ? (
          <span className="o-input__adornment o-input__adornment--right" aria-hidden="true">
            {rightAdornment}
          </span>
        ) : null}
      </div>

      {helpText ? (
        <div id={helpId} className="o-field__help text-muted">
          {helpText}
        </div>
      ) : null}

      {error ? (
        <div id={errId} className="o-field__error" role="alert">
          {error}
        </div>
      ) : null}
    </div>
  );
}
