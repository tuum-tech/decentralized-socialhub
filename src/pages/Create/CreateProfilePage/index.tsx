/**
 * Page
 */

import React, { useState } from 'react';

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
} from 'src/components/layouts/OnBoardLayout';

import {
  SocialButton,
  ButtonWithLogo,
  ArrowButton,
  ButtonLink,
} from 'src/components/buttons';

import TextInput from 'src/components/inputs/TextInput';
import { Text16 } from 'src/components/texts';

import whitelogo from '../../../assets/logo/whitetextlogo.png';
import wavinghand from '../../../assets/icon/wavinghand.png';

import style from './style.module.scss';
import { requestCreateUser } from './fetchapi';
import { Redirect } from 'react-router';
import Modal from 'react-bootstrap/esm/Modal';
import Button from 'react-bootstrap/esm/Button';


export interface ICreateUserResponse {
  "data": {
    "return_code": string,
    "did": string
  }
}

const CreateProfile: React.FC = () => {
  const [fname, setFName] = useState('');
  const [lname, setLName] = useState('');
  const [email, setEmail] = useState('');
  const [showModal, setShowModal] = useState(false);

  const createUser = async () => {
    let response = await requestCreateUser(fname, lname, email) as ICreateUserResponse;
    if (response.data.return_code === "REGISTERED_USER") {
      return (<Redirect
        to={{
          pathname: "/create/associated-profile",
          state: { did: response.data.did }
        }}
      />)
    }

    if (response.data.return_code === "WAITING_CONFIRMATION") {
      setShowModal(true);
      setEmail("");
      setFName("");
      setLName("");
    }
  }

  const handleClose = async () => {
    setShowModal(false);
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
          <OnBoardLayoutLeftContentIntro className='my-25px'>
            Already have a profile? Sign in
          </OnBoardLayoutLeftContentIntro>
          <ButtonLink width={26} to='/sign/did'>
            <ArrowButton />
          </ButtonLink>
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
          />
          <TextInput
            value={lname}
            label='Last Name'
            onChange={(n) => setLName(n)}
            placeholder='Enter your Last name'
          />
          <TextInput
            value={email}
            label='E-mail'
            onChange={(n) => setEmail(n)}
            placeholder='Enter your e-mail'
          />

          <ButtonWithLogo text='Create new profile' onClick={createUser} />

          <div className={style['connect-divider']}>
            <hr className={style['connect-divider_line']} />
            <div className={style['connect-divider_txt']}>or connect with</div>
          </div>
          <div className={style['social-btn-group']}>
            <SocialButton type='linkedin' />
            <SocialButton type='google' />
            <SocialButton type='twitter' />
            <SocialButton type='facebook' />
          </div>

          <Modal show={showModal} centered>
            <Modal.Header closeButton>
              <Modal.Title>Request Sent</Modal.Title>
            </Modal.Header>
            <Modal.Body>We sent you an email! please follow the email instructions to proceed.</Modal.Body>
            <Modal.Footer>
              <Button variant="primary" onClick={handleClose}>
                Close
                </Button>
            </Modal.Footer>
          </Modal>
        </OnBoardLayoutRightContent>
      </OnBoardLayoutRight>
    </OnBoardLayout>
  );
};

export default CreateProfile;
