import { mapDispatchToProps, mapStateToProps } from './index';
import { SubState, ActionType, defaultUserInfo } from 'src/store/users/types';

export type InferMappedProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export { defaultUserInfo }; 
export type { SubState, ActionType };

export type LocationState = {
  search: string;
};

export interface TokenContent {
  request_token: string;
  expires_in: string;
}

export interface TokenResponse {
  data: TokenContent;
}

export interface FacebookId {
  id: string;
  name: string;
}
