import React from 'react';
import { IonCol, IonGrid, IonRow } from '@ionic/react';

import SpotlightCard from 'src/components/cards/SpotlightCard';
import OverviewCard from 'src/components/cards/OverviewCard';

import style from './style.module.scss';

const DashboardStatus: React.FC = () => {
  return (
    <IonGrid className={style['tab-grid']}>
      <IonRow>
        <IonCol size="4">
          <SpotlightCard
            title="NOT READY YET"
            content="Please refrain from testing this page for this version"
          />
        </IonCol>
        <IonCol size="8">{/* <OverviewCard /> */}</IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default DashboardStatus;
