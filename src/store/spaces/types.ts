import { Actions } from './constants';

export type SubState = {
  loading: boolean;
  spaces: Space[];
  error: Error | null | unknown;
  saving: boolean;
};

export type ActionType = typeof Actions;
