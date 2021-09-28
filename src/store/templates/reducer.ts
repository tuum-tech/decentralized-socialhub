import produce from 'immer';
import { ActionType } from './types';
import { Actions } from './constants';
import { SubState } from './types';
import { ActionTags } from 'src/baseplate/models';

// The initial state of the App
export const initialState = {
  myTemplates: [
    {
      value: 'education',
      title: 'Academic',
      intro: 'For students, teachers, researchers'
    }
  ]
};

export default (
  state = initialState,
  action: ActionTags<ActionType, SubState>
) => {
  return produce(state, draft => {
    const { payLoad } = action;
    switch (action.type) {
      case Actions.SET_MY_TEMPLATES: {
        draft.myTemplates = payLoad.myTemplates;
        break;
      }
    }
  });
};
