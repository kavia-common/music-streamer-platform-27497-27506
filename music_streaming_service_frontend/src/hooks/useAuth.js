import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * useAuth
 * Lightweight OAuth placeholder hook with optional mock mode.
 * - Reads REACT_APP_OAUTH_PROVIDER_URL, REACT_APP_OAUTH_CLIENT_ID, REACT_APP_OAUTH_CALLBACK_URL.
 * - Stores token in localStorage under 'auth_token' and user under 'auth_user'.
 * - Handles callback parsing (?token=... or #access_token=...).
 * - Exposes { user, isAuthenticated, login, logout, initializing }.
 *
 * Mock mode:
 * - If required env vars are missing AND REACT_APP_FEATURE_MOCK_API === 'true', we provide a mock user/token.
 * - This enables the app to function during development without a real OAuth server.
 *
 * NOTE: This is a placeholder; replace the authorization URL composition and callback token extraction
 * to match your actual identity provider when integrating for real.
 */
export default function useAuth() {
  const PROVIDER_URL = process.env.REACT_APP_OAUTH_PROVIDER_URL;
  const CLIENT_ID = process.env.REACT_APP_OAUTH_CLIENT_ID;
  const CALLBACK_URL = process.env.REACT_APP_OAUTH_CALLBACK_URL;
  const MOCK_ENABLED = String(process.env.REACT_APP_FEATURE_MOCK_API || '').toLowerCase() === 'true';

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const isAuthenticated = !!token;

  // Persist to localStorage
  useEffect(() => {
    if (token) {
      try {
        localStorage.setItem('auth_token', token);
      } catch (_) {}
    } else {
      try {
        localStorage.removeItem('auth_token');
      } catch (_) {}
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem('auth_user', JSON.stringify(user));
      } catch (_) {}
    } else {
      try {
        localStorage.removeItem('auth_user');
      } catch (_) {}
    }
  }, [user]);

  // Helper: parse token from URL (query or hash)
  const parseTokenFromUrl = () => {
    try {
      const url = new URL(window.location.href);
      const queryToken = url.searchParams.get('token') || url.searchParams.get('access_token');
      if (queryToken) return queryToken;

      if (url.hash && url.hash.startsWith('#')) {
        // #access_token=...&token_type=Bearer
        const hashParams = new URLSearchParams(url.hash.slice(1));
        const hashToken = hashParams.get('access_token') || hashParams.get('token');
        if (hashToken) return hashToken;
      }
    } catch (_) {
      // ignore
    }
    return null;
  };

  // On mount: try to restore from localStorage or read from callback URL
  useEffect(() => {
    const restore = () => {
      // 1) Token from URL (OAuth redirect)
      const callbackToken = parseTokenFromUrl();
      if (callbackToken) {
        setToken(callbackToken);
        // Clear token params from URL for cleanliness
        try {
          const clean = new URL(window.location.href);
          clean.searchParams.delete('token');
          clean.searchParams.delete('access_token');
          window.history.replaceState({}, document.title, clean.toString().split('#')[0]);
        } catch (_) {}
        // In a real app, fetch userinfo with the token here.
        const inferredUser = { id: 'me', name: 'Authenticated User', email: 'me@example.com' };
        setUser(inferredUser);
        setInitializing(false);
        return;
      }

      // 2) Restore from localStorage
      try {
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user');
        if (storedToken) {
          setToken(storedToken);
          setUser(storedUser ? JSON.parse(storedUser) : { id: 'me', name: 'Authenticated User', email: 'me@example.com' });
          setInitializing(false);
          return;
        }
      } catch (_) {
        // ignore
      }

      // 3) Mock mode if envs missing
      const envsPresent = !!(PROVIDER_URL && CLIENT_ID && CALLBACK_URL);
      if (!envsPresent && MOCK_ENABLED) {
        const mockToken = 'mock_dev_token';
        const mockUser = { id: 'u-mock', name: 'Mock User', email: 'mock@example.com' };
        setToken(mockToken);
        setUser(mockUser);
        setInitializing(false);
        return;
      }

      setInitializing(false);
    };

    restore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // PUBLIC_INTERFACE
  const login = useCallback(() => {
    // In mock mode or missing envs, simulate login
    const envsPresent = !!(PROVIDER_URL && CLIENT_ID && CALLBACK_URL);
    if (!envsPresent && MOCK_ENABLED) {
      const mockToken = 'mock_dev_token';
      const mockUser = { id: 'u-mock', name: 'Mock User', email: 'mock@example.com' };
      setToken(mockToken);
      setUser(mockUser);
      return;
    }

    if (!PROVIDER_URL || !CLIENT_ID || !CALLBACK_URL) {
      console.warn('OAuth env vars missing. Set REACT_APP_OAUTH_PROVIDER_URL, REACT_APP_OAUTH_CLIENT_ID, REACT_APP_OAUTH_CALLBACK_URL.');
      return;
    }

    // Compose a generic OAuth 2.0 authorization URL (implicit-like placeholder)
    const authUrl = new URL(PROVIDER_URL);
    authUrl.searchParams.set('response_type', 'token'); // adjust for your provider: 'code' for auth code flow
    authUrl.searchParams.set('client_id', CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', CALLBACK_URL);
    authUrl.searchParams.set('scope', 'openid profile email'); // adjust scopes as needed
    authUrl.searchParams.set('state', Math.random().toString(36).slice(2));

    window.location.assign(authUrl.toString());
  }, [PROVIDER_URL, CLIENT_ID, CALLBACK_URL, MOCK_ENABLED]);

  // PUBLIC_INTERFACE
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    try {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    } catch (_) {}
  }, []);

  return useMemo(
    () => ({
      user,
      isAuthenticated,
      login,
      logout,
      initializing,
      token,
    }),
    [user, isAuthenticated, login, logout, initializing, token]
  );
}
