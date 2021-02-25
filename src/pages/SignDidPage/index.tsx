import { IonRow } from '@ionic/react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import injector from 'src/baseplate/injectorWrap'
import { makeSelectCounter, makeSelectAjaxMsg } from './selectors'
import { incrementAction, getSimpleAjax } from './actions'
import React, { memo, useState } from 'react'
import style from './style.module.scss'
import { NameSpace } from './constants'
import reducer from './reducer'
import saga from './saga'
import { InferMappedProps, SubState } from './types'

import {
  OnBoardLayout,
  OnBoardLayoutLeft,
  OnBoardLayoutLeftContent,
  OnBoardLayoutLeftContentTitle,
  OnBoardLayoutLeftContentDescription,
  OnBoardLayoutLeftContentIntro,
  OnBoardLayoutLogo,
  OnBoardLayoutRight,
  OnBoardLayoutRightContent,
  OnBoardLayoutRightContentTitle,
  WavingHandImg,
} from 'src/components/layouts/OnBoardLayout'
import { ButtonLink, ArrowButton } from 'src/components/buttons'
import { Text16, Text12 } from 'src/components/texts'
import DidSignForm from 'src/components/DidSignForm/DidSignForm'

import whitelogo from 'src/assets/logo/whitetextlogo.png'
import markimg from 'src/assets/icon/mark.png'
import wavinghand from 'src/assets/icon/wavinghand.png'

const SignDidPage: React.FC<InferMappedProps> = ({
  eProps,
  ...props
}: InferMappedProps) => {
  const [error, setError] = useState(false)

  const renderLeftSide = () => {
    if (error) {
      return (
        <OnBoardLayoutLeft style={{ background: '#FF5A5A' }}>
          <OnBoardLayoutLogo src={whitelogo} />
          <OnBoardLayoutLeftContent>
            <WavingHandImg src={markimg} />
            <OnBoardLayoutLeftContentTitle className='mt-18px'>
              Invalid order or wrong words
            </OnBoardLayoutLeftContentTitle>
            <OnBoardLayoutLeftContentDescription className='mt-25px'>
              It looks like your security words are in the wrong order or
              incorrect. Click on one to re-write or click the clear all button
              to start again.
            </OnBoardLayoutLeftContentDescription>
            <OnBoardLayoutLeftContentDescription className='mt-18px'>
              Unforutantly we can not help if you have forgotton your security
              words. In a decentralized world we all must be responsable for our
              identity.
            </OnBoardLayoutLeftContentDescription>
            <OnBoardLayoutLeftContentIntro className='my-25px'>
              Forgot your security words? Create a brand new profile here
            </OnBoardLayoutLeftContentIntro>
            <ButtonLink width={26} to='/sign/qr'>
              <ArrowButton />
            </ButtonLink>
          </OnBoardLayoutLeftContent>
        </OnBoardLayoutLeft>
      )
    }
    return (
      <OnBoardLayoutLeft>
        <OnBoardLayoutLogo src={whitelogo} />
        <OnBoardLayoutLeftContent>
          <WavingHandImg src={wavinghand} />
          <OnBoardLayoutLeftContentTitle className='mt-18px'>
            Welcome back
          </OnBoardLayoutLeftContentTitle>
          <OnBoardLayoutLeftContentDescription className='mt-25px'>
            Don’t forget to fill out as much of your profile as you can. You
            will earn badges and be set up for the future - where you can earn
            off your data, under your control!
          </OnBoardLayoutLeftContentDescription>
          <OnBoardLayoutLeftContentIntro className='my-25px'>
            Have an elastOS QR code? Sign in here
          </OnBoardLayoutLeftContentIntro>
          <ButtonLink width={26} to='/sign/qr'>
            <ArrowButton />
          </ButtonLink>
        </OnBoardLayoutLeftContent>
      </OnBoardLayoutLeft>
    )
  }

  return (
    <OnBoardLayout className={style['did-signin']}>
      {renderLeftSide()}
      <OnBoardLayoutRight>
        <OnBoardLayoutRightContent>
          <OnBoardLayoutRightContentTitle>
            Sign into with Decentrialized ID (DID)
          </OnBoardLayoutRightContentTitle>
          <Text16>Have an elastOS QR code? Sign in here</Text16>
          <IonRow style={{ marginTop: '12px' }}>
            <Text12>What are these?</Text12>
            <Text12>&nbsp;Help</Text12>
          </IonRow>
          <DidSignForm error={error} setError={setError} />
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
const withInjectedMode = injector(SignDidPage, {
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
