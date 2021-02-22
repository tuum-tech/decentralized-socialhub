/**
 * Type defined inside this container
 */

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
  credential: string;
}
