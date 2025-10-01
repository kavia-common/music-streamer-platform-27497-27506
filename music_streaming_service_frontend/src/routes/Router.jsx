import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

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

/**
 * ProtectedRoute
 * Guards child routes by requiring authentication. Redirects to /account
 * with a friendly message passed via location state.
 */
function ProtectedRoute({ children }) {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return (
      <div className="surface" style={{ padding: '1rem', borderRadius: '12px' }}>
        Checking authentication...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/account"
        replace
        state={{
          from: location.pathname,
          message: 'Please sign in to access this page.',
        }}
      />
    );
  }

  return children;
}

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
          <Route
            path="/library"
            element={
              <ProtectedRoute>
                <LibraryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/playlist/:id"
            element={
              <ProtectedRoute>
                <PlaylistPage />
              </ProtectedRoute>
            }
          />
          <Route path="/account" element={<AccountPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
