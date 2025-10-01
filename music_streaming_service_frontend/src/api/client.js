import axios from 'axios';

/**
 * Axios API client with mock mode support.
 *
 * Configuration:
 * - Base URL: process.env.REACT_APP_API_BASE_URL
 * - Mock mode: enabled when REACT_APP_FEATURE_MOCK_API is 'true' OR missing
 * - Authorization: attaches Bearer token from localStorage 'auth_token'
 *
 * In mock mode, outbound requests are intercepted and served from local
 * handlers without performing a network call. This prevents network errors.
 *
 * TODO: Replace mock handlers with real backend endpoints when integrating.
 */

// Resolve base URL from env; default to '' (same origin) if provided empty.
const BASE_URL = process.env.REACT_APP_API_BASE_URL || '';
const MOCK_ENV = String(process.env.REACT_APP_FEATURE_MOCK_API || 'true').toLowerCase();
const MOCK_ENABLED = MOCK_ENV === 'true' || MOCK_ENV === '' || MOCK_ENV === '1';

// Create axios instance
const client = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// Request interceptor: attach Authorization header if token exists
client.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers = config.headers || {};
        // Do not override existing Authorization if explicitly set by caller
        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (_) {
      // ignore storage errors
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper: small delay to simulate network latency in mock mode
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// Mock datastore (in-memory)
const mockDB = {
  user: { id: 'u-mock', name: 'Mock User', email: 'mock@example.com' },
  playlists: [
    {
      id: 'pl-1',
      name: 'Focus Flow',
      description: 'Stay productive with deep focus beats.',
      tracks: [
        { id: 't1', title: 'Ocean Breeze', artist: 'Blue Horizon', duration: 212 },
        { id: 't2', title: 'Amber Light', artist: 'Sunset Drive', duration: 187 },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'pl-2',
      name: 'Chill Vibes',
      description: 'Laid-back grooves to unwind.',
      tracks: [
        { id: 't3', title: 'Midnight Run', artist: 'City Nights', duration: 241 },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
};

// Generate a random id-like string
function rid(prefix = 'id') {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

// Very small search corpus
const mockTracks = [
  { id: 's1', title: 'Blue Waves', artist: 'Oceanic', duration: 200 },
  { id: 's2', title: 'Amber Skies', artist: 'Dawn Patrol', duration: 178 },
  { id: 's3', title: 'Deep Focus', artist: 'Nocturne', duration: 244 },
  { id: 's4', title: 'Edge Runner', artist: 'Neon City', duration: 215 },
  { id: 's5', title: 'Ocean Breeze', artist: 'Blue Horizon', duration: 212 },
];

// Mock router: returns a minimal AxiosResponse-like object
async function mockRouter(config) {
  // Normalize path without baseURL
  const url = new URL(config.url, 'http://mock.base'); // base for parsing
  const path = url.pathname;
  const method = (config.method || 'get').toLowerCase();

  // Simulate latency
  await delay(200);

  // Search: GET /search?q=...&type=track|artist|album (type is ignored in mock)
  if (method === 'get' && path === '/search') {
    const q = url.searchParams.get('q') || '';
    const type = url.searchParams.get('type') || 'track';
    const filtered = mockTracks.filter(
      (t) =>
        t.title.toLowerCase().includes(q.toLowerCase()) ||
        t.artist.toLowerCase().includes(q.toLowerCase())
    );
    return {
      data: { items: filtered, query: q, type },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };
  }

  // Auth: POST /auth/exchange { code } -> returns token and user
  if (method === 'post' && path === '/auth/exchange') {
    const code = (config.data && JSON.parse(config.data).code) || '';
    const token = `mock_token_${code || 'dev'}`;
    // In real integration, you would validate code server-side
    return {
      data: { token, user: mockDB.user },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };
  }

  // Auth: GET /me -> returns current user derived from token
  if (method === 'get' && path === '/me') {
    // validate header presence in a very loose way
    return {
      data: mockDB.user,
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };
  }

  // Playlists: GET /playlists
  if (method === 'get' && path === '/playlists') {
    return {
      data: { items: mockDB.playlists },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };
  }

  // Playlists: POST /playlists { name, description }
  if (method === 'post' && path === '/playlists') {
    const body = (config.data && JSON.parse(config.data)) || {};
    const newPl = {
      id: rid('pl'),
      name: body.name || 'Untitled Playlist',
      description: body.description || '',
      tracks: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockDB.playlists.push(newPl);
    return {
      data: newPl,
      status: 201,
      statusText: 'Created',
      headers: {},
      config,
    };
  }

  // Playlist detail: GET /playlists/:id
  const plDetailMatch = path.match(/^\/playlists\/([^/]+)$/);
  if (method === 'get' && plDetailMatch) {
    const id = plDetailMatch[1];
    const pl = mockDB.playlists.find((p) => p.id === id);
    if (!pl) {
      return { data: { message: 'Not found' }, status: 404, statusText: 'Not Found', headers: {}, config };
    }
    return { data: pl, status: 200, statusText: 'OK', headers: {}, config };
  }

  // Playlist update: PATCH /playlists/:id
  if (method === 'patch' && plDetailMatch) {
    const id = plDetailMatch[1];
    const body = (config.data && JSON.parse(config.data)) || {};
    const idx = mockDB.playlists.findIndex((p) => p.id === id);
    if (idx === -1) {
      return { data: { message: 'Not found' }, status: 404, statusText: 'Not Found', headers: {}, config };
    }
    mockDB.playlists[idx] = { ...mockDB.playlists[idx], ...body, updatedAt: new Date().toISOString() };
    return { data: mockDB.playlists[idx], status: 200, statusText: 'OK', headers: {}, config };
  }

  // Playlist delete: DELETE /playlists/:id
  if (method === 'delete' && plDetailMatch) {
    const id = plDetailMatch[1];
    const before = mockDB.playlists.length;
    mockDB.playlists = mockDB.playlists.filter((p) => p.id !== id);
    const deleted = mockDB.playlists.length < before;
    return {
      data: { deleted },
      status: deleted ? 200 : 404,
      statusText: deleted ? 'OK' : 'Not Found',
      headers: {},
      config,
    };
  }

  // Tracks management: POST /playlists/:id/tracks { tracks: [...] }
  const plTracksMatch = path.match(/^\/playlists\/([^/]+)\/tracks$/);
  if (plTracksMatch && method === 'post') {
    const id = plTracksMatch[1];
    const body = (config.data && JSON.parse(config.data)) || {};
    const add = Array.isArray(body.tracks) ? body.tracks : [];
    const pl = mockDB.playlists.find((p) => p.id === id);
    if (!pl) {
      return { data: { message: 'Not found' }, status: 404, statusText: 'Not Found', headers: {}, config };
    }
    const existingIds = new Set(pl.tracks.map((t) => t.id));
    const toAdd = add.filter((t) => t && t.id && !existingIds.has(t.id));
    pl.tracks = [...pl.tracks, ...toAdd];
    pl.updatedAt = new Date().toISOString();
    return { data: pl, status: 200, statusText: 'OK', headers: {}, config };
  }

  // Tracks removal: DELETE /playlists/:id/tracks with body { trackIds: [...] }
  if (plTracksMatch && method === 'delete') {
    const id = plTracksMatch[1];
    const body = (config.data && JSON.parse(config.data)) || {};
    const ids = new Set(Array.isArray(body.trackIds) ? body.trackIds : []);
    const pl = mockDB.playlists.find((p) => p.id === id);
    if (!pl) {
      return { data: { message: 'Not found' }, status: 404, statusText: 'Not Found', headers: {}, config };
    }
    pl.tracks = pl.tracks.filter((t) => !ids.has(t.id));
    pl.updatedAt = new Date().toISOString();
    return { data: pl, status: 200, statusText: 'OK', headers: {}, config };
  }

  // Billing: POST /billing/checkout-session
  if (method === 'post' && path === '/billing/checkout-session') {
    const sessionId = rid('cs');
    return {
      data: { sessionId, checkoutUrl: `https://checkout.stripe.com/pay/${sessionId}` },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    };
  }

  // Fallback for unhandled paths in mock mode
  return {
    data: { message: 'Mock route not implemented', path, method },
    status: 501,
    statusText: 'Not Implemented',
    headers: {},
    config,
  };
}

// Response interceptor: in mock mode, short-circuit actual network calls
if (MOCK_ENABLED) {
  // We hook into the request phase by using an adapter wrapper.
  // Axios allows custom adapters; we wrap the default one and decide per request.
  const realAdapter = client.defaults.adapter;

  client.defaults.adapter = async (config) => {
    try {
      // Only mock if request path looks like API (no absolute external URL different from our base)
      // For simplicity in this app, we mock everything routed via our endpoints helpers.
      return await mockRouter(config);
    } catch (err) {
      // Never throw network error in mock mode; return a safe error-like response
      return Promise.resolve({
        data: { message: 'Mock adapter error', error: String(err && err.message ? err.message : err) },
        status: 500,
        statusText: 'Internal Server Error',
        headers: {},
        config,
      });
    } finally {
      void realAdapter; // keep reference from being tree-shaken; not used in mock mode
    }
  };
}

export default client;
