/**
 * Page
 */

import React from 'react';
import styled from 'styled-components';

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
import { Text16 } from 'src/components/texts';

import whitelogo from '../../../assets/logo/whitetextlogo.png';
import eye from '../../../assets/icon/eye.png';

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

const CreateProfile: React.FC = () => {
  const didAddress = '39fgdfkdsflgl404503400fgkdfgll45030450fgkkdflgl';

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
          <DidAddress>{didAddress}</DidAddress>
          <Text16 style={{ marginTop: '17px' }}>
            Has been already linked to this social media account, sign into this
            profile below.
          </Text16>
          <ButtonWithLogo
            mode='dark'
            mt={32}
            text='Sign in to profile'
            onClick={() => {}}
          />

          <OnBoardLayoutRightContentTitle style={{ marginTop: '96px' }}>
            Create new profile
          </OnBoardLayoutRightContentTitle>
          <Text16>
            Use your already associated social account to create a new profile.
          </Text16>

          <ButtonWithLogo
            text='Create new profile'
            onClick={() => {}}
            mt={42}
          />
        </OnBoardLayoutRightContent>
      </OnBoardLayoutRight>
    </OnBoardLayout>
  );
};

export default CreateProfile;
