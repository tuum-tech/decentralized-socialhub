import React, { useState } from 'react'
import { StaticContext, RouteComponentProps } from 'react-router'
import styled from 'styled-components'

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
import { ButtonLink, ArrowButton, ButtonWithLogo } from 'src/components/buttons'
import { Text12 } from 'src/components/texts'
import TextInput from 'src/components/inputs/TextInput'
import { UserService } from 'src/services/user.service'
import wavinghand from 'src/assets/icon/wavinghand.png'
import whitelogo from 'src/assets/logo/whitetextlogo.png'

import { LocationState } from './types'

const ErrorTxt = styled(Text12)`
  color: red;
  text-align: center;
  margin-top: 5px;
`

const UnlockUserPage: React.FC<
  RouteComponentProps<{}, StaticContext, LocationState>
> = (props) => {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [dids, setDids] = useState(
    props.location.state && props.location.state.dids
      ? props.location.state.dids
      : []
  )

  const unlockUser = () => {
    if (!dids || dids.length === 0) return
    let res = null
    if (dids.length === 1) {
      res = UserService.Login(dids[0], password)
    } else {
      for (let i = 0; i < dids.length; i++) {
        const did = dids[i]
        res = UserService.Login(did, password)
      }
    }

    if (res) {
      window.location.href = '/profile'
      return
    } else {
      setError('User Not found secured by this password')
    }
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
          <ButtonLink width={26} to='/forgot-password'>
            <ArrowButton />
          </ButtonLink>
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
                unlockUser()
              }
            }}
          />
        </OnBoardLayoutRightContent>
      </OnBoardLayoutRight>
    </OnBoardLayout>
  )
}

export default UnlockUserPage
