import React from 'react';
import styled from 'styled-components';
import { IonProgressBar } from '@ionic/react';

import logo from 'src/assets/new/logo.svg';

const LoadingContainer = styled.div`
  background: linear-gradient(252.79deg, #f4eeff -20.69%, #ffffff 151.16%);
  backdrop-filter: blur(10px);

  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 3;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  .progress-bar-indeterminate {
    height: 8px;
    border-radius: 4px;
  }

  .progress-comp {
    --background: #f0e0ff;
    --progress-background: #9f30fe;
  }
  img {
    width: 267px;
    height: 96px;
    disaply: block;
    margin: 0 auto 33px;
  }

  p {
    font-size: 14px;
    line-height: 160%;
    text-align: center;
    color: #a161f3;
    margin-top: 30px;
  }
`;

interface Props {
  loadingText?: string;
}

const PageLoading: React.FC<Props> = ({
  loadingText = 'Your Web3 Universe Awaits...'
}) => {
  return (
    <LoadingContainer>
      <Content>
        <img src={logo} alt="logo" />
        <IonProgressBar type="indeterminate" class="progress-comp" />
        <p>{loadingText}</p>
      </Content>
    </LoadingContainer>
  );
};

export default PageLoading;
