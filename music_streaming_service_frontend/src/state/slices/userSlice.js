import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  profile: null,              // { id, name, email, avatarUrl, ... }
  subscriptionStatus: 'free', // 'free' | 'trial' | 'premium' | 'canceled'
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // PUBLIC_INTERFACE
    loginSuccess(state, action) {
      /** Set authenticated and store profile details.
       * payload: { profile: object, subscriptionStatus?: string }
       */
      state.isAuthenticated = true;
      state.profile = action.payload?.profile ?? null;
      if (action.payload?.subscriptionStatus) {
        state.subscriptionStatus = action.payload.subscriptionStatus;
      }
    },

    // PUBLIC_INTERFACE
    logout(state) {
      /** Clear user state on logout. */
      state.isAuthenticated = false;
      state.profile = null;
      state.subscriptionStatus = 'free';
    },

    // PUBLIC_INTERFACE
    updateProfile(state, action) {
      /** Merge new profile fields into existing profile. payload: partial profile object */
      const updates = action.payload || {};
      state.profile = { ...(state.profile || {}), ...updates };
    },

    // PUBLIC_INTERFACE
    setSubscription(state, action) {
      /** Set subscription status. payload: 'free' | 'trial' | 'premium' | 'canceled' */
      const status = action.payload;
      if (typeof status === 'string') {
        state.subscriptionStatus = status;
      }
    },
  },
});

export const { loginSuccess, logout, updateProfile, setSubscription } = userSlice.actions;
export default userSlice.reducer;
