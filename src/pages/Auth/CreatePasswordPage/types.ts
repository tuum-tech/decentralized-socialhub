/**
 * Type defined inside this container
 */
import { initialState } from './reducer'
import { mapDispatchToProps, mapStateToProps } from './index'
import { Actions } from './constants'
import { AccountType } from 'src/services/user.service'

export type SubState = typeof initialState
export type InferMappedProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>

export type ActionType = typeof Actions

export type LocationState = {
  from: Location
  firstName: string
  lastName: string
  userToken: string
  accountType:
    | AccountType.DID
    | AccountType.Linkedin
    | AccountType.Facebook
    | AccountType.Google
    | AccountType.Twitter
  did: string
  hiveHost: string
  isDIDPublished: boolean
  onBoardingCompleted: boolean
}
