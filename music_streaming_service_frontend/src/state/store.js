import { configureStore } from '@reduxjs/toolkit';
import playerReducer from './slices/playerSlice';
import userReducer from './slices/userSlice';
import libraryReducer from './slices/librarySlice';

/**
 * PUBLIC_INTERFACE
 * store
 * The central Redux store configured with Redux Toolkit.
 * Slices:
 *  - player: manages playback state (queue, current track, controls)
 *  - user: manages auth, profile, and subscription status
 *  - library: manages playlists, liked songs, and recent items
 */
const store = configureStore({
  reducer: {
    player: playerReducer,
    user: userReducer,
    library: libraryReducer,
  },
  // Default middleware from RTK is sufficient; enhancers can be added later if needed
});

export default store;
