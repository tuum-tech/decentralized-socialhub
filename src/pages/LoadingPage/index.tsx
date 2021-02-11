/**
 * Page
 */

import React from 'react';
import styled from 'styled-components';
import { IonImg } from '@ionic/react';

import whitelogo from '../../assets/logo/whitetextlogo.png';
import loadingimg from '../../assets/icon/loading.png';

const LoadingContainer = styled.div`
  background: #4c6fff;
  width: 100%;
  min-height: 100%;
`;

const WhiteLogo = styled(IonImg)`
  width: 126.6px;
  position: absolute;
  left: 39.95px;
  top: 35.23px;
`;

const Loading = styled.div`
  width: 174px;
  position: absolute;
  top: calc(50% - 87px);
  left: calc(50% - 73px);
`;

const Indicator = styled(IonImg)`
  width: 100%;
`;

const LoadingText = styled.p`
  margin-top: 69px;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  line-height: 30px;
  text-align: center;
  color: #ffffff;
  width: 100%;
`;

const LoadingPage: React.FC = () => {
  return (
    <LoadingContainer>
      <WhiteLogo src={whitelogo} />
      <Loading>
        <Indicator src={loadingimg} />
        <LoadingText>Loading…</LoadingText>
      </Loading>
    </LoadingContainer>
  );
};

export default LoadingPage;
