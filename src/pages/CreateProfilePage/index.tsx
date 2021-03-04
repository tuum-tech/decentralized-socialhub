import React, { memo, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import Modal from 'react-bootstrap/esm/Modal'
import Button from 'react-bootstrap/esm/Button'

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
import whitelogo from 'src/assets/logo/whitetextlogo.png'
import wavinghand from 'src/assets/icon/wavinghand.png'
import { AlphaService } from 'src/services/alpha.service'
import TwitterApi from 'src/shared-base/api/twitter-api'
import injector from 'src/baseplate/injectorWrap'

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
} from './fetchapi'

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
  const [fname, setFName] = useState('')
  const [lname, setLName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState('')
  const history = useHistory()

  useEffect(() => {
    AlphaService.isLocalCodeValid().then((isLocalCodeValid) => {
      console.log('is session valid', isLocalCodeValid)
      if (!isLocalCodeValid) {
        window.location.href = '/Alpha'
      }
    })
  })

  const createUser = async () => {
    if (!fname || !lname || !email) {
      setError('You should fill this field')
      return
    }
    setLoading(true)
    let response = (await requestCreateUser(
      fname,
      lname,
      email
    )) as ICreateUserResponse
    console.log('=====>response', response)
    setLoading(false)
    if (
      response &&
      response.data &&
      response.data.return_code === 'WAITING_CONFIRMATION'
    ) {
      setShowModal(true)
      setEmail('')
      setFName('')
      setLName('')
      return
    }

    if (response.data.return_code === 'REGISTERED_USER') {
      history.push({
        pathname: '/a-profile',
        state: { did: response.data.did },
      })
    }
  }

  const handleClose = async () => {
    setShowModal(false)
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
            value={fname}
            label='First Name'
            onChange={(n) => setFName(n)}
            placeholder='Enter your first name'
            hasError={error !== '' && fname === ''}
          />
          <TextInput
            value={lname}
            label='Last Name'
            onChange={(n) => setLName(n)}
            placeholder='Enter your Last name'
            hasError={error !== '' && lname === ''}
          />
          <TextInput
            value={email}
            label='E-mail'
            onChange={(n) => setEmail(n)}
            placeholder='Enter your e-mail'
            hasError={error !== '' && email === ''}
            type='email'
          />

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

          <Modal show={showModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>Request Sent</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              We sent you an email! please follow the email instructions to
              proceed.
            </Modal.Body>
            <Modal.Footer>
              <Button variant='primary' onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
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
