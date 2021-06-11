import request, { BaseplateResp } from 'src/baseplate/request';
import { TuumTechScriptService } from 'src/services/script.service';
import { GithubId } from './types';

export function requestGithubToken(
  code: string,
  state: string
): Promise<BaseplateResp> {
  return request(
    `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/auth/github_callback?code=${code}&state=${state}`,
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

export async function requestGithubId(token: string): Promise<GithubId> {
  let url = `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`;

  let response = await fetch(url, {
    method: 'GET'
  });

  let json = await response.json();

  return {
    id: json.id,
    name: json.given_name + ' ' + json.family_name,
    email: json.email
  };
}

export async function getUsersWithRegisteredGithub(github: string) {
  let prevUsers = [];
  prevUsers = await TuumTechScriptService.getUsersWithRegisteredGithub(github);
  return prevUsers;
}
