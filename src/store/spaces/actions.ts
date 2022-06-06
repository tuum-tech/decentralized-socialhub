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

export function updateSpace(
  space: Space,
  notify: boolean = true
): ActionTags<ActionType, { space: Space; notify: boolean }> {
  return {
    type: Actions.UPDATE_SPACE,
    payLoad: { space, notify }
  };
}

export function updateSpaceSuccess<T>(payLoad = {}): ActionTags<ActionType, T> {
  return {
    type: Actions.UPDATE_SPACE_SUCCESS,
    payLoad
  };
}

export function updateSpaceFailure<T>(payLoad = {}): ActionTags<ActionType, T> {
  return {
    type: Actions.UPDATE_SPACE_FAILURE,
    payLoad
  };
}

export function removeSpace(
  space: Space
): ActionTags<ActionType, { space: Space }> {
  return {
    type: Actions.REMOVE_SPACE,
    payLoad: { space }
  };
}

export function removeSpaceSuccess<T>(payLoad = {}): ActionTags<ActionType, T> {
  return {
    type: Actions.REMOVE_SPACE_SUCCESS,
    payLoad
  };
}

export function removeSpaceFailure<T>(payLoad = {}): ActionTags<ActionType, T> {
  return {
    type: Actions.REMOVE_SPACE_FAILURE,
    payLoad
  };
}
