/**
 * Type defined inside this container
 */

export interface TokenContent {
  request_token: string
  expires_in: string
  response: string
}

export interface TokenResponse {
  data: TokenContent
}

export interface TwitterId {
  id: string
  firstName: string
  lastName: string
  email: string
  credential: string
}
