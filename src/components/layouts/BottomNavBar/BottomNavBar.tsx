import React from 'react';
import { useHistory } from 'react-router-dom';
import { IonTabBar, IonTabButton } from '@ionic/react';
import styled from 'styled-components';
import TabButtonContent from './TabButtonContent';
import './style.module.scss';

const Container = styled.div`
  height: 100px;
`;

export const BottomNavBar: React.FC = () => {
  const history = useHistory();
  const path = history.location.pathname;

  return (
    <Container>
      <IonTabBar slot="bottom">
        <IonTabButton tab="profile" selected={path === '/profile'}>
          <TabButtonContent
            name="dashboard"
            active={path === '/profile'}
            handleClick={() => history.push('/profile')}
          >
            Dashboard
          </TabButtonContent>
        </IonTabButton>

        <IonTabButton tab="spaces" selected={path.includes('/spaces')}>
          <TabButtonContent
            name="spaces"
            active={path.includes('/spaces')}
            handleClick={() => history.push('/spaces')}
          >
            Spaces
          </TabButtonContent>
        </IonTabButton>

        <IonTabButton tab="explore" selected={path === '/explore'}>
          <TabButtonContent
            name="explore"
            active={path === '/explore'}
            handleClick={() => history.push('/explore')}
          >
            Explore
          </TabButtonContent>
        </IonTabButton>

        <IonTabButton
          tab="connections"
          selected={path.includes('/connections')}
        >
          <TabButtonContent
            name="connections"
            active={path.includes('/connections')}
            handleClick={() => history.push('/connections')}
          >
            Connections
          </TabButtonContent>
        </IonTabButton>

        <IonTabButton tab="messages" selected={path === '/messages'}>
          <TabButtonContent
            name="messages"
            active={path === '/messages'}
            handleClick={() => {}}
          >
            Messages
          </TabButtonContent>
        </IonTabButton>
      </IonTabBar>
    </Container>
  );
};

export default BottomNavBar;
