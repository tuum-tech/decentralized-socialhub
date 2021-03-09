import React, { memo, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import { StaticContext, RouteComponentProps } from 'react-router'
import { AccountType, UserService } from 'src/services/user.service'

import UserInfo from './components/UserInfo'
import PageLoading from 'src/components/layouts/PageLoading'
import SetPassword from 'src/components/SetPassword'

import { makeSelectCounter, makeSelectAjaxMsg } from './selectors'
import injector from 'src/baseplate/injectorWrap'
import { incrementAction, getSimpleAjax } from './actions'
import { NameSpace } from './constants'
import reducer from './reducer'
import saga from './saga'
import { InferMappedProps, SubState, LocationState } from './types'

const CreateProfileWithDidPage: React.FC<
  RouteComponentProps<{}, StaticContext, LocationState>
> = (props) => {
  // const [did, setDid] = useState('')
  const [userInfo, setUserInfo] = useState({
    fname: '',
    did: '',
    mnemonic: '',
    lname: '',
    email: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (userInfo.did === '') {
      const { did, mnemonic } = props.location.state
      setUserInfo({
        ...userInfo,
        did,
        mnemonic
      })
    }
  }, [userInfo.did])

  if (userInfo.did === '') {
    return <PageLoading />
  } else if (userInfo.fname === '') {
    return (
      <UserInfo
        setUserInfo={(fname, lname, email) => {
          setUserInfo({
            ...userInfo,
            fname,
            lname,
            email,
          })
        }}
      />
    )
  }

  return (
    <SetPassword
      next={async (pwd) => {
        setLoading(true)
        await UserService.CreateNewUser(
          userInfo.fname,
          userInfo.lname,
          userInfo.did,
          AccountType.DID,
          userInfo.email,
          userInfo.did,
          pwd,
          userInfo.did,
          userInfo.mnemonic
        )
        setLoading(false)
        window.location.href = '/profile'
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
const withInjectedMode = injector(CreateProfileWithDidPage, {
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
