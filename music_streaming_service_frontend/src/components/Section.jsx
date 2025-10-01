import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Section
 * Titled section wrapper with optional "Show all" action and content area for grids/lists.
 *
 * Props:
 * - id?: string
 * - title: string
 * - onShowAll?: () => void
 * - children: ReactNode
 */
export default function Section({ id, title, onShowAll, children }) {
  return (
    <section className="section" aria-labelledby={id}>
      <div className="section__head">
        <h2 id={id} className="section__title h2">
          {title}
        </h2>
        {onShowAll ? (
          <button className="link muted" onClick={onShowAll} aria-label={`Show all for ${title}`}>
            Show all
          </button>
        ) : null}
      </div>
      {children}
    </section>
  );
}
