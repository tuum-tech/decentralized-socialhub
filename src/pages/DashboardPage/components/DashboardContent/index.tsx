import React, { useState } from 'react';
import { IonList, IonLabel, IonItem } from '@ionic/react';
import styled from 'styled-components';

import DashboardHome from './Home';
import DashboardStatus from './Status';
import DashboardBadges from './Badges';

const Container = styled.div`
  background: #f7fafc;
  min-height: 100%;
  padding: 22px;

  ion-list {
    background: transparent;
    padding: 0;
  }
  .tab-grid {
    background: #f7fafc;
    min-height: 100%;
  }
  .tab-list {
    background: #f7fafc;
  }
  .tab-item {
    cursor: pointer;
    --border-color: #f7fafc;
    --inner-border-width: 0 0 2px 0;
    display: inline-block;
    --background: #f7fafc;
    --inner-padding-bottom: 0.5em;
    font-weight: 600;
    color: #718096;
  }
  .tab-active {
    --border-color: var(--theme-primary-blue);
    color: #1a202c;
  }
  .tab-label {
    font-family: 'SF Pro Display';
  }
`;

interface Props {
  onTutorialStart: () => void;
  profile: ProfileDTO;
  sessionItem: ISessionItem;
  didDocument: any;
}

const DashboardContent: React.FC<Props> = ({
  onTutorialStart,
  profile,
  sessionItem,
  didDocument
}) => {
  const [active, setActive] = useState('home');
  return (
    <Container>
      <IonList>
        <IonItem
          className={(active === 'home' ? 'tab-active' : '') + ' ' + 'tab-item'}
          onClick={() => setActive('home')}
        >
          <IonLabel className="tab-label">Home</IonLabel>
        </IonItem>
        <IonItem
          className={
            (active === 'status' ? 'tab-active' : '') + ' ' + 'tab-item'
          }
          onClick={() => setActive('status')}
        >
          <IonLabel className="tab-label">Status</IonLabel>
        </IonItem>
        <IonItem
          className={
            (active === 'badges' ? 'tab-active' : '') + ' ' + 'tab-item'
          }
          onClick={() => setActive('badges')}
        >
          <IonLabel className="tab-label">Badges</IonLabel>
        </IonItem>
      </IonList>
      {active === 'home' && (
        <DashboardHome
          sessionItem={sessionItem}
          profile={profile}
          onTutorialStart={onTutorialStart}
          didDocument={didDocument}
          activeTab={tab => {
            setActive(tab);
          }}
        />
      )}
      {active === 'status' && <DashboardStatus />}
      {active === 'badges' && <DashboardBadges sessionItem={sessionItem} />}
    </Container>
  );
};

export default DashboardContent;
