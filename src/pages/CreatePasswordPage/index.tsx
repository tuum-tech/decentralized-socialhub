import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import injector from 'src/baseplate/injectorWrap'
import { makeSelectCounter, makeSelectAjaxMsg } from './selectors'
import { incrementAction, getSimpleAjax } from './actions'
import React, { memo, useState, useEffect } from 'react'
import { NameSpace } from './constants'
import reducer from './reducer'
import saga from './saga'
import { InferMappedProps, SubState } from './types'

import { StaticContext, Redirect, RouteComponentProps } from 'react-router'

import {
  UserService,
  AccountType,
  ISessionItem,
} from 'src/services/user.service'
import SetPassword from 'src/components/SetPassword'

type LocationState = {
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

const CreatePasswordPage: React.FC<
  RouteComponentProps<{}, StaticContext, LocationState>
> = (props) => {
  // const CreatePasswordPage : React.FC<InferMappedProps> = ({ eProps, ...props }: InferMappedProps) => {

  /**
   * Direct method implementation without SAGA
   * This was to show you dont need to put everything to global state
   * incoming from Server API calls. Maintain a local state.
   */
  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState<ISessionItem | null>(null)

  const {
    hiveHost,
    userToken,
    accountType,
    did,
    firstName,
    lastName,
    isDIDPublished,
    onBoardingCompleted,
  } = props.location.state

  useEffect(() => {
    if (!session && props.location.state && props.location.state.did) {
      setSession({
        hiveHost,
        userToken,
        accountType,
        did,
        firstName,
        lastName,
        isDIDPublished,
        onBoardingCompleted,
      })
    }
  })

  return (
    <SetPassword
      next={async (pwd) => {
        if (session) {
          setLoading(true)
          await UserService.SignInWithDIDAndPWd(session, pwd)
          setLoading(false)
          // setNextPage('/profile')
          window.location.href = '/profile'
        }
      }}
      displayText={loading ? 'Encrypting now.......' : ''}
    />
  )
}

/** @returns {object} Contains state props from selectors */
export const mapStateToProps = createStructuredSelector<SubState, SubState>({
  counter: makeSelectCounter(),
  msg: makeSelectAjaxMsg(),
})

/** @returns {object} Contains dispatchable props */
export function mapDispatchToProps(dispatch: any) {
  return {
    eProps: {
      // eProps - Emitter proptypes thats binds to dispatch
      /** dispatch for counter to increment */
      onCount: (count: { counter: number }) => dispatch(incrementAction(count)),
      onSimpleAjax: () => dispatch(getSimpleAjax()),
    },
  }
}

/**
 * Injects prop and saga bindings done via
 * useInjectReducer & useInjectSaga
 */
const withInjectedMode = injector(CreatePasswordPage, {
  key: NameSpace,
  reducer,
  saga,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(
  withConnect,
  memo
)(withInjectedMode) as React.ComponentType<InferMappedProps>

// export default Tab1;
