import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Router
 * A top-level router that defines all app routes with code-splitting using React.lazy.
 * Routes:
 *  - /            Home page
 *  - /search      Search page
 *  - /library     Library page
 *  - /playlist/:id Playlist detail page
 *  - /account     Account page
 *
 * Returns a BrowserRouter wrapping Routes. Each route renders a simple placeholder component for now.
 * Uses Suspense fallback to show a lightweight loading state while lazy components resolve.
 */

// Lightweight placeholder components for now; in future, replace with real page files.
// We still use React.lazy to keep the structure consistent for code-splitting later.
const HomePage = lazy(() =>
  Promise.resolve({
    default: () => (
      <div className="card shadow-hover">
        <h1 style={{ marginTop: 0 }}>Home</h1>
        <p className="text-muted">Welcome to the music streaming platform.</p>
      </div>
    ),
  })
);

const SearchPage = lazy(() =>
  Promise.resolve({
    default: () => (
      <div className="card shadow-hover">
        <h1 style={{ marginTop: 0 }}>Search</h1>
        <p className="text-muted">Find your favorite tracks, artists, and albums.</p>
      </div>
    ),
  })
);

const LibraryPage = lazy(() =>
  Promise.resolve({
    default: () => (
      <div className="card shadow-hover">
        <h1 style={{ marginTop: 0 }}>Your Library</h1>
        <p className="text-muted">Songs, albums, and playlists you've saved.</p>
      </div>
    ),
  })
);

const PlaylistPage = lazy(() =>
  Promise.resolve({
    default: () => (
      <div className="card shadow-hover">
        <h1 style={{ marginTop: 0 }}>Playlist</h1>
        <p className="text-muted">Playlist details and tracks will appear here.</p>
      </div>
    ),
  })
);

const AccountPage = lazy(() =>
  Promise.resolve({
    default: () => (
      <div className="card shadow-hover">
        <h1 style={{ marginTop: 0 }}>Account</h1>
        <p className="text-muted">Manage your profile, subscriptions, and settings.</p>
      </div>
    ),
  })
);

// PUBLIC_INTERFACE
export default function Router() {
  /** Renders all routes with Ocean Professional look via CSS utility classes. */
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="surface" style={{ padding: '1rem', borderRadius: '12px' }}>
            Loading...
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/playlist/:id" element={<PlaylistPage />} />
          <Route path="/account" element={<AccountPage />} />
          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
