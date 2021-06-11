export interface TokenContent {
  request_token: string;
  expires_in: string;
}

export interface TokenResponse {
  data: TokenContent;
}

export interface GithubId {
  id: string;
  name: string;
  email: string;
}
