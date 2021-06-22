import { Actions } from './constants';
import { ActionType } from './types';
import { ActionTags } from 'src/baseplate/models';

export function getSession<T>(payLoad = {}): ActionTags<ActionType, T> {
  return {
    type: Actions.GET_SESSION,
    payLoad
  };
}

export function setSession<T>(payLoad: T): ActionTags<ActionType, T> {
  return {
    type: Actions.SET_SESSION,
    payLoad
  };
}
