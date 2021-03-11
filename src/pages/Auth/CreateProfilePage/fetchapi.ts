import request, { BaseplateResp } from 'src/baseplate/request'
import { ScriptService } from 'src/services/script.service'

import { Api } from './constants'

export function fetchSimpleApi(): Promise<BaseplateResp> {
  return request(Api.sample, {
    headers: { 'content-type': 'text/plain' },
  })
}

export function requestCreateUser(
  name: string,
  email: string
): Promise<BaseplateResp> {
  return request(
    `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/create/user`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`,
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
      }),
    }
  )
}

export function requestLinkedinLogin(): Promise<BaseplateResp> {
  return request(
    `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/auth/linkedin_request`,
    {
      headers: {
        'content-type': 'text/plain',
        Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`,
        Accept: 'application/json',
      },
    }
  )
}

export function requestGoogleLogin(): Promise<BaseplateResp> {
  return request(
    `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/auth/google_request`,
    {
      headers: {
        'content-type': 'text/plain',
        Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`,
        Accept: 'application/json',
      },
    }
  )
}

export function requestFacebookLogin(): Promise<BaseplateResp> {
  return request(
    `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/auth/facebook_request`,
    {
      headers: {
        'content-type': 'text/plain',
        Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`,
        Accept: 'application/json',
      },
    }
  )
}

export async function getUsersWithRegisteredEmail(email: string) {
  const get_users_scripts = {
    name: 'get_users_by_email',
    params: {
      email: email,
    },
    context: {
      target_did: process.env.REACT_APP_APPLICATION_DID,
      target_app_did: process.env.REACT_APP_APPLICATION_ID,
    },
  }

  let get_users_script_response: any = await ScriptService.runTuumTechScript(
    get_users_scripts
  )

  let prevUsers = []
  const { meta, data } = get_users_script_response
  if (meta && meta.code === 200 && meta.message === 'OK') {
    const { get_users_by_email } = data
    if (
      get_users_by_email &&
      get_users_by_email.items &&
      get_users_by_email.items.length > 0
    ) {
      prevUsers = get_users_by_email.items.map((userItem: any) => {
        const newUserItem = {
          status: userItem.status || '',
          did: userItem.did || '',
          email: userItem.email || '',
          _id: userItem._id.$oid || '',
        }
        return newUserItem
      })
    }
  } else {
    throw new Error('Error while running get_users script')
  }

  return prevUsers
}
