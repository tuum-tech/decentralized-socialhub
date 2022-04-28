import { SubState, ActionType, defaultUserInfo } from 'src/store/users/types';

export { defaultUserInfo }; 
export type { SubState, ActionType };

export interface ActivityResponse {
  _status: string;
  get_activity: GetActivity;
}

export interface GetActivity {
  items?: ActivityItem[] | null;
}