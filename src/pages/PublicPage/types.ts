/**
 * Type defined inside this container
 */
import { initialState } from './reducer';
import { Actions } from './constants';

export type SubState = typeof initialState;

export type ActionType = typeof Actions;

export interface Entity {
  name: string;
  did?: string;
}

export interface Period {
  start: string;
  end?: string;
}
