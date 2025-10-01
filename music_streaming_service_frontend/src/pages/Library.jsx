import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from '../components/common';
import { addPlaylist, removePlaylist } from '../state/slices/librarySlice';

/**
 * PUBLIC_INTERFACE
 * Library
 * Lists playlists from the Redux library slice and provides basic actions.
 */
export default function Library() {
  const dispatch = useDispatch();
  const playlists = useSelector((s) => s.library.playlists);

  const createDemo = () => {
    const tracks = [
      { id: 'lt1', title: 'Sapphire', artist: 'Blue Line', duration: 201 },
      { id: 'lt2', title: 'Golden Hour', artist: 'Amber Fox', duration: 195 },
    ];
    dispatch(addPlaylist({ name: 'Demo Playlist', description: 'A demo playlist', tracks }));
  };

  const remove = (id) => dispatch(removePlaylist(id));

  return (
    <div className="container" style={{ paddingTop: 0 }}>
      <section className="card shadow-hover" aria-labelledby="lib-title">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 id="lib-title" style={{ margin: 0 }}>Your Library</h2>
          <Button variant="secondary" onClick={createDemo} leftIcon="➕">New Playlist</Button>
        </div>
      </section>

      <section className="card" style={{ marginTop: '1rem' }}>
        {playlists.length === 0 ? (
          <p className="text-muted">No playlists yet. Create your first playlist.</p>
        ) : (
          <div role="list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
            {playlists.map((p) => (
              <article key={p.id} role="listitem" className="surface shadow-hover" style={{ padding: '1rem' }}>
                <div aria-hidden="true" style={{ width: '100%', height: 120, borderRadius: 10, background: 'rgba(37,99,235,0.12)', marginBottom: '.75rem' }} />
                <strong style={{ display: 'block' }}>{p.name}</strong>
                <div className="text-muted" style={{ fontSize: '.9rem', minHeight: '2.6em' }}>
                  {p.description || '—'}
                </div>
                <div style={{ display: 'flex', gap: '.5rem', marginTop: '.5rem' }}>
                  <Link to={`/playlist/${p.id}`} className="o-btn o-btn--primary o-btn--sm">
                    <span className="o-btn__inner"><span className="o-btn__label">Open</span></span>
                  </Link>
                  <Button size="sm" variant="ghost" onClick={() => remove(p.id)} ariaLabel={`Remove ${p.name}`}>🗑️</Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
