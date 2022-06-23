import React from 'react';
import { IonList, IonLabel } from '@ionic/react';
import styled from 'styled-components';
import { down } from 'styled-breakpoints';
import { useBreakpoint } from 'styled-breakpoints/react-styled';

import { TabsContainer } from 'src/components/profile/ProfileComponent/PublicProfileTabs';
import { DefaultButton } from 'src/elements-v2/buttons';
import { TabItem } from 'src/elements-v2/tabs';
import useSession from 'src/hooks/useSession';

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
  referrals: number;
}

const ActivityPageHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  margin-bottom: 12px;
  ${down('sm')} {
    flex-direction: column;
  }
`;

const ActivityPageHeader: React.FC<ActivityPageHeaderProps> = ({
  active,
  setActive,
  newVerificationClicked,
  myverifications,
  verificationRequests,
  referrals
}) => {
  const isSmDown = useBreakpoint(down('sm'));
  const { session, setSession } = useSession();

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
          size={isSmDown ? 'default' : 'large'}
          onClick={newVerificationClicked}
          style={{ margin: isSmDown ? '0 auto 0 20px' : '0 20px 0 auto' }}
          disabled={!session.onBoardingCompleted}
        >
          New Verification Request
        </DefaultButton>
      )}
    </ActivityPageHeaderContainer>
  );
};

export default ActivityPageHeader;
