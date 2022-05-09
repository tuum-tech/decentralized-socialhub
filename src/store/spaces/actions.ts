import { Actions } from './constants';
import { ActionType } from './types';
import { ActionTags } from 'src/baseplate/models';

export function fetchSpaces<T>(first = false): ActionTags<ActionType, T> {
  return {
    type: Actions.FETCH_SPACES,
    payLoad: {},
    meta: { first }
  };
}

export function fetchSpacesSuccess<T>(payLoad = {}): ActionTags<ActionType, T> {
  return {
    type: Actions.FETCH_SPACES_SUCCESS,
    payLoad
  };
}

export function fetchSpacesFailure<T>(payLoad = {}): ActionTags<ActionType, T> {
  return {
    type: Actions.FETCH_SPACES_FAILURE,
    payLoad
  };
}
