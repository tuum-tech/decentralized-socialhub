import React, { useState } from 'react';
import { IonList, IonLabel, IonItem } from '@ionic/react';
import styled from 'styled-components';

import { getThemeData } from 'src/data/theme';

interface IProps {
  scrollToPosition: any;
  template: string;
}

const Container = styled.div`
  z-index: 100;
  .tab-grid {
    background-color: ${({ template }: ThemeProps) =>
      getThemeData(template, 'card', 'backgroundColor')};
  }
  .tab-list {
    background-color: ${({ template }: ThemeProps) =>
      getThemeData(template, 'card', 'backgroundColor')};
    padding: 15px 0px 0px 15px;
  }
  .tab-item {
    cursor: pointer;
    --inner-border-width: 0 0 2px 0;
    display: inline-block;
    --inner-padding-bottom: 0 !important;

    --background: ${({ template }: ThemeProps) =>
      getThemeData(template, 'card', 'backgroundColor')};
    --border-color: ${({ template }: ThemeProps) =>
      getThemeData(template, 'card', 'backgroundColor')};

    font-weight: 600;
    color: #718096;
  }
  .tab-active {
    --border-color: var(--theme-primary-blue);
    color: ${({ template }: ThemeProps) =>
      getThemeData(template, 'card', 'cardTitle')};
  }
  .tab-label {
    font-family: 'SF Pro Display';
    margin-top: 0px !important;
    margin-bottom: 0px !important;
    margin-left: 10px;
    font-size: 14px;
  }
`;

const PublicProfileTabs: React.FC<IProps> = ({
  scrollToPosition,
  template
}: IProps) => {
  const [active, setActive] = useState('about');

  return (
    <Container template={template}>
      <IonList className="tab-list">
        <IonItem
          className={(active === 'about' ? 'tab-active' : '') + ' tab-item'}
          onClick={() => {
            setActive('about');
            scrollToPosition('about');
          }}
        >
          <IonLabel className="tab-label">About</IonLabel>
        </IonItem>
        <IonItem
          className={
            (active === 'experience' ? 'tab-active' : '') + ' tab-item'
          }
          onClick={() => {
            setActive('experience');
            scrollToPosition('experience');
          }}
        >
          <IonLabel className="tab-label">Experience</IonLabel>
        </IonItem>
        <IonItem
          className={(active === 'education' ? 'tab-active' : '') + ' tab-item'}
          onClick={() => {
            setActive('education');
            scrollToPosition('education');
          }}
        >
          <IonLabel className="tab-label">Education</IonLabel>
        </IonItem>
      </IonList>
    </Container>
  );
};

export default PublicProfileTabs;
