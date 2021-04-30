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
import badgeDetails from 'src/data/badge_detail.json';

interface Props {
  badges: IBadges;
}

const OverviewCard: React.FC<Props> = ({ badges }) => {
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
    console.log(_archivedBadges);
    _archivedBadges.sort((a: any, b: any) => b.archived - a.archived);
    setArchivedBadges(_archivedBadges);
  }, []);
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
          {archivedBadges.slice(0, 5).map((badge, index) => {
            const { category, name, archived } = badge;
            const { title, description, enbl_icon, dsabl_icon } = badgeDetails[
              category
            ][name];
            const date = new Date(archived);
            return (
              <IonRow className={style['badge']} key={index}>
                <div className={style['badge-icon']}>
                  <img src={enbl_icon} height={40} />
                </div>
                <div className={style['badge-detail']}>
                  <p className={style['badge-name']}>{title}</p>
                  <p className={style['badge-archive']}>
                    <span>Archieved</span>{' '}
                    {(date.getMonth() > 8
                      ? date.getMonth() + 1
                      : '0' + (date.getMonth() + 1)) +
                      '/' +
                      (date.getDate() > 9
                        ? date.getDate()
                        : '0' + date.getDate()) +
                      '/' +
                      date.getFullYear()}
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

export default OverviewCard;
