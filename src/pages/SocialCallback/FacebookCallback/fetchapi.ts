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
  let url = `https://graph.facebook.com/me?access_token=${token}`;

  let response = await fetch(url, {
    method: 'GET',
  });

  let json = await response.json();

  return {
    id: json.id,
    name: json.name,
    credential: json.name, //TODO: Change to real credential when api is updated
  };
}
