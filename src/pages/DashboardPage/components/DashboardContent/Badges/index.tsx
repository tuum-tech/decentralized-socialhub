import React, { useEffect } from 'react';
import { IonCol, IonGrid, IonRow } from '@ionic/react';

import style from './style.module.scss';

import OverviewCard from './OverviewCard';
import RecentBadgeCard from './RecentBadgeCard';
import BadgeCard from './BadgeCard';
import { useRecoilState } from 'recoil';
import { BadgesAtom } from 'src/Atoms/Atoms';

interface Props {
  sessionItem: ISessionItem;
}

const DashboardBadges: React.FC<Props> = ({ sessionItem }) => {
  const [badges, setBadges] = useRecoilState<IBadges>(BadgesAtom);

  useEffect(() => {
    setBadges(sessionItem.badges as IBadges);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionItem]);

  return (
    <IonGrid className={style['tab-grid']}>
      <IonRow>
        <IonCol sizeXs="12" sizeSm="4">
          <OverviewCard badges={badges} />
          {/* <ProfileCompletion /> */}
          <RecentBadgeCard badges={badges} />
        </IonCol>
        <IonCol sizeXs="12" sizeSm="8">
          <BadgeCard badges={badges} badgeCategory="account" />
          <BadgeCard badges={badges} badgeCategory="socialVerify" />
          <BadgeCard badges={badges} badgeCategory="didPublishTimes" />
          <BadgeCard badges={badges} badgeCategory="dStorage" />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default DashboardBadges;
