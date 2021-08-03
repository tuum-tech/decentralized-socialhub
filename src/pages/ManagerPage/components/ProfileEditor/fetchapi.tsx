import request, { BaseplateResp } from 'src/baseplate/request';

export function requestUpdateEmail(
  did: string,
  email: string,
  phone: string
): Promise<BaseplateResp> {
  return request(
    `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/credential/update`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`,
        Accept: 'application/json'
      },
      body: JSON.stringify({
        did,
        email,
        phone,
        smsCode: false
      })
    }
  );
}
