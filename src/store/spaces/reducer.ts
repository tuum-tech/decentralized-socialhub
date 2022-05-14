import produce from 'immer';
import { ActionType } from './types';
import { Actions } from './constants';
import { SubState } from './types';
import { ActionTags } from 'src/baseplate/models';

// The initial state of the App
export const initialState: SubState = {
  loading: false,
  spaces: [],
  error: null
};

export default (
  state = initialState,
  action: ActionTags<ActionType, SubState>
) => {
  return produce(state, draft => {
    const { payLoad, meta } = action;
    switch (action.type) {
      case Actions.FETCH_SPACES: {
        draft.loading = meta?.first || false;
        draft.spaces = meta?.first ? [] : state.spaces;
        draft.error = null;
        break;
      }
      case Actions.FETCH_SPACES_SUCCESS: {
        draft.spaces = payLoad.spaces;
        draft.loading = false;
        break;
      }
      case Actions.FETCH_SPACES_FAILURE: {
        draft.spaces = [];
        draft.error = payLoad.error;
        draft.loading = false;
        break;
      }
    }
  });
};
