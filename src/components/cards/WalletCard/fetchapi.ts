import request, { BaseplateResp } from 'src/baseplate/request';
export function requestRandomNonce(address: string): Promise<BaseplateResp> {
  return request(
    `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/auth/random_nonce?address=${address}`,
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
export function verifySignature(
  address: string,
  signature: string,
  domain: string
): Promise<BaseplateResp> {
  const body = JSON.stringify({
    address,
    signature,
    domain
  });
  return request(
    `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/auth/verify_signature?address=${address}`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`
      },
      body: body
    }
  );
}
