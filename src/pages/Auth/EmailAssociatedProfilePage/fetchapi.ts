import request, { BaseplateResp } from 'src/baseplate/request'
import { Api } from './constants'

export function fetchSimpleApi(): Promise<BaseplateResp> {
  return request(Api.sample, {
    headers: { 'content-type': 'text/plain' },
  })
}

export function requestForceCreateUser(
  fName: string,
  lName: string,
  email: string
): Promise<BaseplateResp> {
  return request(
    `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/forcecreate/user`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`,
        Accept: 'application/json',
      },
      body: JSON.stringify({
        firstName: fName,
        lastName: lName,
        email: email,
      }),
    }
  )
}
