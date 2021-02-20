import request, { BaseplateResp } from 'src/baseplate/request';
import { Api } from './constants';
import { LinkedinId } from './types';

export function fetchSimpleApi(): Promise<BaseplateResp> {
  return request(Api.sample, {
    headers: { 'content-type': 'text/plain' },
  });
}

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
        Accept: 'application/json',
      },
    }
  );
}

export async function requestLinkedinId(token: string): Promise<LinkedinId> {
  let corsavoidhost = 'https://cors-anywhere.herokuapp.com/';
  let url = `${corsavoidhost}https://api.linkedin.com/v2/me?projection=(id,firstName,lastName)`;
  let data: any = {
    method: 'GET',
    headers: {
      'content-type': 'text/plain',
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  };
  let response = await fetch(url, data);

  let json = await response.json();
  console.log('linkedin json', response);

  return {
    id: json.id,
    name: `${json.firstName} ${json.lastName}`,
    credential: json.emailAddress,
  };
}
