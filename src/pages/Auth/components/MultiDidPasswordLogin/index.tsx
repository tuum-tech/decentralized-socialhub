import React, { useState } from 'react'
import { useHistory } from 'react-router'
import styled from 'styled-components'

import {
  OnBoardLayout,
  OnBoardLayoutLeft,
  OnBoardLayoutLeftContent,
  OnBoardLayoutLeftContentTitle,
  OnBoardLayoutLeftContentDescription,
  OnBoardLayoutLogo,
  OnBoardLayoutRight,
  OnBoardLayoutRightContent,
  OnBoardLayoutRightContentTitle,
  WavingHandImg,
} from 'src/components/layouts/OnBoardLayout'
import FieldDivider from '../FieldDivider'
import { ButtonWithLogo } from 'src/components/buttons'
import { Text16, ErrorTxt } from 'src/components/texts'
import whitelogo from 'src/assets/logo/whitetextlogo.png'
import eye from 'src/assets/icon/eye.png'
import TextInput from 'src/components/inputs/TextInput'
import { UserService } from 'src/services/user.service'

const DidSelectComp = styled.div`
  background: #edf2f7;
  border-radius: 6px;
  padding: 14.5px 16.5px;
  margin-top: 11px;

  font-weight: 500;
  font-size: 15px;
  line-height: 15px;
  color: #8492a6;

  select {
    border: none;
    outline: none;
    width: 100%;
    background: transparent;
  }
`

interface Props {
  changeMode: () => void
  dids: Array<string>
}

const MultiDidPasswordLogin: React.FC<Props> = ({ dids, changeMode }) => {
  const history = useHistory()
  const [did, setDid] = useState(dids[0])
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  return (
    <OnBoardLayout>
      <OnBoardLayoutLeft>
        <OnBoardLayoutLogo src={whitelogo} />
        <OnBoardLayoutLeftContent>
          <WavingHandImg src={eye} />
          <OnBoardLayoutLeftContentTitle className='mt-18px'>
            We have seen your accounts before.
          </OnBoardLayoutLeftContentTitle>
          <OnBoardLayoutLeftContentDescription className='mt-25px'>
            You can select and login using the password you set
          </OnBoardLayoutLeftContentDescription>
        </OnBoardLayoutLeftContent>
      </OnBoardLayoutLeft>
      <OnBoardLayoutRight>
        <OnBoardLayoutRightContent>
          <OnBoardLayoutRightContentTitle>
            Sign in using the previous logged info
          </OnBoardLayoutRightContentTitle>
          <Text16>Decentralized Identity (DID):</Text16>
          <DidSelectComp>
            <select
              value={did}
              onChange={(event) => {
                setDid((event.target as HTMLSelectElement).value)
              }}
            >
              {dids.map((userDid: string) => (
                <option key={userDid} value={userDid}>
                  {userDid}
                </option>
              ))}
            </select>
          </DidSelectComp>
          <TextInput
            value={password}
            type='password'
            label='Password'
            onChange={(n) => {
              setError('')
              setPassword(n)
            }}
            placeholder='Enter your password'
          />
          {error !== '' && <ErrorTxt className='mt-3'>{error}</ErrorTxt>}
          <ButtonWithLogo
            mode='dark'
            mt={20}
            text='Sign in to profile'
            onClick={() => {
              const res = UserService.UnLockWithDIDAndPWd(dids[0], password)
              if (res) {
                window.location.href = '/profile'
                return
              } else {
                setError('User Not found secured by this password')
              }
            }}
          />

          <FieldDivider mt={80} />
          <ButtonWithLogo
            text='Create your profile now'
            onClick={changeMode}
            mt={42}
          />
        </OnBoardLayoutRightContent>
      </OnBoardLayoutRight>
    </OnBoardLayout>
  )
}

export default MultiDidPasswordLogin
