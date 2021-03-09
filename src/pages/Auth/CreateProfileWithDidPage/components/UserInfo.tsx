import React, { useState } from 'react'

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
import { ButtonWithLogo } from 'src/components/buttons'
import TextInput from 'src/components/inputs/TextInput'
import { Text16, TextLink } from 'src/components/texts'

import whitelogo from 'src/assets/logo/whitetextlogo.png'
import wavinghand from 'src/assets/icon/wavinghand.png'
import style from '../style.module.scss'

interface Props {
  setUserInfo: (fName: string, lName: string, email: string) => void
}

const UseDetailsForm: React.FC<Props> = ({ setUserInfo }) => {
  const [fname, setFName] = useState('')
  const [lname, setLName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const setField = (fieldName: string, fieldValue: string) => {
    setError('')
    if (fieldName === 'firstName') setFName(fieldValue)
    if (fieldName === 'lastName') setLName(fieldValue)
    if (fieldName === 'email') setEmail(fieldValue)
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
            onChange={(n) => setField('firstName', n)}
            placeholder='Enter your first name'
            hasError={error !== '' && fname === ''}
          />
          <TextInput
            value={lname}
            label='Last Name'
            onChange={(n) => setField('lastName', n)}
            placeholder='Enter your Last name'
            hasError={error !== '' && lname === ''}
          />
          <TextInput
            value={email}
            label='E-mail'
            onChange={(n) => setField('email', n)}
            placeholder='Enter your e-mail'
            hasError={error !== '' && email === ''}
            type='email'
          />

          <ButtonWithLogo
            text='Create your profile now'
            onClick={() => {
              if (fname === '' || lname === '' || email === '') {
                setError('You should fill all the blanks')
                return
              }
              setUserInfo(fname, lname, email)
            }}
          />
        </OnBoardLayoutRightContent>
      </OnBoardLayoutRight>
    </OnBoardLayout>
  )
}

export default UseDetailsForm
