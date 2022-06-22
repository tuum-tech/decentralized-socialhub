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

export function getUsersByDid(
  dids: string[],
  limit: number,
  offset = 0
): ActionTags<
  ActionType,
  {
    dids: string[];
    limit: number;
    offset?: number;
  }
> {
  return {
    type: Actions.GET_USERS_BY_DID,
    payLoad: { dids, limit, offset }
  };
}

export function getUsersByDidSuccess(payLoad: {
  users: Array<any>;
}): ActionTags<ActionType, { users: Array<any> }> {
  return {
    type: Actions.GET_USERS_BY_DID_SUCCESS,
    payLoad
  };
}

export function getUsersByDidFailure<T>(
  payLoad = {}
): ActionTags<ActionType, T> {
  return {
    type: Actions.GET_USERS_BY_DID_FAILURE,
    payLoad
  };
}
