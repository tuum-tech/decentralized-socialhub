import { Actions } from './constants';

export type SubState = {
  loading: boolean;
  spaces: Space[];
  error: Error | null | unknown;
};

export type ActionType = typeof Actions;
