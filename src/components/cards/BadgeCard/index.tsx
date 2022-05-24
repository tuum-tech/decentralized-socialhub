/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';

import {
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonRow
} from '@ionic/react';

import { timeSince } from 'src/utils/time';
import badgeDetails from 'src/data/badge_detail.json';
import { CardOverview, LinkStyleSpan } from '../common';
import style from '../FollowCards/style.module.scss';

interface Props {
  badges: IBadges;
  template: string;
}

const BadgeCard: React.FC<Props> = ({ badges, template }) => {
  const [archivedBadges, setArchivedBadges] = useState([]);
  const [maxBadges, setMaxBadges] = useState(6);
  useEffect(() => {
    if (!badges) return;
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
    <CardOverview template={template}>
      <IonCardHeader className={style['card-header']}>
        <IonGrid>
          <IonRow className="ion-justify-content-between">
            <IonCol size="6">
              <IonCardTitle id="education">
                Badges{' '}
                {`${
                  archivedBadges.length > 0
                    ? '(' + archivedBadges.length + ')'
                    : ''
                }`}
              </IonCardTitle>
            </IonCol>
            <IonCol size="auto">
              <LinkStyleSpan
                onClick={() => {
                  if (maxBadges === 6) {
                    setMaxBadges(archivedBadges.length);
                  } else {
                    setMaxBadges(6);
                  }
                }}
              >
                {maxBadges === 6 ? 'View All' : 'Collapse'}
              </LinkStyleSpan>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardHeader>

      <IonCardContent>
        <IonGrid
          className={style['following-widget']}
          style={{
            display: 'flex',
            flexWrap: 'wrap'
          }}
        >
          {archivedBadges.slice(0, maxBadges).map((badge, index) => {
            const { category, name, archived } = badge;
            const { title, description, enbl_icon, dsabl_icon } = badgeDetails[
              category
            ][name];
            const text = `${title} <br/> Achieved ${timeSince(archived)}`;
            return (
              <IonCol
                key={title}
                size="2"
                style={{
                  paddingLeft: '2.5px',
                  paddingRight: '2.5px',
                  marginBottom: '10px'
                }}
                data-for={title}
                data-tip={text}
                data-iscapture="true"
              >
                <div className={style['badge-icon']}>
                  <img alt="enable icon" src={enbl_icon} height={40} />
                </div>
                <ReactTooltip id={title} multiline={true} />
              </IonCol>
            );
          })}
        </IonGrid>
      </IonCardContent>
    </CardOverview>
  );
};

export default BadgeCard;
