/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';

import { IonCol, IonGrid } from '@ionic/react';

import { timeSince } from 'src/utils/time';
import badgeDetails from 'src/data/badge_detail.json';
import Card from 'src/elements-v2/Card';
import { LinkStyleSpan } from '../common';

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
    <Card
      template={template}
      title={`Badges ${
        archivedBadges.length > 0 ? '(' + archivedBadges.length + ')' : ''
      }`}
      action={
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
      }
    >
      <IonGrid
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
              <img alt="enable icon" src={enbl_icon} height={40} />
              <ReactTooltip id={title} multiline={true} />
            </IonCol>
          );
        })}
      </IonGrid>
    </Card>
  );
};

export default BadgeCard;
