import { mapDispatchToProps, mapStateToProps } from './index';
import { SubState, ActionType, defaultUserInfo } from 'src/store/users/types';

export type InferMappedProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export { defaultUserInfo };

export type LocationState = {
  search: string;
};

export interface TokenContent {
  username: string;
  discriminator: string;
}

export interface TokenResponse {
  data: TokenContent;
}
