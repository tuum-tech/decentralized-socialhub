import { createSelector } from 'reselect';
// import { initialState } from './reducer';
import { SubState } from './types';

const userState = (state: any): SubState => state['user'];

const selectSession = createSelector(userState, state => state.session);

const makeSelectSession = () =>
  createSelector(userState, (state: SubState) => state.session);

export { userState, makeSelectSession, selectSession };
