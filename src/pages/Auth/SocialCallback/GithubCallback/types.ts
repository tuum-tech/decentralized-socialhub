import { mapDispatchToProps, mapStateToProps } from './index';
import { defaultUserInfo } from 'src/store/users/types';

export type InferMappedProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export { defaultUserInfo };

export type LocationState = {
  search: string;
};

export interface TokenContent {
  login: string;
}

export interface TokenResponse {
  data: TokenContent;
}
