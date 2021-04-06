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
  contacts: IFollowerResponse;
  resolveUserFunc: any;
  getLinkFunc: any;
  isSigned: boolean;
}

const FollowerCard: React.FC<FollwerWidgetProps> = ({
  contacts,
  resolveUserFunc,
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
                Follower ({contacts.get_followers.items.length})
              </IonCardTitle>
            </IonCol>
            <IonCol size="auto">
              <ViewAll href={isSigned ? '/connections/followers' : '/sign-did'}>
                {/* {isSigned ? 'View All' : 'Sign In'} */}
                View All
              </ViewAll>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardHeader>
      <IonCardContent>
        <IonGrid className={style['following-widget']}>
          {contacts.get_followers.items.map((item: IFollowerItem, index) => (
            <IonRow key={index}>
              <IonCol size="*">
                <img
                  className={style['thumbnail']}
                  src={resolveUserFunc(item.did).image}
                  alt="thumbnail"
                />
              </IonCol>
              <IonCol size="7">
                <Link to={getLinkFunc(item.did)}>
                  <IonGrid>
                    <IonRow>
                      <Name>{resolveUserFunc(item.did).name}</Name>
                    </IonRow>
                    <IonRow>
                      <TruncatedSpan>{item.did}</TruncatedSpan>
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
