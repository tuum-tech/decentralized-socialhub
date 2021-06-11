export interface TokenContent {
  username: string;
  discriminator: string;
}

export interface TokenResponse {
  data: TokenContent;
}
