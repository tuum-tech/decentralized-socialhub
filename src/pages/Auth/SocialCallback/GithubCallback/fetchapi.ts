import request, { BaseplateResp } from 'src/baseplate/request';
import { TuumTechScriptService } from 'src/services/script.service';

export function requestGithubToken(code: string): Promise<BaseplateResp> {
  return request(
    `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/auth/github_callback?code=${code}`,
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

export async function getUsersWithRegisteredGithub(github: string) {
  let prevUsers = [];
  prevUsers = await TuumTechScriptService.getUsersWithRegisteredGithub(github);
  return prevUsers;
}
