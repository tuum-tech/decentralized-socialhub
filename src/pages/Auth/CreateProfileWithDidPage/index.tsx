import React, { memo, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import { StaticContext, RouteComponentProps } from 'react-router'
import { AccountType, UserService } from 'src/services/user.service'

import ProfileFields from '../components/ProfileFields'
import SetPassword from '../components/SetPassword'

import PageLoading from 'src/components/layouts/PageLoading'
import { DidService } from 'src/services/did.service'

import { makeSelectCounter, makeSelectAjaxMsg } from './selectors'
import injector from 'src/baseplate/injectorWrap'
import { incrementAction, getSimpleAjax } from './actions'
import { NameSpace } from './constants'
import reducer from './reducer'
import saga from './saga'
import { InferMappedProps, SubState, LocationState } from './types'

type UserType = {
  firstName: string
  did: string
  mnemonic: string
  lastName: string
  email: string
  hiveHost: string
}

const CreateProfileWithDidPage: React.FC<
  RouteComponentProps<{}, StaticContext, LocationState>
> = (props) => {
  const [userInfo, setUserInfo] = useState<UserType>({
    firstName: '',
    did: '',
    mnemonic: '',
    lastName: '',
    email: '',
    hiveHost: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchUserInfo = async () => {
      const { did, mnemonic } = props.location.state
      let doc = await DidService.getDidDocument(did)
      let uInfo: UserType = {
        did,
        mnemonic,
        lastName: '',
        firstName: '',
        email: '',
        hiveHost: '',
      }
      if (props.location.state.user) {
        uInfo.firstName = props.location.state.user.firstName
        uInfo.lastName = props.location.state.user.lastName
        uInfo.email = props.location.state.user.email
      }
      if (doc && doc !== undefined && doc.name) {
        uInfo.firstName = doc.name.split(' ')[0] || ''
      }
      if (doc && doc !== undefined && doc.name) {
        uInfo.lastName = doc.name.split(' ')[1] || ''
      }
      if (doc && doc !== undefined && doc.email) {
        uInfo.email = doc.email
      }
      if (doc && doc !== undefined && doc.email) {
        uInfo.hiveHost = doc.hiveHost
      }
      setUserInfo(uInfo)
    }
    if (userInfo.did === '') {
      fetchUserInfo()
    }
  }, [])

  if (userInfo.did === '') {
    return <PageLoading />
  } else if (userInfo.firstName === '') {
    return (
      <ProfileFields
        isCreate={false}
        setUserInfo={(firstName, lastName, email) => {
          setUserInfo({
            ...userInfo,
            firstName,
            lastName,
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
          userInfo.firstName,
          userInfo.lastName,
          userInfo.did,
          AccountType.DID,
          userInfo.email,
          userInfo.did,
          pwd,
          userInfo.did,
          userInfo.mnemonic,
          userInfo.hiveHost
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
