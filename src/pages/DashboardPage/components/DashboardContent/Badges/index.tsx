import React from 'react';
import { IonCol, IonGrid, IonRow } from '@ionic/react';

import style from './style.module.scss';

import OverviewCard from './OverviewCard';
import RecentBadgeCard from './RecentBadgeCard';
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
          {/* <ProfileCompletion /> */}
          <RecentBadgeCard badges={sessionItem.badges!} />
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
          <BadgeCard badges={sessionItem.badges!} badgeCategory="dStorage" />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default DashboardBadges;
