import React from 'react';
import { useDispatch } from 'react-redux';
import { Input, Button, Badge } from '../components/common';
import { setQueue, play } from '../state/slices/playerSlice';

/**
 * Mock search API stub returning promise with results after delay.
 */
function mockSearchApi(query) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const base = [
        { id: 's1', title: 'Blue Waves', artist: 'Oceanic', duration: 200 },
        { id: 's2', title: 'Amber Skies', artist: 'Dawn Patrol', duration: 178 },
        { id: 's3', title: 'Deep Focus', artist: 'Nocturne', duration: 244 },
        { id: 's4', title: 'Edge Runner', artist: 'Neon City', duration: 215 },
      ];
      const filtered = base.filter(
        (t) => t.title.toLowerCase().includes(query.toLowerCase()) || t.artist.toLowerCase().includes(query.toLowerCase())
      );
      resolve(filtered);
    }, 350);
  });
}

/**
 * PUBLIC_INTERFACE
 * Search
 * Debounced search input that calls mock API and renders results list with actions.
 */
export default function Search() {
  const dispatch = useDispatch();
  const [q, setQ] = React.useState('');
  const [debounced, setDebounced] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState([]);
  const [error, setError] = React.useState('');

  // Debounce q -> debounced
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(q.trim()), 350);
    return () => clearTimeout(id);
  }, [q]);

  // Call mock API
  React.useEffect(() => {
    if (!debounced) {
      setResults([]);
      setError('');
      return;
    }
    let active = true;
    setLoading(true);
    setError('');
    mockSearchApi(debounced)
      .then((r) => {
        if (!active) return;
        setResults(r);
      })
      .catch(() => {
        if (!active) return;
        setError('Something went wrong. Please try again.');
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [debounced]);

  const playAll = () => {
    if (results.length === 0) return;
    dispatch(setQueue({ queue: results, startIndex: 0, autoplay: true }));
    dispatch(play());
  };

  const playFrom = (idx) => {
    if (results.length === 0) return;
    dispatch(setQueue({ queue: results, startIndex: idx, autoplay: true }));
    dispatch(play());
  };

  return (
    <div className="container" style={{ paddingTop: 0 }}>
      <section className="card" aria-labelledby="search-label">
        <h2 id="search-label" style={{ marginTop: 0 }}>Search</h2>
        <Input
          label="Search tracks, artists, albums"
          placeholder="Try 'Ocean' or 'Amber'"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          helpText="Results update automatically"
          rightAdornment={loading ? <span aria-hidden="true" className="text-muted">⏳</span> : <span aria-hidden="true">🔎</span>}
          style={{ '--_right-pad': '18px' }}
        />
        <div style={{ marginTop: '.5rem', display: 'flex', gap: '.5rem', alignItems: 'center' }}>
          <Badge variant="neutral">Query: {debounced || '—'}</Badge>
          <Button size="sm" variant="secondary" disabled={results.length === 0} onClick={playAll} leftIcon="▶️">
            Play All
          </Button>
        </div>
      </section>

      <section className="card shadow-hover" style={{ marginTop: '1rem' }} aria-live="polite">
        {error ? (
          <div role="alert" className="o-field__error">{error}</div>
        ) : results.length === 0 && debounced ? (
          <p className="text-muted">No results found.</p>
        ) : results.length === 0 ? (
          <p className="text-muted">Start typing to search for music.</p>
        ) : (
          <ul style={{ display: 'grid', gap: '.5rem' }}>
            {results.map((t, idx) => (
              <li key={t.id} className="surface" style={{ padding: '.75rem 1rem', borderRadius: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: '.5rem' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.title}</div>
                    <div className="text-muted" style={{ fontSize: '.9rem' }}>{t.artist}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '.35rem' }}>
                    <Button size="sm" variant="primary" onClick={() => playFrom(idx)} leftIcon="▶️">Play</Button>
                    <Button size="sm" variant="ghost" ariaLabel="More actions">⋯</Button>
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
