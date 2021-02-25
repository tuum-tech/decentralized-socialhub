import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import injector from 'src/baseplate/injectorWrap'
import { makeSelectCounter, makeSelectAjaxMsg } from './selectors'
import { incrementAction, getSimpleAjax } from './actions'
import React, { memo, useState } from 'react'

import {
  StaticContext,
  Redirect,
  RouteComponentProps,
  useHistory,
} from 'react-router'

import { UserService, AccountType } from 'src/services/user.service'
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
import { ButtonLink, ButtonWithLogo, ArrowButton } from 'src/components/buttons'
import { Text16 } from 'src/components/texts'

import whitelogo from 'src/assets/logo/whitetextlogo.png'
import eye from 'src/assets/icon/eye.png'

import style from './style.module.scss'
import { NameSpace } from './constants'
import reducer from './reducer'
import saga from './saga'
import { InferMappedProps, SubState } from './types'

import EnterPassword from './components/EnterPassword'
import SignWithDid from './components/SignWithDid'
import GenerateDid from './components/GenerateDid'

export type LocationState = {
  from: Location
  id: string
  dids: Array<string>
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

const AssociatedProfilePage: React.FC<
  RouteComponentProps<{}, StaticContext, LocationState>
> = (props) => {
  const history = useHistory()

  const {
    fname,
    lname,
    email,
    dids,
    id,
    request_token,
    service,
    credential,
  } = props.location.state
  const [did, setDid] = useState(dids && dids.length > 0 ? dids[0] : '')
  const [screen, setScreen] = useState('')

  const getRedirect = () => {
    if (screen === '/enter-password') {
      return <EnterPassword did={did} />
    } else if (screen === '/sign-did') {
      return <SignWithDid />
    } else if (screen === '/generate-did') {
      return (
        <GenerateDid
          id={id}
          fname={fname}
          lname={lname}
          email={email}
          request_token={request_token}
          credential={credential}
          service={service}
        />
      )
    }
    return (
      <OnBoardLayout>
        <OnBoardLayoutLeft>
          <OnBoardLayoutLogo src={whitelogo} />
          <OnBoardLayoutLeftContent>
            <WavingHandImg src={eye} />
            <OnBoardLayoutLeftContentTitle className='mt-18px'>
              We have seen your social account before.
            </OnBoardLayoutLeftContentTitle>
            <OnBoardLayoutLeftContentDescription className='mt-25px'>
              Sorry, your sign in information has already been linked with
              another profile. You have two options, sign in to the associated
              profile or create a new one.
            </OnBoardLayoutLeftContentDescription>
            <OnBoardLayoutLeftContentIntro className='my-25px'>
              Why has this happened? Help
            </OnBoardLayoutLeftContentIntro>
            <ButtonLink width={26} to='/create/why'>
              <ArrowButton />
            </ButtonLink>
          </OnBoardLayoutLeftContent>
        </OnBoardLayoutLeft>
        <OnBoardLayoutRight>
          <OnBoardLayoutRightContent>
            <OnBoardLayoutRightContentTitle>
              Sign into the associated profile
            </OnBoardLayoutRightContentTitle>
            <Text16>Decentalized Identity (DID):</Text16>
            <div className={style['did-select']}>
              <select
                value={did}
                onChange={(event) =>
                  setDid((event.target as HTMLSelectElement).value)
                }
              >
                {dids &&
                  dids.length > 0 &&
                  dids.map((userDid: string, index: number) => (
                    <option key={userDid} value={userDid}>
                      {userDid}
                    </option>
                  ))}
              </select>
            </div>

            <Text16 style={{ marginTop: '17px' }}>
              Has been already linked to this social media account, sign into
              this profile below.
            </Text16>
            <ButtonWithLogo
              mode='dark'
              mt={32}
              text='Sign in to profile'
              onClick={() => {
                const signedUserDids = UserService.getSignedUsers()
                if (
                  signedUserDids &&
                  signedUserDids.length > 0 &&
                  signedUserDids.includes(`did:elastos:${did}`)
                ) {
                  setScreen('/enter-password')
                } else {
                  setScreen('/sign-did')
                }
              }}
            />
            <OnBoardLayoutRightContentTitle style={{ marginTop: '96px' }}>
              Create new profile
            </OnBoardLayoutRightContentTitle>
            <Text16>
              Use your already associated social account to create a new
              profile.
            </Text16>

            <ButtonWithLogo
              text='Create new profile'
              onClick={() => {
                setScreen('/generate-did')
              }}
              mt={42}
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
const withInjectedMode = injector(AssociatedProfilePage, {
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
