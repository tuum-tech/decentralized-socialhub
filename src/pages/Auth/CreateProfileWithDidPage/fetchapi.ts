import request, { BaseplateResp } from 'src/baseplate/request';
import { TuumTechScriptService } from 'src/services/script.service';

export function requestLinkedinLogin(): Promise<BaseplateResp> {
  return request(
    `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/auth/linkedin_request`,
    {
      headers: {
        'content-type': 'text/plain',
        Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`,
        Accept: 'application/json'
      }
    }
  );
}

export function requestGoogleLogin(): Promise<BaseplateResp> {
  return request(
    `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/auth/google_request`,
    {
      headers: {
        'content-type': 'text/plain',
        Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`,
        Accept: 'application/json'
      }
    }
  );
}

export function requestFacebookLogin(): Promise<BaseplateResp> {
  return request(
    `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/auth/facebook_request`,
    {
      headers: {
        'content-type': 'text/plain',
        Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`,
        Accept: 'application/json'
      }
    }
  );
}

export async function getUsersWithRegisteredEmail(email: string) {
  let prevUsers = [];
  prevUsers = await TuumTechScriptService.getUsersWithRegisteredEmail(email);
  return prevUsers;
}
