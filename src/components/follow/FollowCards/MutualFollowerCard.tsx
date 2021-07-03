import React from 'react';
import {
  IonGrid,
  IonRow,
  IonCol,
  IonCardTitle,
  IonCardHeader,
  IonCardContent
} from '@ionic/react';
import { Link } from 'react-router-dom';

import Avatar from '../../Avatar';
import { TruncatedSpan, Name, ViewAll } from './FollowingCard';
import { CardOverview } from '../../cards/common';

import style from './style.module.scss';

interface FollwerWidgetProps {
  users: string[];
  getLinkFunc: any;
  isSigned: boolean;
  viewAllClicked: () => void;
  totalNumber: number;
  template: string;
}

const MutualFollowerCard: React.FC<FollwerWidgetProps> = ({
  users,
  getLinkFunc,
  isSigned,
  totalNumber,
  viewAllClicked,
  template
}: FollwerWidgetProps) => {
  return (
    <CardOverview template={template}>
      <IonCardHeader>
        <IonGrid>
          <IonRow className="ion-justify-content-between">
            <IonCol size="8">
              <IonCardTitle id="education">
                Mutual Follower ({totalNumber})
              </IonCardTitle>
            </IonCol>
            <IonCol size="auto">
              <ViewAll onClick={viewAllClicked}>View All</ViewAll>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardHeader>
      <IonCardContent>
        <IonGrid className={style['following-widget']}>
          {users.map((user: any, index) => (
            <IonRow key={index} className="mb-3">
              <IonCol size="2">
                <Avatar did={user.did} width="45px" />
              </IonCol>
              <IonCol size="10" className="pl-1">
                <Link to={getLinkFunc(user.did)}>
                  <IonGrid>
                    <IonRow>
                      <Name>{user.name}</Name>
                    </IonRow>
                    <IonRow>
                      <TruncatedSpan>{user.did}</TruncatedSpan>
                    </IonRow>
                  </IonGrid>
                </Link>
              </IonCol>
            </IonRow>
          ))}
        </IonGrid>
      </IonCardContent>
    </CardOverview>
  );
};

export default MutualFollowerCard;
