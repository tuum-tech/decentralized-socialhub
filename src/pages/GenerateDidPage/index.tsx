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
import { checkIfEmailAlreadyRegistered } from './fetchapi'

import { Redirect, StaticContext, RouteComponentProps } from 'react-router'

import { UserService, AccountType, UserData } from 'src/services/user.service'
import SetPassword from 'src/components/SetPassword'

type LocationState = {
  from: Location
  id: string
  fname: string
  lname: string
  email: string
  request_token: string
  credential: string
  service:
    | AccountType.DID
    | AccountType.Linkedin
    | AccountType.Facebook
    | AccountType.Google
    | AccountType.Twitter
}

const GenerateDidPage: React.FC<
  RouteComponentProps<{}, StaticContext, LocationState>
> = (props) => {
  /**
   * Direct method implementation without SAGA
   * This was to show you dont need to put everything to global state
   * incoming from Server API calls. Maintain a local state.
   */
  const [isLogged, setIsLogged] = useState(false)
  const [loading, setLoading] = useState(false)
  const [prevUsers, setPrevUsers] = useState<UserData[]>([])

  const {
    fname,
    lname,
    email,
    id,
    request_token,
    service,
    credential,
  } = props.location.state

  useEffect(() => {
    ;(async () => {
      if (fname !== '' && lname !== '' && email !== '') {
        const pUsers = await checkIfEmailAlreadyRegistered(email)
        setPrevUsers(pUsers)
      }
    })()
  }, [])

  const getRedirect = () => {
    if (isLogged) {
      return <Redirect to={{ pathname: '/profile' }} />
    }
    if (prevUsers.length === 0) {
      return (
        <SetPassword
          next={async (pwd) => {
            setLoading(true)
            await UserService.SignIn3rdParty(
              id,
              fname,
              lname,
              request_token,
              service,
              email,
              credential,
              pwd
            )
            setLoading(false)
            setIsLogged(true)
          }}
          displayText={loading ? 'Encrypting now.......' : ''}
        />
      )
    }
    return (
      <Redirect
        to={{
          pathname: '/a-profile',
          state: {
            dids: prevUsers,
            fname,
            lname,
            email,
            id,
            request_token,
            service,
            credential,
          },
        }}
      />
    )
  }
  return getRedirect()
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
const withInjectedMode = injector(GenerateDidPage, {
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
