import { initialState } from './reducer';
import { Actions } from './constants';

export type SubState = typeof initialState;

export type ActionType = typeof Actions;

export const defaultUserInfo: ISessionItem = {
  hiveHost: '',
  userToken: '',
  accountType: 'DID',
  did: '',
  // email: '',
  name: '',
  isDIDPublished: false,
  didPublishTime: 0,
  loginCred: {},
  mnemonics: '',
  passhash: '',
  onBoardingCompleted: false,
  tutorialStep: 1,
  pageTemplate: 'default'
};
