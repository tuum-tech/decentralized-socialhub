import request, { BaseplateResp } from 'src/baseplate/request';

export async function checkIfThisUserOnTuumVault(
  email: string
): Promise<BaseplateResp> {
  const script = {
    name: 'get_users',
    params: {
      email: email,
    },
    context: {
      target_did: 'did:elastos:iag8qwq1xPBpLsGv4zR4CmzLpLUkBNfPHX',
      target_app_did: 'did:elastos:iag8qwq1xPBpLsGv4zR4CmzLpLUkBNfPHX',
    },
  };

  return request(
    `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/api/tuumvault_router/scripting/run_script`,
    {
      method: 'POST',
      headers: {
        Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`,
        Accept: 'application/json',
        charset: 'utf8',
        'content-type': 'application/json',
      },
      body: JSON.stringify(script),
    }
  );
}
