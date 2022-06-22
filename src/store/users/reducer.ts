import produce from 'immer';
import { ActionType, defaultUserInfo } from './types';
import { Actions } from './constants';
import { SubState } from './types';
import { ActionTags } from 'src/baseplate/models';
import { createEntityAdapter } from '@reduxjs/toolkit';

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

export default (
  state = initialState,
  action: ActionTags<ActionType, SubState>
) => {
  return produce(state, draft => {
    const { payLoad } = action;
    switch (action.type) {
      case Actions.SET_SESSION: {
        draft.session = payLoad.session;
        break;
      }
      case Actions.GET_USERS_BY_DID: {
        draft.loading = true;
        draft.loading = true;
        break;
      }
    }
  });
};
