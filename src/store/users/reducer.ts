import produce from 'immer';
import { ActionType, defaultUserInfo } from './types';
import { Actions } from './constants';
import { SubState } from './types';
import { ActionTags } from 'src/baseplate/models';

// The initial state of the App
export const initialState = {
  users: [],
  session: defaultUserInfo
};

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
    }
  });
};
