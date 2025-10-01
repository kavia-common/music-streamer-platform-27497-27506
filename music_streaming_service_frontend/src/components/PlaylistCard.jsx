import React from 'react';

/**
 * PUBLIC_INTERFACE
 * PlaylistCard
 * Card with artwork, title, description/subtitle, hover elevation and a circular play button.
 *
 * Props:
 * - image?: string
 * - title: string
 * - description?: string
 * - onPlay?: () => void
 */
export default function PlaylistCard({ image, title, description, onPlay }) {
  return (
    <article
      className="shadow-hover"
      style={{ background: 'var(--color-surface)', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}
    >
      <div
        className="card__media"
        style={{
          background: 'var(--media-bg, rgba(17,24,39,0.06))',
          width: '100%',
          aspectRatio: '1 / 1',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        {image ? (
          <img
            src={image}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0' }}
          />
        ) : (
          <div
            aria-hidden="true"
            style={{ width: '60%', height: '60%', borderRadius: '12px', background: 'rgba(37,99,235,0.12)', boxShadow: 'inset 0 0 0 1px rgba(17,24,39,0.08)' }}
          />
        )}
      </div>

      <div className="card__body" style={{ padding: '10px 12px 14px', display: 'grid', gap: '6px' }}>
        <div
          className="card__title"
          title={title}
          style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {title}
        </div>
        {description ? <div className="card__desc">{description}</div> : null}
      </div>

      <button
        type="button"
        onClick={onPlay}
        aria-label={`Play ${title}`}
        className="o-btn o-btn--primary o-btn--sm"
        style={{
          position: 'absolute',
          right: '12px',
          bottom: '62px',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          padding: 0,
          display: 'grid',
          placeItems: 'center',
        }}
      >
        ▶️
      </button>
    </article>
  );
}
