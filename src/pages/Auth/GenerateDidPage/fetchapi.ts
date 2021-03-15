import { TuumTechScriptService } from 'src/services/script.service'
import request, { BaseplateResp } from 'src/baseplate/request'
import { Api } from './constants'

export function fetchSimpleApi(): Promise<BaseplateResp> {
  return request(Api.sample, {
    headers: { 'content-type': 'text/plain' },
  })
}

export async function getUsersWithRegisteredEmail(email: string) {
  let prevUsers = []
  prevUsers = await TuumTechScriptService.getUsersWithRegisteredEmail(email)
  return prevUsers
}
