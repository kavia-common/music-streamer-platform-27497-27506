import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

/**
 * PUBLIC_INTERFACE
 * Router
 * Defines all app routes with code-splitting using React.lazy.
 * Pages are implemented under src/pages with Ocean Professional styling.
 */

const HomePage = lazy(() => import('../pages/Home'));
const SearchPage = lazy(() => import('../pages/Search'));
const LibraryPage = lazy(() => import('../pages/Library'));
const PlaylistPage = lazy(() => import('../pages/PlaylistDetail'));
const AccountPage = lazy(() => import('../pages/Account'));

// PUBLIC_INTERFACE
export default function Router() {
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
