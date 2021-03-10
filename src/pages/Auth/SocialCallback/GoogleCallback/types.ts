export interface TokenContent {
  request_token: string
  expires_in: string
}

export interface TokenResponse {
  data: TokenContent
}

export interface GoogleId {
  id: string
  firstName: string
  lastName: string
  email: string
  credential: string
}
