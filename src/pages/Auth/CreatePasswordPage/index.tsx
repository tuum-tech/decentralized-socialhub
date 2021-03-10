import { connect } from 'react-redux'
import { StaticContext, RouteComponentProps } from 'react-router'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import injector from 'src/baseplate/injectorWrap'

import { makeSelectCounter, makeSelectAjaxMsg } from './selectors'
import { incrementAction, getSimpleAjax } from './actions'
import React, { memo, useState, useEffect } from 'react'
import { NameSpace } from './constants'
import reducer from './reducer'
import saga from './saga'
import { InferMappedProps, SubState, LocationState } from './types'

import { UserService, ISessionItem } from 'src/services/user.service'

import styled from 'styled-components'

import {
  OnBoardLayout,
  OnBoardLayoutLeft,
  OnBoardLayoutLeftContent,
  OnBoardLayoutLeftContentTitle,
  OnBoardLayoutLeftContentDescription,
  OnBoardLayoutLogo,
  OnBoardLayoutRight,
  OnBoardLayoutRightContent,
  OnBoardLayoutRightContentTitle,
  WavingHandImg,
} from 'src/components/layouts/OnBoardLayout'

import ButtonWithLogo from 'src/components/buttons/ButtonWithLogo'
import TextInput from 'src/components/inputs/TextInput'
import { Text16 } from 'src/components/texts'

import whitelogo from 'src/assets/logo/whitetextlogo.png'
import keyimg from 'src/assets/icon/key.png'

const ErrorText = styled(Text16)`
  text-align: center;
  color: red;
  margin-top: 8px;
`

const CreatePasswordPage: React.FC<
  RouteComponentProps<{}, StaticContext, LocationState>
> = (props) => {
  /**
   * Direct method implementation without SAGA
   * This was to show you dont need to put everything to global state
   * incoming from Server API calls. Maintain a local state.
   */

  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState('')
  const [session, setSession] = useState<ISessionItem | null>(null)
  console.log('======>session', session)

  useEffect(() => {
    if (!session && props.location.state && props.location.state.did) {
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
      setSession({
        hiveHost,
        userToken,
        accountType,
        did,
        firstName,
        lastName,
        isDIDPublished,
        mnemonics: '',
        onBoardingCompleted,
        tutorialCompleted: false,
      })
    }
  })

  const afterPasswordSet = async () => {
    if (!session) return
    setLoading(true)
    await UserService.LockWithDIDAndPWd(session, password)
    setLoading(false)
    window.location.href = '/profile'
  }

  return (
    <OnBoardLayout>
      <OnBoardLayoutLeft>
        <OnBoardLayoutLogo src={whitelogo} />
        <OnBoardLayoutLeftContent>
          <WavingHandImg src={keyimg} />
          <OnBoardLayoutLeftContentTitle className='mt-18px'>
            Your password is not stored by us.
          </OnBoardLayoutLeftContentTitle>
          <OnBoardLayoutLeftContentDescription className='mt-25px'>
            This is a locally stored password. This password protects your main
            profile account (decentralized identity).
          </OnBoardLayoutLeftContentDescription>
        </OnBoardLayoutLeftContent>
      </OnBoardLayoutLeft>
      <OnBoardLayoutRight>
        <OnBoardLayoutRightContent>
          <OnBoardLayoutRightContentTitle style={{ marginBottom: '46px' }}>
            Create your password
          </OnBoardLayoutRightContentTitle>
          <TextInput
            value={password}
            label='Password'
            type='password'
            onChange={(n) => {
              setError('')
              setPassword(n)
            }}
            placeholder='Enter your password'
          />
          <TextInput
            value={repeatPassword}
            label='Re-enter Password'
            type='password'
            onChange={(n) => {
              setError('')
              setRepeatPassword(n)
            }}
            placeholder='Enter your password'
          />

          <ButtonWithLogo
            mt={34}
            hasLogo={false}
            text={loading ? 'Encrypting now.......' : 'Continue'}
            onClick={async () => {
              if (password === '' || repeatPassword === '') {
                setError('You should fill the input fields')
              } else if (password !== repeatPassword) {
                setError('Password is different')
              } else {
                await afterPasswordSet()
              }
            }}
          />
          {error !== '' && <ErrorText>{error}</ErrorText>}
        </OnBoardLayoutRightContent>
      </OnBoardLayoutRight>
    </OnBoardLayout>
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
