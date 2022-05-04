import { SubState, ActionType, defaultUserInfo } from 'src/store/users/types';

export { defaultUserInfo }; 
export type { SubState, ActionType };

export interface Entity {
  name: string;
  did?: string;
}

export interface Period {
  start: string;
  end?: string;
}
