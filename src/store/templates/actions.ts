import { Actions } from './constants';
import { ActionType } from './types';
import { ActionTags } from 'src/baseplate/models';

export function getMyTemplates<T>(payLoad = {}): ActionTags<ActionType, T> {
  return {
    type: Actions.GET_MY_TEMPLATES,
    payLoad
  };
}

export function setMyTemplates<T>(payLoad: T): ActionTags<ActionType, T> {
  return {
    type: Actions.SET_MY_TEMPLATES,
    payLoad
  };
}
