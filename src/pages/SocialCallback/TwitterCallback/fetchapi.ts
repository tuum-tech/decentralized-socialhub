import request, { BaseplateResp } from 'src/baseplate/request';

import { Api } from './constant';
import { TwitterId } from './types';

export function requestTwitterToken(
  oauth_token: string,
  oauth_verifier: string
): Promise<BaseplateResp> {
  let body = JSON.stringify(
    {
      token: oauth_token,
      verifier: oauth_verifier,
    },
    null,
    ''
  );
  return request(
    `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/auth/twitter_callback`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`,
        Accept: 'application/json',
      },
      body: body,
    }
  );
}

export async function requestTwitterId(token: string): Promise<BaseplateResp> {
  // let response = await fetch(
  //   `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/auth/twitter_callback`,
  //   {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization: process.env.REACT_APP_DIDCRED_KEY,
  //     },
  //     body: JSON.stringify({
  //       token: oauth_token,
  //       verifier: oauth_verifier,
  //     }),
  //   }
  // );

  // if (response.ok) {
  //   return await response.json();
  // }

  return null;
}
