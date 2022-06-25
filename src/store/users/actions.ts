import { usersSlice } from './reducer';

export function setSession(payload: { session: ISessionItem }) {
  return usersSlice.actions.setSession(payload);
}

export function getUsersByDid(dids: string[], limit: number, offset = 0) {
  return usersSlice.actions.getUsersByDid({
    dids: [...new Set(dids)],
    limit,
    offset
  });
}
