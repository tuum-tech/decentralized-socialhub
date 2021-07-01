import React, { useState, useEffect } from 'react';
import {
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from '@ionic/react';

import styled from 'styled-components';
import style from './BadgeCard.module.scss';
import ProgressBar from 'src/elements/ProgressBar';
import BadgeItem from './BadgeItem';
import badgeDetails from 'src/data/badge_detail.json';

const ProgressBarChart = styled.div`
  width: 42px;
`;
const ProgressBarText = styled.div`
  font-size: 10px;
  font-weight: normal;
  line-height: 1.71;
  letter-spacing: 0.13px;
  color: rgba(0, 0, 0, 0.87);
  margin: 0 10px;
`;
const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
`;

interface Props {
  badges: IBadges;
  badgeCategory: string;
}

const BadgeCard: React.FC<Props> = ({ badges, badgeCategory }) => {
  const [totalBadgeCount, setTotalBadgeCount] = useState<number>(0);
  const [completedBadgeCount, setCompletedBadgeCount] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [badgeItems, setBadgeItems] = useState<any>({});
  const [badgeCategoryTitle, setBadgeCategoryTitle] = useState<string>('');

  useEffect(() => {
    if (!badges) return;
    switch (badgeCategory) {
      case 'account':
        setBadgeCategoryTitle('Account');
        break;
      case 'socialVerify':
        setBadgeCategoryTitle('Social Badges');
        break;
      case 'didPublishTimes':
        setBadgeCategoryTitle('DID Pubish');
        break;
      case 'dStorage':
        setBadgeCategoryTitle('Decentralized Storage');
        break;
      default:
        setBadgeCategoryTitle('');
        break;
    }
    let items = (badges as any)[badgeCategory];
    setBadgeItems(items);
    let _totalBadgeCount = Object.keys(items).length;
    let _completedBadgeCount = Object.keys(items).filter(
      key => (items as any)[key].archived
    ).length;
    setTotalBadgeCount(_totalBadgeCount);
    setCompletedBadgeCount(_completedBadgeCount);
    setProgressPercent((_completedBadgeCount * 100) / _totalBadgeCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [badges]);
  return (
    <IonCard className={style['badge-card']}>
      <IonCardHeader className={style['badge-card-header']}>
        <IonCardTitle className={style['badge-category-name']}>
          {badgeCategoryTitle}
        </IonCardTitle>
        <ProgressContainer>
          <ProgressBarChart>
            <ProgressBar value={progressPercent} containerColor="#dde5ec" />
          </ProgressBarChart>
          <ProgressBarText>
            {completedBadgeCount}/{totalBadgeCount} Completed
          </ProgressBarText>
        </ProgressContainer>
      </IonCardHeader>
      <IonCardContent>
        <IonRow>
          {Object.keys(badgeItems!).map((key, index) => {
            return (
              <IonCol size="3" key={index}>
                <BadgeItem
                  image={
                    (badgeItems as any)[key].archived
                      ? ((badgeDetails as any)[badgeCategory] as any)[key]
                          .enbl_icon
                      : ((badgeDetails as any)[badgeCategory] as any)[key]
                          .dsabl_icon
                  }
                  title={
                    ((badgeDetails as any)[badgeCategory] as any)[key].title
                  }
                  description={
                    ((badgeDetails as any)[badgeCategory] as any)[key]
                      .description
                  }
                  archived={(badgeItems as any)[key].archived}
                />
              </IonCol>
            );
          })}
        </IonRow>
      </IonCardContent>
    </IonCard>
  );
};

export default BadgeCard;
