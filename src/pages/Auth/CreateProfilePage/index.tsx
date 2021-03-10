import React, { memo, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components'

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
import { SocialButton, ButtonWithLogo } from 'src/components/buttons'
import TextInput from 'src/components/inputs/TextInput'
import { Text16, TextLink } from 'src/components/texts'
import { AccountType, UserService } from 'src/services/user.service'

import { AlphaService } from 'src/services/alpha.service'
import TwitterApi from 'src/shared-base/api/twitter-api'
import injector from 'src/baseplate/injectorWrap'

import whitelogo from 'src/assets/logo/whitetextlogo.png'
import wavinghand from 'src/assets/icon/wavinghand.png'

import AlreadySignedUsers from './components/AlreadySignedUsers'
import { makeSelectCounter, makeSelectAjaxMsg } from './selectors'
import { incrementAction, getSimpleAjax } from './actions'
import style from './style.module.scss'
import { NameSpace } from './constants'
import reducer from './reducer'
import saga from './saga'
import { InferMappedProps, SubState } from './types'

import {
  requestCreateUser,
  requestGoogleLogin,
  requestLinkedinLogin,
  requestFacebookLogin,
  getUsersWithRegisteredEmail,
} from './fetchapi'

const ErrorText = styled(Text16)`
  text-align: center;
  color: red;
  margin-top: 8px;
`

const DisplayText = styled(Text16)`
  text-align: center;
  color: green;
  margin-top: 8px;
`

export interface ICreateUserResponse {
  data: {
    return_code: string
    did: string
  }
}

const CreateProfilePage: React.FC<InferMappedProps> = ({
  eProps,
  ...props
}: InferMappedProps) => {
  const [firstName, setfirstName] = useState('')
  const [lastName, setlastName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [displayText, setDisplayText] = useState('')
  const [error, setError] = useState('')
  const [signedUsers, setSignedUsers] = useState<string[]>([])
  const [mode, setMode] = useState(0) // 0: create new, 1: sign in using pre logged
  const history = useHistory()

  useEffect(() => {
    // UserService.clearPrevLocalData()
    AlphaService.isLocalCodeValid().then((isLocalCodeValid) => {
      console.log('is session valid', isLocalCodeValid)
      if (!isLocalCodeValid) {
        window.location.href = '/Alpha'
      }
    })
  }, [])

  useEffect(() => {
    const signedUserDids = UserService.getSignedUsers()
    if (signedUserDids.length > 0) {
      setSignedUsers(signedUserDids)
      setMode(1)
    }
  }, [])

  const createUser = async () => {
    if (!firstName || !lastName || !email) {
      setError('You should fill this field')
      return
    }
    setLoading(true)
    let response = (await requestCreateUser(
      firstName,
      lastName,
      email
    )) as ICreateUserResponse
    console.log('requestCreateUser api response', response)
    setLoading(false)
    if (
      response &&
      response.data &&
      response.data.return_code === 'WAITING_CONFIRMATION'
    ) {
      setDisplayText(
        'Verification email is sent to you. Please confirm to complete your registration.'
      )
    } else if (response.data.return_code === 'REGISTERED_USER') {
      const pUsers = await getUsersWithRegisteredEmail(email)

      history.push({
        pathname: '/associated-profile',
        state: {
          users: pUsers,
          firstName,
          lastName,
          email,
          request_token: '',
          service: AccountType.Email,
          credential: firstName + lastName + email,
        },
      })
    }
  }

  const setField = (fieldName: string, fieldValue: string) => {
    setError('')
    setDisplayText('')
    if (fieldName === 'firstName') setfirstName(fieldValue)
    if (fieldName === 'lastName') setlastName(fieldValue)
    if (fieldName === 'email') setEmail(fieldValue)
  }

  const sociallogin = async (socialType: string) => {
    if (socialType === 'twitter') {
      type MyType = { meta: string; data: { request_token: string } }
      // gets the linkedin auth endpoint
      const response = (await TwitterApi.GetRequestToken()) as MyType
      console.log(response.data.request_token)
      // redirects
      window.location.replace(
        `https://api.twitter.com/oauth/authorize?oauth_token=${response.data.request_token}`
      )
      return
    }

    type MyType = { meta: string; data: string }
    let url: MyType = {} as MyType

    if (socialType === 'google') {
      // gets the linkedin auth endpoint
      url = (await requestGoogleLogin()) as MyType
    } else if (socialType === 'facebook') {
      // gets the linkedin auth endpoint
      url = (await requestFacebookLogin()) as MyType
    } else if (socialType === 'linkedin') {
      // gets the linkedin auth endpoint
      url = (await requestLinkedinLogin()) as MyType
    }

    if (url) {
      console.log(url.data)
      window.location.href = url.data // redirects
    }
  }

  if (mode === 1) {
    return (
      <AlreadySignedUsers dids={signedUsers} changeMode={() => setMode(0)} />
    )
  }

  return (
    <OnBoardLayout className={style['create-profile']}>
      <OnBoardLayoutLeft>
        <OnBoardLayoutLogo src={whitelogo} />
        <OnBoardLayoutLeftContent>
          <WavingHandImg src={wavinghand} />
          <OnBoardLayoutLeftContentTitle className='mt-18px'>
            A better way to be online.
          </OnBoardLayoutLeftContentTitle>
          <OnBoardLayoutLeftContentDescription className='mt-25px'>
            Having multiple profiles is messy. Your personal information is
            copied and stored on every app. Profile gives you total control of
            your digital world, in one place. Finally unlock the power of your
            content online.
          </OnBoardLayoutLeftContentDescription>
          <OnBoardLayoutLeftContentIntro className='mt-25px mb-0'>
            Already have a profile?
          </OnBoardLayoutLeftContentIntro>
          <TextLink width={100} to='/sign-did'>
            Sign in Here
          </TextLink>
        </OnBoardLayoutLeftContent>
      </OnBoardLayoutLeft>
      <OnBoardLayoutRight>
        <OnBoardLayoutRightContent>
          <OnBoardLayoutRightContentTitle>
            Create your profile
          </OnBoardLayoutRightContentTitle>
          <Text16 style={{ marginBottom: '54px' }}>
            It’s free and easy to get set up.
          </Text16>
          <TextInput
            value={firstName}
            label='First Name'
            onChange={(n) => setField('firstName', n)}
            placeholder='Enter your first name'
            hasError={error !== '' && firstName === ''}
          />
          <TextInput
            value={lastName}
            label='Last Name'
            onChange={(n) => setField('lastName', n)}
            placeholder='Enter your Last name'
            hasError={error !== '' && lastName === ''}
          />
          <TextInput
            value={email}
            label='E-mail'
            onChange={(n) => setField('email', n)}
            placeholder='Enter your e-mail'
            hasError={error !== '' && email === ''}
            type='email'
          />

          {error !== '' && <ErrorText>{error}</ErrorText>}
          {displayText !== '' && <DisplayText>{displayText}</DisplayText>}

          <ButtonWithLogo
            text={loading ? 'Creating your profile now' : 'Create new profile'}
            onClick={createUser}
          />

          <div className={style['connect-divider']}>
            <hr className={style['connect-divider_line']} />
            <div className={style['connect-divider_txt']}>or connect with</div>
          </div>
          <div className={style['social-btn-group']}>
            <SocialButton
              type='linkedin'
              onClick={async () => await sociallogin('linkedin')}
            />
            <SocialButton
              type='google'
              onClick={async () => await sociallogin('google')}
            />
            <SocialButton
              type='twitter'
              onClick={async () => await sociallogin('twitter')}
            />
            <SocialButton
              type='facebook'
              onClick={async () => await sociallogin('facebook')}
            />
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
const withInjectedMode = injector(CreateProfilePage, {
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
