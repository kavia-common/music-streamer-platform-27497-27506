import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Badge } from '../components/common';
import { setQueue, play } from '../state/slices/playerSlice';
import { updatePlaylist } from '../state/slices/librarySlice';

/**
 * PUBLIC_INTERFACE
 * PlaylistDetail
 * Shows tracks of a playlist with actions: play from here, remove (placeholder updates).
 */
export default function PlaylistDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const playlist = useSelector((s) => s.library.playlists.find((p) => p.id === id));

  if (!playlist) {
    return (
      <div className="container">
        <div className="card">
          <p>Playlist not found.</p>
          <Link to="/library" className="o-btn o-btn--secondary o-btn--sm"><span className="o-btn__inner"><span className="o-btn__label">Back to Library</span></span></Link>
        </div>
      </div>
    );
    }

  const playAll = () => {
    if (!playlist.tracks || playlist.tracks.length === 0) return;
    dispatch(setQueue({ queue: playlist.tracks, startIndex: 0, autoplay: true }));
    dispatch(play());
  };

  const playFrom = (idx) => {
    if (!playlist.tracks || playlist.tracks.length === 0) return;
    dispatch(setQueue({ queue: playlist.tracks, startIndex: idx, autoplay: true }));
    dispatch(play());
  };

  const removeTrack = (trackId) => {
    // Placeholder: update playlist by filtering out track (mock local update)
    const updated = {
      ...playlist,
      tracks: (playlist.tracks || []).filter((t) => t.id !== trackId),
    };
    dispatch(updatePlaylist({ id: playlist.id, changes: updated }));
  };

  return (
    <div className="container" style={{ paddingTop: 0 }}>
      <section className="card shadow-hover" aria-labelledby="pl-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div aria-hidden="true" style={{ width: 96, height: 96, borderRadius: 12, background: 'rgba(37,99,235,0.12)' }} />
          <div style={{ minWidth: 0 }}>
            <h2 id="pl-head" style={{ margin: 0 }}>{playlist.name}</h2>
            <div className="text-muted" style={{ marginTop: '.25rem' }}>{playlist.description || '—'}</div>
            <div style={{ marginTop: '.35rem', display: 'flex', gap: '.5rem', alignItems: 'center' }}>
              <Badge variant="neutral">{(playlist.tracks || []).length} tracks</Badge>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '.75rem', display: 'flex', gap: '.5rem' }}>
          <Button onClick={playAll} leftIcon="▶️">Play</Button>
          <Link to="/library" className="o-btn o-btn--ghost"><span className="o-btn__inner"><span className="o-btn__label">Back</span></span></Link>
        </div>
      </section>

      <section className="card" style={{ marginTop: '1rem' }}>
        {(playlist.tracks || []).length === 0 ? (
          <p className="text-muted">This playlist is empty.</p>
        ) : (
          <ol style={{ display: 'grid', gap: '.5rem' }}>
            {(playlist.tracks || []).map((t, idx) => (
              <li key={t.id} className="surface" style={{ padding: '.75rem 1rem', borderRadius: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '.75rem', alignItems: 'center' }}>
                  <div className="text-muted" style={{ width: 24, textAlign: 'right' }}>{idx + 1}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
                    <div className="text-muted" style={{ fontSize: '.9rem' }}>{t.artist}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '.35rem' }}>
                    <Button size="sm" variant="primary" onClick={() => playFrom(idx)} ariaLabel={`Play ${t.title}`}>▶️</Button>
                    <Button size="sm" variant="ghost" onClick={() => removeTrack(t.id)} ariaLabel={`Remove ${t.title}`}>🗑️</Button>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
