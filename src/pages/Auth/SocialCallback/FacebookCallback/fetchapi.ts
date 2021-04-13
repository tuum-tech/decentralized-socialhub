import request, { BaseplateResp } from 'src/baseplate/request';
import { TuumTechScriptService } from 'src/services/script.service';
import { FacebookId } from './types';

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
        Accept: 'application/json'
      }
    }
  );
}

export async function requestFacebookId(token: string): Promise<FacebookId> {
  const url = `https://graph.facebook.com/me?access_token=${token}`;
  const response = await fetch(url, {
    method: 'GET'
  });
  const json = await response.json();
  const name = json.name;
  const uniqueEmail = name.replace(' ', '') + '@facebook.com';

  return {
    id: json.id,
    name,
    credential: json.name,
    email: uniqueEmail.toLocaleLowerCase()
  };
}


export async function getUsersWithRegisteredFacebook(facebook: string) {
  let prevUsers = [];
  prevUsers = await TuumTechScriptService.getUsersWithRegisteredFacebook(facebook);
  return prevUsers;
}
