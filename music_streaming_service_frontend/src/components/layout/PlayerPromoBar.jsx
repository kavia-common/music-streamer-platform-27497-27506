import React from 'react';

/**
 * PUBLIC_INTERFACE
 * PlayerPromoBar
 * Bottom docked promo-like bar matching Figma: "Preview of Spotify" with CTA.
 * Visual only; no functionality wired.
 */
export default function PlayerPromoBar() {
  return (
    <div role="region" aria-label="Promo" className="surface" style={{ position: 'sticky', bottom: 0, zIndex: 5 }}>
      <div
        className="promo__inner container"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}
      >
        <div className="promo__text">
          <div className="promo__title" style={{ fontWeight: 700 }}>Preview of Spotify</div>
          <div className="promo__sub text-muted subtle">Sign up to get unlimited songs and podcasts with occasional ads. No credit card needed.</div>
        </div>
        <button className="o-btn o-btn--primary o-btn--md" aria-label="Sign up free">
          <span className="o-btn__inner"><span className="o-btn__label">Sign up free</span></span>
        </button>
      </div>
    </div>
  );
}
