import React, { useState } from 'react';
import { IonList, IonLabel, IonItem } from '@ionic/react';
import styled from 'styled-components';

interface IProps {
  tab: string;
  setTab: (tab: string) => void;
}

const Container = styled.div`
  z-index: 100;
  .tab-grid {
    background-color: 'white';
  }
  .tab-list {
    background-color: 'white'
    padding: 15px 0px 0px 15px;
  }
  .tab-item {
    cursor: pointer;
    --inner-border-width: 0 0 2px 0;
    display: inline-block;
    --inner-padding-bottom: 0 !important;

    --background: white;
    --border-color: white;

    font-weight: 600;
    color: #718096;
  }
  .tab-active {
    --border-color: var(--theme-primary-blue);
    color: #27272E;
  }
  .tab-label {
    font-family: 'SF Pro Display';
    margin-top: 0px !important;
    margin-bottom: 0px !important;
    margin-left: 10px;
    font-size: 14px;
  }
`;

const TemplateTabs: React.FC<IProps> = ({ tab, setTab }: IProps) => {
  return (
    <Container>
      <IonList className="tab-list">
        <IonItem
          className={(tab === 'templates' ? 'tab-active' : '') + ' tab-item'}
          onClick={() => {
            setTab('templates');
          }}
        >
          <IonLabel className="tab-label">Templates</IonLabel>
        </IonItem>
        <IonItem
          className={(tab === 'manage' ? 'tab-active' : '') + ' tab-item'}
          onClick={() => {
            setTab('manage');
          }}
        >
          <IonLabel className="tab-label">Manage my templates</IonLabel>
        </IonItem>
      </IonList>
    </Container>
  );
};

export default TemplateTabs;
