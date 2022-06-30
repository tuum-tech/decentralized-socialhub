import {
  createEntityAdapter,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';

export const profileAdapter = createEntityAdapter<{
  did: string;
  followings?: string[];
  followers?: string[];
  profileDTO?: ProfileDTO;
}>({
  // Assume IDs are stored in a field other than `profile.did`
  selectId: profile => profile.did,
  // Keep the "all IDs" array sorted based on did
  sortComparer: (a, b) => a.did.localeCompare(b.did)
});

// The initial state of the App
export const initialState = profileAdapter.getInitialState({
  loading: false,
  error: null
});

export const profileSlice = createSlice({
  name: 'profile',
  initialState: profileAdapter.getInitialState({
    loading: false,
    error: null
  }),
  reducers: {
    getFollowingDids: (state, action: PayloadAction) => {
      state.loading = true;
      state.error = null;
    },
    getFollowingDidsSuccess: (
      state,
      action: PayloadAction<{ did: string; followings: string[] }>
    ) => {
      profileAdapter.upsertOne(state, action.payload);
      state.loading = false;
    },
    getFollowingDidsFailure: (state, action: PayloadAction<{ error: any }>) => {
      state.loading = false;
      state.error = action.payload.error;
    },
    getFollowerDids: (state, action: PayloadAction) => {
      state.loading = true;
      state.error = null;
    },
    getFollowerDidsSuccess: (
      state,
      action: PayloadAction<{ did: string; followers: string[] }>
    ) => {
      profileAdapter.upsertOne(state, action.payload);
      state.loading = false;
    },
    getFollowerDidsFailure: (state, action: PayloadAction<{ error: any }>) => {
      state.loading = false;
      state.error = action.payload.error;
    },
    getFullProfile: (
      state,
      action: PayloadAction<{ did: string; userSession: ISessionItem }>
    ) => {
      state.loading = true;
      state.error = null;
    },
    getFullProfileSuccess: (
      state,
      action: PayloadAction<{ did: string; profileDTO: ProfileDTO }>
    ) => {
      profileAdapter.upsertOne(state, action.payload);
      state.loading = false;
    },
    getFullProfileFailure: (state, action: PayloadAction<{ error: any }>) => {
      state.loading = false;
      state.error = action.payload.error;
    }
  }
});

export default profileSlice.reducer;
