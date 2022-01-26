import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { IonPage, IonImg } from '@ionic/react';

import { Text28 } from 'src/elements/texts';
import leftBg from 'src/assets/new/auth/left_bg.png';
import rightBg from 'src/assets/new/auth/right_bg.png';
import logo from 'src/assets/new/logo.png';

export const OnBoardLayoutLogo = () => (
  <Link to="/">
    <IonImg style={{ width: '94px', margin: '35px 39px' }} src={logo} />
  </Link>
);

//////// Left

export const OnBoardLayout = styled(IonPage)`
  font-style: normal;
  height: 100%;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 40% 60%;

  @media only screen and (max-width: 980px) {
    display: block;
  }
`;

export const OnBoardLayoutLeft = styled.div`
  border-radius: 0px;
  color: #ffffff;
  position: relative;

  background-size: cover;
  background-repeat: no-repeat;
  background-image: url(${leftBg});

  @media only screen and (max-width: 980px) {
    display: none;
  }
`;

export const OnBoardLayoutLeftContent = styled.div`
  width: 100%;
  max-width: 70%;
  display: block;
  margin: 132px auto;
`;

/////// Right
export const OnBoardLayoutRight = styled.div`
  background: #fbfbfd;
  border-radius: 0px;
  display: flex;
  align-items: center;
  justify-content: center;

  background-size: cover;
  background-repeat: no-repeat;
  background-image: url(${rightBg});

  @media only screen and (max-width: 980px) {
    display: block;
    height: 100%;
  }
`;

export const OnBoardLayoutRightContent = styled.div`
  width: 62%;
  margin: 161px auto;
  color: var(--txt-heading-dark);
  margin-left: auto;
  margin-right: auto;

  padding-top: 50px;
  padding-bottom: 50px;
  margin-top: 0;

  position: relative;
  min-height: 80vh;

  @media only screen and (max-width: 980px) {
    width: 90%;
  }
`;

export const OnBoardLayoutRightContentTitle = styled(Text28)`
  margin-bottom: 12px;
`;

export const WavingHandImg = styled(IonImg)`
  width: 38px;
`;
