import { initialState } from './reducer';
import { Actions } from './constants';

export type SubState = typeof initialState;

export type ActionType = typeof Actions;
