import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../components/common';
import { addPlaylist } from '../state/slices/librarySlice';
import { setQueue, play } from '../state/slices/playerSlice';
import Header from '../components/Header';
import Section from '../components/Section';
import PlaylistCard from '../components/PlaylistCard';

/**
 * PUBLIC_INTERFACE
 * Home
 * Updated to mirror Figma "Spotify 1" with Ocean Professional theme.
 */
export default function Home() {
  const dispatch = useDispatch();
  const { recent } = useSelector((s) => s.library);
  const { isPlaying } = useSelector((s) => s.player);

  const focusItems = [
    { id: 'f1', title: 'Peaceful Piano', description: 'Relax and indulge with beautiful piano pieces', image: '/assets/figma_image_0_48.png' },
    { id: 'f2', title: 'Deep Focus', description: 'Keep calm and focus with ambient and post-rock music.' },
    { id: 'f3', title: 'Instrumental Study', description: 'Focus with soft study music in the background.' },
    { id: 'f4', title: 'Jazz Vibes', description: 'The original chill instrumental beats playlist.' },
    { id: 'f5', title: 'Focus Flow', description: 'Uptempo instrumental hip hop beats.' },
  ];

  const spotifyPlaylists = [
    { id: 's1', title: "Today's Top Hits", description: 'Ed Sheeran is on top of the Hottest 50!' },
    { id: 's2', title: 'RapCaviar', description: 'New music from Roddy Ricch, Kodak Black, NLE Choppa and BIA.' },
    { id: 's3', title: 'All Out 2010s', description: 'The biggest songs of the 2010s.' },
    { id: 's4', title: 'Rock Classics', description: 'Rock legends & epic songs that continue to inspire generations.' },
    { id: 's5', title: 'Chill Hits', description: 'Kick back to the best new and recent chill hits.' },
  ];

  const sampleTracks = [
    { id: 't1', title: 'Ocean Breeze', artist: 'Blue Horizon', duration: 212 },
    { id: 't2', title: 'Amber Light', artist: 'Sunset Drive', duration: 187 },
    { id: 't3', title: 'Midnight Run', artist: 'City Nights', duration: 241 },
  ];

  const playSample = () => {
    dispatch(setQueue({ queue: sampleTracks, startIndex: 0, autoplay: true }));
    dispatch(play());
  };

  const createSamplePlaylist = () => {
    dispatch(addPlaylist({ name: 'My Fresh Playlist', description: 'Auto-created from Home', tracks: sampleTracks }));
  };

  return (
    <div className="container" style={{ paddingTop: 0 }}>
      <Header
        title="Focus"
        actions={
          <div style={{ display: 'flex', gap: '.5rem' }}>
            <button
              className="shadow-hover"
              style={{ padding: '.45rem .8rem', borderRadius: '10px', background: 'var(--color-surface)', boxShadow: 'var(--shadow-sm)' }}
              onClick={createSamplePlaylist}
              aria-label="Create playlist"
            >
              Create Playlist
            </button>
            <button
              className="shadow-hover"
              style={{ padding: '.45rem .8rem', borderRadius: '10px', background: 'var(--color-primary)', color: '#fff' }}
              onClick={playSample}
              aria-label={isPlaying ? 'Pause' : 'Play something'}
            >
              {isPlaying ? '⏸ Pause' : '▶️ Play'}
            </button>
          </div>
        }
      />

      <Section title="Focus" id="sec-focus" onShowAll={() => { /* TODO routes: /home/focus */ }}>
        <div className="card-grid" role="list">
          {focusItems.map((c) => (
            <div key={c.id} role="listitem">
              <PlaylistCard
                image={c.image}
                title={c.title}
                description={c.description}
                onPlay={playSample}
              />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Spotify Playlists" id="sec-spotify-playlists" onShowAll={() => { /* TODO routes: /playlists */ }}>
        <div className="card-grid" role="list">
          {spotifyPlaylists.map((c) => (
            <div key={c.id} role="listitem">
              <PlaylistCard
                title={c.title}
                description={c.description}
                onPlay={playSample}
              />
            </div>
          ))}
        </div>
      </Section>

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
                    <Button size="sm" variant="ghost" onClick={playSample} ariaLabel={`Play ${t.title} by ${t.artist}`}>▶️</Button>
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
