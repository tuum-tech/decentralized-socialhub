import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import injector from 'src/baseplate/injectorWrap'
import { makeSelectCounter, makeSelectAjaxMsg } from './selectors'
import { incrementAction, getSimpleAjax } from './actions'
import React, { memo, useState } from 'react'

import { NameSpace } from './constants'
import reducer from './reducer'
import saga from './saga'
import { InferMappedProps, SubState } from './types'

import { Redirect, RouteComponentProps, StaticContext } from 'react-router'
import styled from 'styled-components'

import { UserService } from 'src/services/user.service'
import {
  OnBoardLayout,
  OnBoardLayoutLeft,
  OnBoardLayoutLeftContent,
  OnBoardLayoutLeftContentTitle,
  OnBoardLayoutLeftContentIntro,
  OnBoardLayoutLogo,
  OnBoardLayoutRight,
  OnBoardLayoutRightContent,
  OnBoardLayoutRightContentTitle,
  WavingHandImg,
} from 'src/components/layouts/OnBoardLayout'
import { ButtonWithLogo } from 'src/components/buttons'
import { Text12 } from 'src/components/texts'
import TextInput from 'src/components/inputs/TextInput'

import wavinghand from 'src/assets/icon/wavinghand.png'
import whitelogo from 'src/assets/logo/whitetextlogo.png'

const ErrorTxt = styled(Text12)`
  color: red;
  text-align: center;
  margin-top: 5px;
`

type LocationState = {
  from: Location
  did: string
}

const EnterPasswordPage: React.FC<
  RouteComponentProps<{}, StaticContext, LocationState>
> = (props) => {
  /**
   * Direct method implementation without SAGA
   * This was to show you dont need to put everything to global state
   * incoming from Server API calls. Maintain a local state.
   */
  const { did } = props.location.state

  const [nextPage, setNextPage] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const getRedirect = () => {
    if (nextPage === '/profile') {
      return <Redirect to='/profile' />
    }

    return (
      <OnBoardLayout>
        <OnBoardLayoutLeft>
          <OnBoardLayoutLogo src={whitelogo} />
          <OnBoardLayoutLeftContent>
            <WavingHandImg src={wavinghand} />
            <OnBoardLayoutLeftContentTitle className='mt-18px'>
              Continue with your password
            </OnBoardLayoutLeftContentTitle>
            <OnBoardLayoutLeftContentIntro className='my-25px'>
              Forgot your password? Help
            </OnBoardLayoutLeftContentIntro>
          </OnBoardLayoutLeftContent>
        </OnBoardLayoutLeft>
        <OnBoardLayoutRight>
          <OnBoardLayoutRightContent style={{ marginTop: 0 }}>
            <OnBoardLayoutRightContentTitle>
              Enter your password
            </OnBoardLayoutRightContentTitle>
            <TextInput
              value={password}
              label='Password'
              onChange={(n) => setPassword(n)}
              placeholder='Enter your password'
            />
            {error !== '' && <ErrorTxt>{error}</ErrorTxt>}
            <ButtonWithLogo
              mt={34}
              hasLogo={false}
              text='Continue'
              onClick={() => {
                if (password === '') {
                  setError('You should fill the password')
                  return
                } else {
                  setError('')
                  console.log('====>did', password, did)
                  const res: any = UserService.LoginWithPassword(did, password)

                  if (!res) {
                    setError('User Not found secured by this password')
                    return
                  } else {
                    setNextPage('/profile')
                  }
                }
              }}
            />
          </OnBoardLayoutRightContent>
        </OnBoardLayoutRight>
      </OnBoardLayout>
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
const withInjectedMode = injector(EnterPasswordPage, {
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
