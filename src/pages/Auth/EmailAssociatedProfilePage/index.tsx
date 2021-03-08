import React, { memo, useState, useEffect } from 'react'
import { StaticContext, RouteComponentProps, useHistory } from 'react-router'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { createStructuredSelector } from 'reselect'
import Modal from 'react-bootstrap/esm/Modal'
import Button from 'react-bootstrap/esm/Button'
import styled from 'styled-components'

import injector from 'src/baseplate/injectorWrap'
import { UserService } from 'src/services/user.service'
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
import PageLoading from 'src/components/layouts/PageLoading'
import whitelogo from 'src/assets/logo/whitetextlogo.png'
import eye from 'src/assets/icon/eye.png'

import { makeSelectCounter, makeSelectAjaxMsg } from './selectors'
import { incrementAction, getSimpleAjax } from './actions'
import { NameSpace } from './constants'
import reducer from './reducer'
import saga from './saga'
import {
  InferMappedProps,
  SubState,
  EmailUser,
  UserSessionProp,
  LocationState,
} from './types'
import { requestForceCreateUser } from './fetchapi'
import SignDid from './components/SignDid'
import style from './style.module.scss'

export interface ICreateUserResponse {
  data: {
    return_code: string
    did: string
  }
}

const DisplayText = styled(Text16)`
  text-align: center;
  color: green;
  margin-top: 8px;
`

const AssociatedProfilePage: React.FC<
  RouteComponentProps<{}, StaticContext, LocationState>
> = (props) => {
  const history = useHistory()
  const [showModal, setShowModal] = useState(false)
  const [user, setUser] = useState<EmailUser | null>(null)
  const [screen, setScreen] = useState('')
  const [associatedInfo, setAssociatedIfno] = useState<UserSessionProp | null>(
    null
  )
  const [loading, setLoading] = useState(false)
  const [displayText, setDisplayText] = useState('')

  useEffect(() => {
    if (!associatedInfo && props.location.state && props.location.state.fname) {
      const { fname, lname, email, users } = props.location.state
      setAssociatedIfno({
        fname,
        lname,
        email,
        users,
      })
      setUser(users[0])
    }
  }, [associatedInfo])

  if (!associatedInfo || !user) {
    return <PageLoading />
  } else if (screen === '/sign-did') {
    return <SignDid did={user.did} />
  }
  // else if (screen === '/generate-did') {
  //   return (
  //     <GenerateDid
  //       fname={associatedInfo.fname}
  //       lname={associatedInfo.lname}
  //       email={associatedInfo.email}
  //       request_token={associatedInfo.request_token}
  //       credential={associatedInfo.credential}
  //       service={associatedInfo.service}
  //     />
  //   )
  // }
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
            Sorry, your sign in information has already been linked with another
            profile. You have two options, sign in to the associated profile or
            create a new one.
          </OnBoardLayoutLeftContentDescription>
          <OnBoardLayoutLeftContentIntro className='my-25px'>
            Why has this happened? Help
          </OnBoardLayoutLeftContentIntro>
          <ButtonLink width={26} to='/create-why'>
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
              value={user._id}
              onChange={(event) => {
                const selectedId = (event.target as HTMLSelectElement).value
                const selectedIndex = associatedInfo.users.findIndex(
                  (item: EmailUser) => item._id === selectedId
                )
                setUser(associatedInfo.users[selectedIndex])
              }}
            >
              {associatedInfo &&
                associatedInfo.users &&
                associatedInfo.users.length > 0 &&
                associatedInfo.users.map((user: EmailUser) => (
                  <option key={user._id} value={user._id}>
                    {user.did || `${user._id}(Email not verified)`}
                  </option>
                ))}
            </select>
          </div>

          <Text16 style={{ marginTop: '17px' }}>
            Has been already linked to this social media account, sign into this
            profile below.
          </Text16>
          <ButtonWithLogo
            mode='dark'
            mt={32}
            text='Sign in to profile'
            onClick={() => {
              const signedUserDids = UserService.getSignedUsers()
              if (user.did === '') {
                setShowModal(true)
              } else if (
                signedUserDids &&
                signedUserDids.length > 0 &&
                signedUserDids.includes(user.did)
              ) {
                history.push({
                  pathname: '/unlock-user',
                  state: {
                    dids: [user.did],
                  },
                })
              } else {
                setScreen('/sign-did')
              }
            }}
          />
          <OnBoardLayoutRightContentTitle style={{ marginTop: '96px' }}>
            Create new profile
          </OnBoardLayoutRightContentTitle>
          <Text16>Use your email to create a new profile.</Text16>

          <ButtonWithLogo
            text={loading ? 'Creating your profile now' : 'Create new profile'}
            onClick={async () => {
              const { fname, lname, email } = associatedInfo
              setLoading(true)
              let response = (await requestForceCreateUser(
                fname,
                lname,
                email
              )) as ICreateUserResponse
              setLoading(false)
              if (
                response &&
                response.data &&
                response.data.return_code === 'WAITING_CONFIRMATION'
              ) {
                setDisplayText(
                  'Verification email is sent to you. Please confirm to complete your registration.'
                )
              }
            }}
            mt={42}
          />
          {displayText !== '' && <DisplayText>{displayText}</DisplayText>}
        </OnBoardLayoutRightContent>

        <Modal show={showModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Not verified user</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            This email is not verified yet. We already sent verification email,
            so please verify first and continue process.
          </Modal.Body>
          <Modal.Footer>
            <Button variant='primary' onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
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
