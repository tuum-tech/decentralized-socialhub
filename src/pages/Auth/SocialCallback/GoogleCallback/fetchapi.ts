import request, { BaseplateResp } from 'src/baseplate/request';
import { GoogleId } from './types';

export function requestGoogleToken(
  code: string,
  state: string
): Promise<BaseplateResp> {
  return request(
    `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/auth/google_callback?code=${code}&state=${state}`,
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

export async function requestGoogleId(token: string): Promise<GoogleId> {
  let url = `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`;

  let response = await fetch(url, {
    method: 'GET',
  });

  let json = await response.json();
  const fname = json.given_name;
  const lname = json.family_name;

  return {
    id: json.id,
    fname,
    lname,
    email: json.email,
    credential: json.id,
  };
}
