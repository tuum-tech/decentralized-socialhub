import { createSelector } from 'reselect';
// import { initialState } from './reducer';
import { SubState } from './types';

const userState = (state: any): SubState => state['user'];

const makeSelectSession = () =>
  createSelector(userState, (state: SubState) => state.session);

export { userState, makeSelectSession };
