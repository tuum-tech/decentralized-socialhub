/**
 * Type defined inside this container
 */
import { AccountType } from 'src/services/user.service'

import { initialState } from './reducer'
import { mapDispatchToProps, mapStateToProps } from './index'
import { Actions } from './constants'

export type SubState = typeof initialState
export type InferMappedProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>

export type ActionType = typeof Actions

export type EmailUser = {
  status: string
  did: string
  email: string
  _id: string
}

export type UserSessionProp = {
  users: Array<EmailUser>
  fname: string
  lname: string
  email: string
}

export type LocationState = {
  from: Location
  users: Array<EmailUser>
  fname: string
  lname: string
  email: string
}
