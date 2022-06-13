import React from 'react';
import { IonList, IonLabel } from '@ionic/react';
import styled from 'styled-components';

import { TabsContainer } from 'src/components/profile/ProfileComponent/PublicProfileTabs';
import { DefaultButton } from 'src/elements-v2/buttons';
import { TabItem } from 'src/elements-v2/tabs';

export const ActivityTabsContainer = styled(TabsContainer)`
  ion-list,
  .tab-item {
    background-color: transparent;
    --background: transparent;
    --border-color: transparent;
  }
`;

interface ActivityPageHeaderProps {
  active: string;
  setActive: (avtive: string) => void;
  newVerificationClicked: () => void;
  myverifications: number;
  verificationRequests: number;
  referrals: number;
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
  verificationRequests,
  referrals
}) => {
  return (
    <ActivityPageHeaderContainer>
      <IonList className="pl-4">
        <TabItem
          active={active === 'timeline'}
          onClick={() => setActive('timeline')}
        >
          <IonLabel>Timeline</IonLabel>
        </TabItem>
        <TabItem
          active={active === 'myrequests'}
          onClick={() => setActive('myrequests')}
        >
          <IonLabel>My Requests</IonLabel>
        </TabItem>
        <TabItem
          active={active === 'verificationrequests'}
          onClick={() => setActive('verificationrequests')}
        >
          <IonLabel>Verification Requests</IonLabel>
          {verificationRequests > 0 && (
            <DefaultButton
              variant="contained"
              btnColor="primary-gradient"
              style={{
                borderRadius: 9,
                padding: '0px 10px',
                width: 34,
                height: 21,
                marginLeft: 4
              }}
            >
              {verificationRequests}
            </DefaultButton>
          )}
        </TabItem>

        <TabItem
          active={active === 'referrals'}
          onClick={() => setActive('referrals')}
        >
          <IonLabel>Referrals</IonLabel>
          {referrals > 0 && (
            <DefaultButton
              variant="contained"
              btnColor="primary-gradient"
              style={{
                borderRadius: 9,
                padding: '0px 10px',
                width: 34,
                height: 21,
                marginLeft: 4
              }}
            >
              {referrals}
            </DefaultButton>
          )}
        </TabItem>
      </IonList>
      {active === 'myrequests' && (
        <DefaultButton
          variant="contained"
          btnColor="primary-gradient"
          size="large"
          onClick={newVerificationClicked}
          style={{ margin: '0 20px 0 auto' }}
        >
          New Verification Request
        </DefaultButton>
      )}
    </ActivityPageHeaderContainer>
  );
};

export default ActivityPageHeader;
