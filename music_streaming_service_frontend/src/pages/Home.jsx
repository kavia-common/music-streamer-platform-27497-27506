import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Badge } from '../components/common';
import { addPlaylist } from '../state/slices/librarySlice';
import { setQueue, play } from '../state/slices/playerSlice';

/**
 * PUBLIC_INTERFACE
 * Home
 * Landing page showcasing quick actions, recently played, and featured content.
 * Uses mock data and connects to Redux for basic interactions.
 */
export default function Home() {
  const dispatch = useDispatch();
  const { recent } = useSelector((s) => s.library);
  const { isPlaying } = useSelector((s) => s.player);

  const featuredPlaylists = [
    { id: 'f1', name: 'Focus Flow', description: 'Stay productive with deep focus beats.' },
    { id: 'f2', name: 'Chill Vibes', description: 'Laid-back grooves to unwind.' },
    { id: 'f3', name: 'Top Hits', description: 'The most popular tracks right now.' },
  ];

  const sampleTracks = [
    { id: 't1', title: 'Ocean Breeze', artist: 'Blue Horizon', duration: 212 },
    { id: 't2', title: 'Amber Light', artist: 'Sunset Drive', duration: 187 },
    { id: 't3', title: 'Midnight Run', artist: 'City Nights', duration: 241 },
  ];

  const quickStart = () => {
    dispatch(setQueue({ queue: sampleTracks, startIndex: 0, autoplay: true }));
    dispatch(play());
  };

  const createSamplePlaylist = () => {
    dispatch(addPlaylist({ name: 'My Fresh Playlist', description: 'Auto-created from Home', tracks: sampleTracks }));
  };

  return (
    <div className="container" style={{ paddingTop: 0 }}>
      <section className="card shadow-hover" aria-labelledby="home-quick">
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.5rem' }}>
          <h2 id="home-quick" style={{ margin: 0 }}>Welcome back</h2>
          <Badge variant="info" title="Ocean Professional theme">Ocean</Badge>
        </header>
        <p className="text-muted" style={{ marginTop: 0 }}>
          Dive into music with a single click.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
          <Button onClick={quickStart} leftIcon="▶️">
            {isPlaying ? 'Keep Playing' : 'Play Something'}
          </Button>
          <Button variant="secondary" onClick={createSamplePlaylist} leftIcon="➕">
            New Playlist
          </Button>
          <Button variant="ghost" as="a" href="/search" leftIcon="🔎" ariaLabel="Go to search">
            Search Music
          </Button>
        </div>
      </section>

      <section className="card shadow-hover" aria-labelledby="featured" style={{ marginTop: '1rem' }}>
        <h3 id="featured" style={{ marginTop: 0 }}>Featured</h3>
        <div
          role="list"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}
        >
          {featuredPlaylists.map((p) => (
            <article role="listitem" key={p.id} className="surface shadow-hover" style={{ padding: '1rem' }}>
              <div
                aria-hidden="true"
                style={{ width: '100%', height: 120, borderRadius: 10, background: 'rgba(37,99,235,0.12)', marginBottom: '.75rem' }}
              />
              <strong>{p.name}</strong>
              <p className="text-muted" style={{ marginTop: '.25rem' }}>{p.description}</p>
              <div>
                <Button size="sm" variant="secondary" leftIcon="▶️" onClick={() => quickStart()}>
                  Play
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card shadow-hover" aria-labelledby="recent" style={{ marginTop: '1rem' }}>
        <h3 id="recent" style={{ marginTop: 0 }}>Recently Played</h3>
        {recent.length === 0 ? (
          <p className="text-muted">No recent tracks yet. Start listening!</p>
        ) : (
          <ul style={{ display: 'grid', gap: '.5rem' }}>
            {recent.map((t) => (
              <li key={t.id} className="surface" style={{ padding: '.75rem 1rem', borderRadius: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '.5rem' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
                    <div className="text-muted" style={{ fontSize: '.9rem' }}>{t.artist}</div>
                  </div>
                  <div>
                    <Button size="sm" variant="ghost" onClick={() => quickStart()} ariaLabel={`Play ${t.title} by ${t.artist}`}>▶️</Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
