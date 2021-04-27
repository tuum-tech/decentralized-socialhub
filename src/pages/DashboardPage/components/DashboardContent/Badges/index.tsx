import React, { useState, useEffect } from 'react';
import { IonCol, IonGrid, IonRow } from '@ionic/react';

import ProfileCompletion from '../Home/Right/ProfileCompletion';

import styled from 'styled-components';
import style from './style.module.scss';

import OverviewCard from './OverviewCard';
import BadgeCard from './BadgeCard';

interface Props {
  sessionItem: ISessionItem;
}

const DashboardBadges: React.FC<Props> = ({ sessionItem }) => {
  return (
    <IonGrid className={style['tab-grid']}>
      <IonRow>
        <IonCol size="4">
          <OverviewCard badges={sessionItem.badges!} />
          <ProfileCompletion />
        </IonCol>
        <IonCol size="8">
          <BadgeCard badges={sessionItem.badges!} badgeCategory="account" />
          <BadgeCard
            badges={sessionItem.badges!}
            badgeCategory="socialVerify"
          />
          <BadgeCard
            badges={sessionItem.badges!}
            badgeCategory="didPublishTimes"
          />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default DashboardBadges;
