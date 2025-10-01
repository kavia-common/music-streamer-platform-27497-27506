import React, { Suspense, lazy } from 'react';
import { useRoutes, Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * PUBLIC_INTERFACE
 * Router
 * Defines route elements (without owning BrowserRouter). Use inside a Router provider.
 * Pages are implemented under src/pages with Ocean Professional styling.
 */

const HomePage = lazy(() => import('../pages/Home'));
const SearchPage = lazy(() => import('../pages/Search'));
const LibraryPage = lazy(() => import('../pages/Library'));
const PlaylistPage = lazy(() => import('../pages/PlaylistDetail'));
const AccountPage = lazy(() => import('../pages/Account'));

/**
 * PUBLIC_INTERFACE
 * ProtectedRoute
 * Guards child routes by requiring authentication. Redirects to /account
 * with a friendly message passed via location state.
 */
export function ProtectedRoute({ children }) {
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
  const elements = useRoutes([
    { path: '/', element: <HomePage /> },
    { path: '/search', element: <SearchPage /> },
    {
      path: '/library',
      element: (
        <ProtectedRoute>
          <LibraryPage />
        </ProtectedRoute>
      ),
    },
    {
      path: '/playlist/:id',
      element: (
        <ProtectedRoute>
          <PlaylistPage />
        </ProtectedRoute>
      ),
    },
    { path: '/account', element: <AccountPage /> },
    { path: '*', element: <Navigate to="/" replace /> },
  ]);

  return (
    <Suspense
      fallback={
        <div className="surface" style={{ padding: '1rem', borderRadius: '12px' }}>
          Loading...
        </div>
      }
    >
      {elements}
    </Suspense>
  );
}
