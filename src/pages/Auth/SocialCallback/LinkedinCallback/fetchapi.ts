import request, { BaseplateResp } from 'src/baseplate/request';
import { LinkedinId } from './types';

export function requestLinkedinToken(
  code: string,
  state: string
): Promise<BaseplateResp> {
  return request(
    `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/auth/linkedin_callback?code=${code}&state=${state}`,
    {
      method: 'GET',
      headers: {
        'content-type': 'text/plain',
        Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`,
        Accept: 'application/json'
      }
    }
  );
}

export function requestLinkedinProfile(
  request_token: string
): Promise<BaseplateResp> {
  return request(
    `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/auth/linkedin_profile?request_token=${request_token}`,
    {
      method: 'GET',
      headers: {
        'content-type': 'text/plain',
        Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`,
        Accept: 'application/json'
      }
    }
  );
}
