import { IonRow } from '@ionic/react'
import { connect } from 'react-redux'
import { Redirect, useHistory } from 'react-router'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import injector from 'src/baseplate/injectorWrap'
import { makeSelectCounter, makeSelectAjaxMsg } from './selectors'
import { incrementAction, getSimpleAjax } from './actions'
import React, { memo, useState, useEffect } from 'react'
import style from './style.module.scss'
import { NameSpace } from './constants'
import reducer from './reducer'
import saga from './saga'
import { InferMappedProps, SubState } from './types'

import {
  OnBoardLayout,
  OnBoardLayoutRight,
  OnBoardLayoutRightContent,
  OnBoardLayoutRightContentTitle,
} from 'src/components/layouts/OnBoardLayout'

import { Text16, Text12 } from 'src/components/texts'
import DidSignForm from 'src/components/DidSign/DidSignForm'
import DidLeftSide from 'src/components/DidSign/DidLeftSide'
import { ISessionItem, UserService } from 'src/services/user.service'

const SignDidPage: React.FC<InferMappedProps> = ({
  eProps,
  ...props
}: InferMappedProps) => {
  const history = useHistory()
  const [error, setError] = useState(false)

  useEffect(() => {
    const dids =
      UserService.getSignedUsers().length > 0
        ? UserService.getSignedUsers()
        : []
    if (dids && dids.length > 0) {
      history.push({
        pathname: '/unlock-user',
        state: { dids },
      })
    }
  }, [])

  return (
    <OnBoardLayout className={style['did-signin']}>
      <DidLeftSide error={error} />
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
          <DidSignForm
            error={error}
            setError={setError}
            onSuccess={async (uDid: string) => {
              const res = await UserService.DIDlogin(uDid)
              console.log('=====>uDid', uDid, res)
              if (!res) {
                setError(true)
              } else {
                history.push({
                  pathname: '/set-password',
                  state: {
                    hiveHost: res.hiveHost,
                    userToken: res.userToken,
                    did: res.did,
                    firstName: res.firstName,
                    lastName: res.lastName,
                    accountType: res.accountType,
                    isDIDPublished: true, // this can be updated
                    onBoardingCompleted: true,
                  },
                })
              }
            }}
          />
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
