import { createSelector } from 'reselect';
import { initialState } from './reducer';
import { SubState } from './types';

const userState = (state: any): SubState => state['platformuser'];

const makeSelectSession = () => {
  console.log('===>makeSelectSession');
  return createSelector(userState, (state: SubState) => {
    console.log('====>state', state);
    return state.session;
  });
};

const makeSelectUsers = () =>
  createSelector(userState, (state: SubState) => state.users);

export { userState, makeSelectUsers, makeSelectSession };
