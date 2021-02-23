import request, { BaseplateResp } from 'src/baseplate/request';
import { Api } from './constants';
import { FacebookId } from './types';

export function fetchSimpleApi(): Promise<BaseplateResp> {
  return request(Api.sample, {
    headers: { 'content-type': 'text/plain' },
  });
}

export function requestFacebookToken(
  code: string,
  state: string
): Promise<BaseplateResp> {
  return request(
    `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/auth/facebook_callback?code=${code}&state=${state}`,
    {
      method: 'GET',
      headers: {
        'content-type': 'text/plain',
        Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`,
        Accept: 'application/json',
      },
    }
  );
}

export async function requestFacebookId(token: string): Promise<FacebookId> {
  const url = `https://graph.facebook.com/me?access_token=${token}`;
  const response = await fetch(url, {
    method: 'GET',
  });
  const json = await response.json();
  const fname = json.name.split(' ')[0];
  const lname = json.name.split(' ')[1] || '';
  const uniqueEmail = fname + lname + json.id + '@facebook.com';

  return {
    id: json.id,
    fname,
    lname,
    credential: json.name,
    email: uniqueEmail.toLocaleLowerCase(),
  };
}
