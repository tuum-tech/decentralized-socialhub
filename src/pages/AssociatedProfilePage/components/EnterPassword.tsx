import React, { useState } from 'react'

import { Redirect } from 'react-router'
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

interface Props {
  did: string
}

const EnterPassword: React.FC<Props> = (props) => {
  /**
   * Direct method implementation without SAGA
   * This was to show you dont need to put everything to global state
   * incoming from Server API calls. Maintain a local state.
   */
  const { did } = props

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

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
                  window.location.href = '/profile'
                }
              }
            }}
          />
        </OnBoardLayoutRightContent>
      </OnBoardLayoutRight>
    </OnBoardLayout>
  )
}

export default EnterPassword
