import request, { BaseplateResp } from 'src/baseplate/request'

export function requestTwitterToken(
  code: string,
  state: string
): Promise<BaseplateResp> {
  let body = JSON.stringify(
    {
      token: code,
      verifier: state,
    },
    null,
    ''
  )
  return request(
    `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/auth/twitter_callback`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`,
        Accept: 'application/json',
      },
      body: body,
    }
  )
}
