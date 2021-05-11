/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonText,
  IonGrid,
  IonRow
} from '@ionic/react';
import style from './RecentBadgeCard.module.scss';
import { timeSince } from 'src/utils/time';
import badgeDetails from 'src/data/badge_detail.json';

interface Props {
  badges: IBadges;
}

const RecentBadgeCard: React.FC<Props> = ({ badges }) => {
  const [archivedBadges, setArchivedBadges] = useState([]);
  useEffect(() => {
    let _archivedBadges: any = [];
    Object.keys(badges!).forEach(category => {
      Object.keys((badges as any)[category]).forEach(name => {
        let archived;
        if ((archived = ((badges as any)[category] as any)[name].archived)) {
          _archivedBadges.push({
            category,
            name,
            archived
          });
        }
      });
    });
    _archivedBadges.sort((a: any, b: any) => b.archived - a.archived);
    setArchivedBadges(_archivedBadges);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [badges]);
  return (
    <IonCard className={style['spotlight']}>
      <IonCardHeader className={style['card-header']}>
        <IonCardTitle className={style['card-title']}>
          Badges Timeline
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent className={style['card-content']}>
        <IonText className={style['card-text']}>
          <p>Your recent achivements</p>
        </IonText>
        <IonGrid>
          {archivedBadges.slice(0, 10).map((badge, index) => {
            const { category, name, archived } = badge;
            const { title, description, enbl_icon, dsabl_icon } = badgeDetails[
              category
            ][name];
            return (
              <IonRow className={style['badge']} key={index}>
                <div className={style['badge-icon']}>
                  <img alt="enable icon" src={enbl_icon} height={40} />
                </div>
                <div className={style['badge-detail']}>
                  <p className={style['badge-name']}>{title}</p>
                  <p className={style['badge-archive']}>
                    <span>Achieved</span> {timeSince(archived)}
                  </p>
                </div>
              </IonRow>
            );
          })}
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );
};

export default RecentBadgeCard;
