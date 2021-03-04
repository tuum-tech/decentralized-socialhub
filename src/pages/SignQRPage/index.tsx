import { IonImg } from '@ionic/react'
import React, { memo } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import { incrementAction, getSimpleAjax } from './actions'

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
import { Text16, TextLink } from 'src/components/texts'

import whitelogo from 'src/assets/logo/whitetextlogo.png'
import phone from 'src/assets/icon/phone.png'
import injector from 'src/baseplate/injectorWrap'

import { makeSelectCounter, makeSelectAjaxMsg } from './selectors'
import style from './style.module.scss'
import { NameSpace } from './constants'
import reducer from './reducer'
import saga from './saga'
import { InferMappedProps, SubState } from './types'

const SignQRPage: React.FC<InferMappedProps> = ({
  eProps,
  ...props
}: InferMappedProps) => {
  /**
   * Direct method implementation without SAGA
   * This was to show you dont need to put everything to global state
   * incoming from Server API calls. Maintain a local state.
   */

  return (
    <OnBoardLayout className={style['qr-sign']}>
      <OnBoardLayoutLeft>
        <OnBoardLayoutLogo src={whitelogo} />
        <OnBoardLayoutLeftContent>
          <WavingHandImg src={phone} />
          <OnBoardLayoutLeftContentTitle className='mt-18px'>
            elastOS Sign in
          </OnBoardLayoutLeftContentTitle>
          <OnBoardLayoutLeftContentIntro
            style={{ marginTop: '38px', marginBottom: '5px' }}
          >
            New to Profile?
          </OnBoardLayoutLeftContentIntro>
          <TextLink width={100} to='/create-profile'>
            Craete a new Profile
          </TextLink>
          <OnBoardLayoutLeftContentIntro
            style={{ marginTop: '44px', marginBottom: '5px' }}
          >
            Have secrete Mnemonic words?
          </OnBoardLayoutLeftContentIntro>
          <TextLink width={100} to='/sign-did'>
            Sign in here
          </TextLink>
        </OnBoardLayoutLeftContent>
      </OnBoardLayoutLeft>
      <OnBoardLayoutRight>
        <OnBoardLayoutRightContent>
          <OnBoardLayoutRightContentTitle>
            QR Code
          </OnBoardLayoutRightContentTitle>
          <Text16>Scan the QR code with your elastOS application</Text16>
          <div className={style['qr-frame']}>
            <IonImg src='../../assets/qr-code.svg' />
            <Text16>
              QR code expires in <span>00:30</span>
            </Text16>
          </div>
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
const withInjectedMode = injector(SignQRPage, {
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
