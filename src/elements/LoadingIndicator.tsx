import React from 'react';
import styled from 'styled-components';
import { IonImg } from '@ionic/react';

import loadingimg from 'src/assets/icon/loading.png';

const LoadingContainer = styled.div`
  background: rgba(0, 0, 0, 0.62);
  backdrop-filter: blur(10px);
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 3;
`;

const Loading = styled.div`
  width: 300px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const Indicator = styled(IonImg)`
  width: 174px;
  margin: 0 auto;
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

interface Props {
  loadingText?: string;
}

const LoadingIndicator: React.FC<Props> = ({ loadingText = 'Loading...' }) => {
  return (
    <LoadingContainer>
      <Loading>
        <Indicator src={loadingimg} />
        <LoadingText>{loadingText}</LoadingText>
      </Loading>
    </LoadingContainer>
  );
};

export default LoadingIndicator;
