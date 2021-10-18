import React from 'react';

import {
  OnBoardLayoutLeft,
  OnBoardLayoutLeftContent,
  OnBoardLayoutLeftContentTitle,
  OnBoardLayoutLeftContentDescription,
  OnBoardLayoutLeftContentIntro,
  OnBoardLayoutLogo,
  WavingHandImg
} from 'src/components/layouts/OnBoardLayout';
import { SignInButton } from 'src/elements/buttons';

import whitelogo from 'src/assets/logo/whitetextlogo.png';
import markimg from 'src/assets/icon/mark.png';
import wavinghand from 'src/assets/icon/wavinghand.png';
import FooterLinks, {
  Footer
} from 'src/components/layouts/OnBoardLayout/FooterLinks';

interface Props {
  error?: boolean;
}

const DidLeftSide: React.FC<Props> = ({ error = false }) => {
  if (error) {
    return (
      <OnBoardLayoutLeft style={{ background: '#FF5A5A' }}>
        <OnBoardLayoutLogo src={whitelogo} />
        <OnBoardLayoutLeftContent>
          <WavingHandImg src={markimg} />
          <OnBoardLayoutLeftContentTitle className="mt-18px">
            Invalid order or wrong words
          </OnBoardLayoutLeftContentTitle>
          <OnBoardLayoutLeftContentDescription className="mt-25px">
            It looks like your security words are in the wrong order or
            incorrect. Click on one to re-write or click the clear all button to
            start again.
          </OnBoardLayoutLeftContentDescription>
          <OnBoardLayoutLeftContentDescription className="mt-18px">
            Unfortunately, we can not help if you have forgotton your security
            words. In a decentralized world we all must be responsible for our
            identity.
          </OnBoardLayoutLeftContentDescription>
          <OnBoardLayoutLeftContentIntro
            style={{ marginTop: '25px', marginBottom: '5px' }}
          >
            New to Profile?
          </OnBoardLayoutLeftContentIntro>
          <SignInButton width={160} to="/create-profile">
            Create a new Profile
          </SignInButton>
          <OnBoardLayoutLeftContentIntro
            style={{ marginTop: '25px', marginBottom: '5px' }}
          >
            Using Essentials?
          </OnBoardLayoutLeftContentIntro>
          <SignInButton disabled={true} width={180} to="/sign-qr">
            Sign In (Coming Soon)
          </SignInButton>
        </OnBoardLayoutLeftContent>
      </OnBoardLayoutLeft>
    );
  }
  return (
    <OnBoardLayoutLeft>
      <OnBoardLayoutLogo src={whitelogo} />
      <OnBoardLayoutLeftContent>
        <WavingHandImg src={wavinghand} />
        <OnBoardLayoutLeftContentTitle className="mt-18px">
          Welcome back
        </OnBoardLayoutLeftContentTitle>
        <OnBoardLayoutLeftContentDescription className="mt-25px">
          Don’t forget to fill out as much of your profile as you can. You will
          earn badges and be set up for the future - where you can earn off your
          data, under your control!
        </OnBoardLayoutLeftContentDescription>
        <OnBoardLayoutLeftContentIntro
          style={{ marginTop: '38px', marginBottom: '5px' }}
        >
          New to Profile?
        </OnBoardLayoutLeftContentIntro>
        <SignInButton width={160} to="/create-profile">
          Create a new Profile
        </SignInButton>
        <OnBoardLayoutLeftContentIntro
          style={{ marginTop: '44px', marginBottom: '5px' }}
        >
          Using Essentials?
        </OnBoardLayoutLeftContentIntro>
        <SignInButton disabled={true} width={180} to="/sign-qr">
          Sign In (Coming Soon)
        </SignInButton>
        <Footer>
          <FooterLinks></FooterLinks>
        </Footer>
      </OnBoardLayoutLeftContent>
    </OnBoardLayoutLeft>
  );
};

export default DidLeftSide;
