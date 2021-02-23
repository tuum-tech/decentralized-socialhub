/**
 * Type defined inside this container
 */

export interface TokenContent {
  request_token: string;
  expires_in: string;
  response: string;
}

export interface TokenResponse {
  data: TokenContent;
}

export interface TwitterId {
  id: string;
  fname: string;
  lname: string;
  email: string;
  credential: string;
}
