/**
 * Centralized endpoint paths and helper methods.
 * All functions route through the configured axios client (with mock support).
 *
 * PUBLIC_INTERFACE
 * Each exported function includes a brief description and expected params.
 *
 * TODO: When integrating a real backend, verify the paths and shapes below.
 */

import client from './client';

// Base path constants
export const API_PATHS = {
  search: '/search',
  playlists: '/playlists',
  playlist: (id) => `/playlists/${id}`,
  playlistTracks: (id) => `/playlists/${id}/tracks`,
  authExchange: '/auth/exchange',
  me: '/me',
  billingCheckoutSession: '/billing/checkout-session',
};

// PUBLIC_INTERFACE
export async function search(query, type = 'track') {
  /** Search for tracks, artists, or albums.
   * @param query string - search text
   * @param type 'track' | 'artist' | 'album'
   * @returns Promise<{ items: any[], query: string, type: string }>
   */
  const res = await client.get(API_PATHS.search, { params: { q: query, type } });
  return res.data;
}

// Playlists

// PUBLIC_INTERFACE
export async function getPlaylists() {
  /** Fetch all playlists for the current user. */
  const res = await client.get(API_PATHS.playlists);
  return res.data;
}

// PUBLIC_INTERFACE
export async function createPlaylist({ name, description = '' }) {
  /** Create a new playlist.
   * @param name string
   * @param description string
   */
  const res = await client.post(API_PATHS.playlists, { name, description });
  return res.data;
}

// PUBLIC_INTERFACE
export async function updatePlaylist({ id, changes }) {
  /** Update a playlist by id.
   * @param id string
   * @param changes object
   */
  const res = await client.patch(API_PATHS.playlist(id), changes);
  return res.data;
}

// PUBLIC_INTERFACE
export async function deletePlaylist(id) {
  /** Delete a playlist by id. */
  const res = await client.delete(API_PATHS.playlist(id));
  return res.data;
}

// PUBLIC_INTERFACE
export async function getPlaylist(id) {
  /** Get a playlist detail by id. */
  const res = await client.get(API_PATHS.playlist(id));
  return res.data;
}

// PUBLIC_INTERFACE
export async function addTracksToPlaylist(id, tracks) {
  /** Add tracks to a playlist.
   * @param id string
   * @param tracks Array<{ id, title, artist, duration }>
   */
  const res = await client.post(API_PATHS.playlistTracks(id), { tracks });
  return res.data;
}

// PUBLIC_INTERFACE
export async function removeTracksFromPlaylist(id, trackIds) {
  /** Remove tracks from a playlist.
   * @param id string
   * @param trackIds string[]
   */
  const res = await client.delete(API_PATHS.playlistTracks(id), { data: { trackIds } });
  return res.data;
}

// Auth

// PUBLIC_INTERFACE
export async function exchangeCode(code) {
  /** Exchange an OAuth code for a token and user.
   * @param code string
   */
  const res = await client.post(API_PATHS.authExchange, { code });
  return res.data;
}

// PUBLIC_INTERFACE
export async function me() {
  /** Get the current authenticated user's profile. */
  const res = await client.get(API_PATHS.me);
  return res.data;
}

// Billing

const MOCK_STR = String(process.env.REACT_APP_FEATURE_MOCK_API ?? 'true').toLowerCase();
const MOCK_ENABLED = MOCK_STR === 'true' || MOCK_STR === '' || MOCK_STR === '1';

// PUBLIC_INTERFACE
export async function createCheckoutSession(type = 'subscribe') {
  /** Create a Stripe checkout session (server returns sessionId and redirect URL).
   * @param type 'subscribe' | 'manage' (server may use to distinguish flows)
   * @returns Promise<{ id: string } | { sessionId: string }>
   */
  // In mock mode, return a deterministic fake Stripe Checkout Session id
  if (MOCK_ENABLED) {
    return Promise.resolve({ id: 'cs_test_mock_123' });
  }
  const res = await client.post(API_PATHS.billingCheckoutSession, { type });
  // Normalize possible shapes from server or mock router { sessionId } or { id }
  const data = res.data || {};
  const id = data.id || data.sessionId;
  return id ? { id } : data;
}
