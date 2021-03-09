import { ScriptService } from 'src/services/script.service'
import request, { BaseplateResp } from 'src/baseplate/request'
import { Api } from './constants'

export function fetchSimpleApi(): Promise<BaseplateResp> {
  return request(Api.sample, {
    headers: { 'content-type': 'text/plain' },
  })
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
