import React, { useState } from 'react';
import { IonContent } from '@ionic/react';
import styled from 'styled-components';

import NewUserFlow from './NewUserFlow';
import LoginInWithEssential from './LoginInWithEssential';
import RecoverAccountFlow from './RecoverAccountFlow';

const DarkTransparentBG = styled(IonContent)`
  --background: url('../../assets/alphabg.png') no-repeat center top / cover;
`;

interface Props {
  sessionItem: ISessionItem;
}

const OnBoarding: React.FC<Props> = ({ sessionItem }) => {
  //   const [stage, setStage] = useState(1);
  const [type, setType] = useState(0); // 0: create new, 1: login with essentials, 2: recover account

  const onClose = (step: number) => {};

  const renderModals = () => {
    if (type === 0) {
      return <NewUserFlow sessionItem={sessionItem} close={onClose} />;
    } else if (type === 1) {
      return <LoginInWithEssential sessionItem={sessionItem} close={onClose} />;
    }
    return <RecoverAccountFlow sessionItem={sessionItem} close={onClose} />;
  };

  return <DarkTransparentBG>{renderModals()}</DarkTransparentBG>;
};

export default OnBoarding;
