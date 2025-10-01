import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  queue: [],               // Array of tracks { id, title, artist, duration, ... }
  currentIndex: -1,        // Index within the queue; -1 means nothing selected
  currentTrack: null,      // Convenience pointer to the current track
  isPlaying: false,        // Playback state
  position: 0,             // In seconds or milliseconds (frontend-level seconds here)
  volume: 0.8,             // 0.0 - 1.0
  shuffle: false,          // Shuffle mode
  repeat: 'off',           // 'off' | 'one' | 'all'
};

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    // PUBLIC_INTERFACE
    setQueue(state, action) {
      /** Set the entire play queue and optionally start at a given index.
       * payload: { queue: Track[], startIndex?: number, autoplay?: boolean }
       */
      const { queue, startIndex = 0, autoplay = false } = action.payload || {};
      state.queue = Array.isArray(queue) ? queue : [];
      state.currentIndex = state.queue.length > 0 ? clamp(startIndex, 0, state.queue.length - 1) : -1;
      state.currentTrack = state.currentIndex >= 0 ? state.queue[state.currentIndex] : null;
      state.isPlaying = autoplay && state.currentTrack != null;
      state.position = 0;
    },

    // PUBLIC_INTERFACE
    play(state) {
      /** Start or resume playback. */
      if (state.currentTrack) {
        state.isPlaying = true;
      } else if (state.queue.length > 0) {
        state.currentIndex = state.currentIndex >= 0 ? state.currentIndex : 0;
        state.currentTrack = state.queue[state.currentIndex];
        state.isPlaying = true;
      }
    },

    // PUBLIC_INTERFACE
    pause(state) {
      /** Pause playback. */
      state.isPlaying = false;
    },

    // PUBLIC_INTERFACE
    next(state) {
      /** Skip to next track honoring repeat/shuffle. */
      if (state.queue.length === 0) return;

      if (state.shuffle) {
        const nextIndex = Math.floor(Math.random() * state.queue.length);
        state.currentIndex = nextIndex;
      } else {
        if (state.currentIndex < state.queue.length - 1) {
          state.currentIndex += 1;
        } else {
          if (state.repeat === 'all') {
            state.currentIndex = 0;
          } else {
            // At end without repeat
            state.isPlaying = false;
            state.position = 0;
            return;
          }
        }
      }

      state.currentTrack = state.queue[state.currentIndex];
      state.position = 0;
      state.isPlaying = true;
    },

    // PUBLIC_INTERFACE
    prev(state) {
      /** Go to previous track or restart current based on position. */
      if (state.queue.length === 0) return;

      if (state.position > 3) {
        // If position > 3 seconds, restart current
        state.position = 0;
        return;
      }

      if (state.shuffle) {
        const prevIndex = Math.floor(Math.random() * state.queue.length);
        state.currentIndex = prevIndex;
      } else {
        if (state.currentIndex > 0) {
          state.currentIndex -= 1;
        } else {
          if (state.repeat === 'all') {
            state.currentIndex = state.queue.length - 1;
          } else {
            // At beginning without repeat
            state.position = 0;
            return;
          }
        }
      }

      state.currentTrack = state.queue[state.currentIndex];
      state.position = 0;
      state.isPlaying = true;
    },

    // PUBLIC_INTERFACE
    seek(state, action) {
      /** Seek to a specific playback position (in seconds). payload: number */
      const newPos = typeof action.payload === 'number' ? action.payload : 0;
      state.position = Math.max(0, newPos);
    },

    // PUBLIC_INTERFACE
    setVolume(state, action) {
      /** Set player volume 0.0 - 1.0. payload: number */
      const v = typeof action.payload === 'number' ? action.payload : 1;
      state.volume = clamp(v, 0, 1);
    },

    // PUBLIC_INTERFACE
    toggleShuffle(state) {
      /** Toggle shuffle mode. */
      state.shuffle = !state.shuffle;
    },

    // PUBLIC_INTERFACE
    toggleRepeat(state) {
      /** Toggle repeat mode among: off -> all -> one -> off */
      const order = ['off', 'all', 'one'];
      const currentIdx = order.indexOf(state.repeat);
      state.repeat = order[(currentIdx + 1) % order.length];
    },
  },
});

export const {
  setQueue,
  play,
  pause,
  next,
  prev,
  seek,
  setVolume,
  toggleShuffle,
  toggleRepeat,
} = playerSlice.actions;

export default playerSlice.reducer;
