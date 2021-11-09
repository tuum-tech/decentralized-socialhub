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

export function requestCreateEmailUser(
  name: string,
  email: string,
  did: string
): Promise<BaseplateResp> {
  return request(
    `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/credential/create`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`,
        Accept: 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        phone: '',
        did
      })
    }
  );
}

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
        phone
      })
    }
  );
}

export function updatePhoneNumber(
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
        phone
      })
    }
  );
}

export function verifyPhoneCode(code: string, did: string, phone: string) {
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
        code,
        did,
        phone
      })
    }
  );
}
