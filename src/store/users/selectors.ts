import { createSelector } from 'reselect';
import { usersAdapter } from './reducer';
import { SubState } from './types';

const userState = (state: any): SubState => state['user'];

const selectSession = createSelector(userState, state => state.session);

const selectTemplate = createSelector(
  selectSession,
  session => session?.pageTemplate
);

export const {
  selectById: selectUserById,
  selectIds: selectUserIds,
  selectEntities: selectUserEntities,
  selectAll: selectAllUsers,
  selectTotal: selectTotalUsers
} = usersAdapter.getSelectors((state: any) => state.user);

const makeSelectSession = () =>
  createSelector(userState, (state: SubState) => state.session);

export { userState, makeSelectSession, selectSession, selectTemplate };
