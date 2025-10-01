import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  playlists: [],  // [{ id, name, description, tracks: Track[], createdAt, updatedAt }]
  likedSongs: [], // [Track]
  recent: [],     // [Track] - simple recent list
};

const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    // PUBLIC_INTERFACE
    setPlaylists(state, action) {
      /** Replace all playlists. payload: Playlist[] */
      state.playlists = Array.isArray(action.payload) ? action.payload : [];
    },

    // PUBLIC_INTERFACE
    addPlaylist: {
      /** Add a new playlist. payload: { name, description?, tracks? } */
      reducer(state, action) {
        state.playlists.push(action.payload);
      },
      prepare({ name, description = '', tracks = [] }) {
        return {
          payload: {
            id: nanoid(),
            name,
            description,
            tracks,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        };
      },
    },

    // PUBLIC_INTERFACE
    updatePlaylist(state, action) {
      /** Update an existing playlist by id.
       * payload: { id, changes: object }
       */
      const { id, changes } = action.payload || {};
      const idx = state.playlists.findIndex((p) => p.id === id);
      if (idx !== -1) {
        state.playlists[idx] = {
          ...state.playlists[idx],
          ...changes,
          updatedAt: new Date().toISOString(),
        };
      }
    },

    // PUBLIC_INTERFACE
    removePlaylist(state, action) {
      /** Remove a playlist by id. payload: id */
      const id = action.payload;
      state.playlists = state.playlists.filter((p) => p.id !== id);
    },

    // PUBLIC_INTERFACE
    setLikedSongs(state, action) {
      /** Replace liked songs entirely. payload: Track[] */
      state.likedSongs = Array.isArray(action.payload) ? action.payload : [];
    },

    // PUBLIC_INTERFACE
    toggleLike(state, action) {
      /** Toggle like for a track by id. payload: Track or { id, ... } */
      const track = action.payload;
      if (!track || !track.id) return;
      const exists = state.likedSongs.some((t) => t.id === track.id);
      if (exists) {
        state.likedSongs = state.likedSongs.filter((t) => t.id !== track.id);
      } else {
        state.likedSongs.push(track);
      }
    },

    // Optional helper to add to recents; not in explicit list but useful.
    addRecent(state, action) {
      const track = action.payload;
      if (!track || !track.id) return;
      // Remove if exists and unshift to top
      state.recent = [track, ...state.recent.filter((t) => t.id !== track.id)].slice(0, 50);
    },
  },
});

export const {
  setPlaylists,
  addPlaylist,
  updatePlaylist,
  removePlaylist,
  setLikedSongs,
  toggleLike,
  addRecent,
} = librarySlice.actions;

export default librarySlice.reducer;
