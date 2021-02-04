/**
 * Type defined inside this container
*/
import { initialState } from './reducer';
import { mapDispatchToProps, mapStateToProps } from './index';
import { Actions } from './constants';

export type SubState = typeof initialState;
export type InferMappedProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

export type ActionType = typeof Actions;

export interface TokenContent {
  request_token: string,
  expires_in: string
}

export interface TokenResponse {
  data: TokenContent
}

export interface FacebookId{
  id: string,
  name: string,
  credential: string
}