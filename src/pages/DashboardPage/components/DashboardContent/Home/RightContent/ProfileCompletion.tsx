import React from 'react';
import { IonCard, IonCardContent, IonCardHeader } from '@ionic/react';
import styled from 'styled-components';

export const CardTitle = styled.p`
  color: black;
  font-size: 18px;
  font-weight: bold;
  line-height: normal;
  margin: 0;
`;

export const CardSubTitle = styled.p`
  margin-top: 13px;
  font-size: 14px;
  line-height: 23px;
  color: #425466;
  max-width: 62%;
`;

export const MainCard = styled(IonCard)`
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 3px 8px -1px rgba(50, 50, 71, 0.05),
    0 0 1px 0 rgba(12, 26, 75, 0.24);
  margin: 12px;
  font-family: 'SF Pro Display';

  ion-card-header {
    padding: 21px;
    font-stretch: normal;
    font-style: normal;

    letter-spacing: -0.09px;
    text-align: left;
  }

  ion-card-content {
    padding: 0px 21px 21px 21px;
  }
`;

const ProfileCompletion: React.FC = ({}) => {
  return (
    <MainCard>
      <IonCardHeader>
        <CardTitle>Profile Completion</CardTitle>
        <CardSubTitle>Complete tasks and gain badges.</CardSubTitle>
      </IonCardHeader>
      <IonCardContent></IonCardContent>
    </MainCard>
  );
};

export default ProfileCompletion;
