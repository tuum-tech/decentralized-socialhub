import React from 'react';
import {
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardTitle,
  IonCardHeader,
  IonCardContent
} from '@ionic/react';
import { Link } from 'react-router-dom';

import styleCards from 'src/components/cards/WidgetCards.module.scss';
import { TruncatedSpan, Name, ViewAll } from './FollowingCard';
import style from './style.module.scss';

interface FollwerWidgetProps {
  users: string[];
  getLinkFunc: any;
  isSigned: boolean;
}

const FollowerCard: React.FC<FollwerWidgetProps> = ({
  users,
  getLinkFunc,
  isSigned
}: FollwerWidgetProps) => {
  return (
    <IonCard className={styleCards['overview']}>
      <IonCardHeader>
        <IonGrid>
          <IonRow className="ion-justify-content-between">
            <IonCol size="6">
              <IonCardTitle id="education">
                Follower ({users.length})
              </IonCardTitle>
            </IonCol>
            <IonCol size="auto">
              <ViewAll href={isSigned ? '/connections/followers' : '/sign-did'}>
                View All
              </ViewAll>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardHeader>
      <IonCardContent>
        <IonGrid className={style['following-widget']}>
          {users.map((user: any, index) => (
            <IonRow key={index}>
              <IonCol size="*">
                <img
                  className={style['thumbnail']}
                  src={user.avatar}
                  alt="thumbnail"
                />
              </IonCol>
              <IonCol size="7">
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
    </IonCard>
  );
};

export default FollowerCard;
