import { defaultUserInfo } from './types';
import {
  createEntityAdapter,
  createSlice,
  PayloadAction
} from '@reduxjs/toolkit';

export const usersAdapter = createEntityAdapter<ISessionItem>({
  // Assume IDs are stored in a field other than `user.did`
  selectId: user => user.did,
  // Keep the "all IDs" array sorted based on did
  sortComparer: (a, b) => a.did.localeCompare(b.did)
});

// The initial state of the App
export const initialState = usersAdapter.getInitialState({
  session: defaultUserInfo,
  loading: false,
  error: null
});

export const usersSlice = createSlice({
  name: 'users',
  initialState: usersAdapter.getInitialState({
    session: defaultUserInfo,
    loading: false,
    error: null
  }),
  reducers: {
    setSession: (state, action: PayloadAction<{ session: ISessionItem }>) => {
      state.session = action.payload.session;
    },
    getUsersByDid: (
      state,
      action: PayloadAction<{ dids: string[]; limit: number; offset: number }>
    ) => {
      state.loading = true;
      state.error = null;
    },
    getUsersByDidSuccess: (
      state,
      action: PayloadAction<{ users: Array<ISessionItem> }>
    ) => {
      usersAdapter.upsertMany(state, action.payload.users);
    },
    getUsersByDidFailure: (state, action: PayloadAction<{ error: any }>) => {
      state.loading = false;
      state.error = action.payload.error;
    },
    setUsers(state, action) {
      usersAdapter.setAll(state, action.payload.users);
    }
  }
});

export default usersSlice.reducer;
