import React, { memo, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { StaticContext, RouteComponentProps, useHistory } from 'react-router'
import { compose } from 'redux'

import { createStructuredSelector } from 'reselect'
import injector from 'src/baseplate/injectorWrap'
import { UserService, UserData } from 'src/services/user.service'
import SetPassword from 'src/components/SetPassword'
import PageLoading from 'src/components/layouts/PageLoading'
import { AccountType } from 'src/services/user.service'

import { makeSelectCounter, makeSelectAjaxMsg } from './selectors'
import { incrementAction, getSimpleAjax } from './actions'
import { NameSpace } from './constants'
import reducer from './reducer'
import saga from './saga'
import {
  InferMappedProps,
  SubState,
  LocationState,
  UserSessionProp,
} from './types'
import { checkIfEmailAlreadyRegistered } from './fetchapi'

const GenerateDidPage: React.FC<
  RouteComponentProps<{}, StaticContext, LocationState>
> = (props) => {
  /**
   * Direct method implementation without SAGA
   * This was to show you dont need to put everything to global state
   * incoming from Server API calls. Maintain a local state.
   */

  const history = useHistory()

  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState<UserSessionProp | null>(null)

  useEffect(() => {
    ;(async () => {
      if (!session && props.location.state && props.location.state.service) {
        const { service } = props.location.state
        if (service !== AccountType.Email && service !== AccountType.DID) {
          const pUsers = await checkIfEmailAlreadyRegistered(
            props.location.state.email
          )
          if (pUsers.length > 0) {
            history.push({
              pathname: '/a-profile',
              state: {
                dids: pUsers,
                fname: props.location.state.fname,
                lname: props.location.state.lname,
                email: props.location.state.email,
                request_token: props.location.state.request_token,
                service: props.location.state.service,
                credential: props.location.state.credential,
              },
            })
          }
        }
        setSession(props.location.state)
      }
    })()
  }, [session])

  if (session && session.request_token) {
    return (
      <SetPassword
        next={async (pwd) => {
          setLoading(true)
          if (session) {
            await UserService.CreateNewDidUser(
              session.fname,
              session.lname,
              session.request_token,
              session.service,
              session.email,
              session.credential,
              pwd
            )
          }
          setLoading(false)
          window.location.href = '/profile'
        }}
        displayText={loading ? 'Encrypting now.......' : ''}
      />
    )
  }

  return <PageLoading />
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
