/**
 * Page
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { RouteComponentProps, withRouter, Redirect } from 'react-router-dom';
import { StaticContext } from 'react-router';
import { UserService } from 'src/services/user.service';

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
  ButtonLink,
  ButtonWithLogo,
  ArrowButton,
} from 'src/components/buttons';
import { Text16, Text12 } from 'src/components/texts';
import TextInput from 'src/components/inputs/TextInput';

import wavinghand from '../../../../assets/icon/wavinghand.png';
import whitelogo from '../../../../assets/logo/whitetextlogo.png';
import eye from '../../../../assets/icon/eye.png';

const DidAddress = styled.div`
  background: #edf2f7;
  border-radius: 6px;
  padding: 14.5px 16.5px;
  margin-top: 11px;

  font-weight: 500;
  font-size: 15px;
  line-height: 15px;
  color: #8492a6;
`;

const ErrorTxt = styled(Text12)`
  color: red;
  text-align: center;
  margin-top: 5px;
`;

type LocationState = {
  from: Location;
  did: string;
  id: string;
  firstName: string;
  lastName: string;
  request_token: String;
  email: string;
  service: string;
};

const AssociatedProfile: React.FC<
  RouteComponentProps<{}, StaticContext, LocationState>
> = (props) => {
  const {
    did,
    id,
    firstName,
    lastName,
    request_token,
    email,
    service,
  } = props.location.state;
  const [redirect, setRedirect] = useState('');
  const [sign, setSign] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (redirect === 'createAnother') {
    return (
      <Redirect
        to={{
          pathname: '/social_login_success',
          state: {
            id,
            firstName: firstName,
            lastName: lastName,
            request_token,
            email,
            service,
          },
        }}
      />
    );
  }
  if (redirect === 'profile') {
    return <Redirect to='/profile' />;
  }

  const continueWithPassword = () => {
    if (password === '') {
      setError('You should fill the password');
      return;
    } else {
      setError('');
      const res: any = UserService.LoginWithPassword(did, password);
      if (!res) {
        setError('User Not found secured by this password');
        return;
      } else {
        setRedirect('profile');
      }
    }
  };

  const renderLeftSide = () => {
    if (sign) {
      return (
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
      );
    }
    return (
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
          <ButtonLink width={26} to='/create/why'>
            <ArrowButton />
          </ButtonLink>
        </OnBoardLayoutLeftContent>
      </OnBoardLayoutLeft>
    );
  };

  const renderRightSide = () => {
    if (sign) {
      return (
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
              onClick={continueWithPassword}
            />
          </OnBoardLayoutRightContent>
        </OnBoardLayoutRight>
      );
    }
    return (
      <OnBoardLayoutRight>
        <OnBoardLayoutRightContent>
          <OnBoardLayoutRightContentTitle>
            Sign into the associated profile
          </OnBoardLayoutRightContentTitle>
          <Text16>Decentalized Identity (DID):</Text16>
          <DidAddress>{did}</DidAddress>
          <Text16 style={{ marginTop: '17px' }}>
            Has been already linked to this social media account, sign into this
            profile below.
          </Text16>
          <ButtonWithLogo
            mode='dark'
            mt={32}
            text='Sign in to profile'
            onClick={() => {
              setSign(true);
            }}
          />
          <OnBoardLayoutRightContentTitle style={{ marginTop: '96px' }}>
            Create new profile
          </OnBoardLayoutRightContentTitle>
          <Text16>
            Use your already associated social account to create a new profile.
          </Text16>

          <ButtonWithLogo
            text='Create new profile'
            onClick={() => {
              setRedirect('CreateAnother');
            }}
            mt={42}
          />
        </OnBoardLayoutRightContent>
      </OnBoardLayoutRight>
    );
  };

  return (
    <OnBoardLayout>
      {renderLeftSide()}
      {renderRightSide()}
    </OnBoardLayout>
  );
};

export default withRouter(AssociatedProfile);
