import React from 'react';
import { IonList, IonLabel } from '@ionic/react';
import styled from 'styled-components';
import { down } from 'styled-breakpoints';

import { TabsContainer } from 'src/components/profile/ProfileComponent/PublicProfileTabs';
import { TabItem } from 'src/elements-v2/tabs';

export const Header = styled.div`
  width: 100%;
  height: 83px;
  background: #fff;
  padding: 27px 25px 20px 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${down('sm')} {
    padding: 20px;
    height: fit-content;
  }
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

export const SpaceTabsContainer = styled(TabsContainer)`
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

interface SpacePageHeaderProps {
  active: string;
  setActive: (active: string) => void;
}

const SpacePageHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 30px;
`;

const SpacePageHeader: React.FC<SpacePageHeaderProps> = ({
  active,
  setActive
}) => {
  return (
    <SpacePageHeaderContainer>
      <IonList>
        <TabItem
          active={active === 'my spaces'}
          onClick={() => setActive('my spaces')}
        >
          <IonLabel className="tab-label">My Spaces</IonLabel>
        </TabItem>
        <TabItem
          active={active === 'following'}
          onClick={() => setActive('following')}
        >
          <IonLabel className="tab-label">Following</IonLabel>
        </TabItem>
      </IonList>
    </SpacePageHeaderContainer>
  );
};

export default SpacePageHeader;
