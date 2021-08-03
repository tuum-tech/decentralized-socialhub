import request, { BaseplateResp } from 'src/baseplate/request';

export function requestEmailVerifyCode(code: string): Promise<BaseplateResp> {
  return request(
    `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/credential/verify`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`,
        Accept: 'application/json'
      },
      body: JSON.stringify({
        code
      })
    }
  );
}
