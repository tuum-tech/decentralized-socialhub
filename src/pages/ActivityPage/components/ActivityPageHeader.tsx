import React from 'react';
import { IonList, IonLabel, IonItem } from '@ionic/react';
import styled from 'styled-components';

import { TabsContainer } from 'src/components/profile/ProfileComponent/PublicProfileTabs';

export const Header = styled.div`
  width: 100%;
  height: 83px;
  background: #fff;
  padding: 27px 25px 20px 48px;
`;

export const PageTitle = styled.h2`
  font-family: 'SF Pro Display';
  font-size: 28px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.36;
  letter-spacing: normal;
  text-align: left;
  color: #27272e;
`;

export const ActivityTabsContainer = styled(TabsContainer)`
  ion-list,
  .tab-item {
    background-color: transparent;
    --background: transparent;
    --border-color: transparent;
  }
`;

export const BlueButton = styled.button`
  height: 40px;

  padding: 12px 20px;
  border-radius: 9px;
  background-color: #4c6fff;

  font-family: 'SF Pro Display';
  font-size: 12px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  text-align: left;
  color: #ffffff;

  margin: 0 20px 0 auto;
`;

interface ActivityPageHeaderProps {
  active: string;
  setActive: (avtive: string) => void;
  newVerificationClicked: () => void;
  myverifications: number;
  verificationRequests: number;
}

const ActivityPageHeaderContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ActivityPageHeader: React.FC<ActivityPageHeaderProps> = ({
  active,
  setActive,
  newVerificationClicked,
  myverifications,
  verificationRequests
}) => {
  return (
    <ActivityPageHeaderContainer>
      <IonList>
        <IonItem
          className={(active === 'timeline' ? 'tab-active' : '') + ' tab-item'}
          onClick={() => setActive('timeline')}
        >
          <IonLabel className="tab-label">Timeline</IonLabel>
        </IonItem>
        <IonItem
          className={
            (active === 'myrequests' ? 'tab-active' : '') + ' tab-item'
          }
          onClick={() => setActive('myrequests')}
        >
          <IonLabel className="tab-label">My Requests</IonLabel>
        </IonItem>
        <IonItem
          className={
            (active === 'verificationrequests' ? 'tab-active' : '') +
            ' tab-item'
          }
          onClick={() => setActive('verificationrequests')}
        >
          <IonLabel className="tab-label">Verification Requests</IonLabel>
        </IonItem>
      </IonList>
      {active === 'myrequests' && (
        <BlueButton onClick={newVerificationClicked}>
          New Verification Request
        </BlueButton>
      )}
    </ActivityPageHeaderContainer>
  );
};

export default ActivityPageHeader;
