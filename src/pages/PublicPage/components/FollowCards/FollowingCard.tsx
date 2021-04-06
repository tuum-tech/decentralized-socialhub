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
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import styleCards from 'src/components/cards/WidgetCards.module.scss';
import style from './style.module.scss';

interface FollowingsWidgetProps {
  contacts: IFollowingResponse;
  resolveUserFunc: any;
  getLinkFunc: any;
}

export const TruncatedSpan = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  font-family: 'SF Pro Display';
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.62;
  letter-spacing: normal;
  text-align: left;
  color: #979797;
`;

export const Name = styled.span`
  font-family: 'SF Pro Display';
  font-size: 16px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.56;
  letter-spacing: normal;
  text-align: left;
  color: #27272e;
`;

export const ViewAll = styled.span`
  flex-grow: 0;
  font-family: 'SF Pro Display';
  font-size: 14px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: right;
  color: #4c6fff;
`;

const FollowingCard: React.FC<FollowingsWidgetProps> = ({
  contacts,
  resolveUserFunc,
  getLinkFunc
}: FollowingsWidgetProps) => {
  return (
    <IonCard className={styleCards['overview']}>
      <IonCardHeader>
        <IonGrid>
          <IonRow className="ion-justify-content-between">
            <IonCol size="6">
              <IonCardTitle id="education">
                Following ({contacts.get_following.items.length})
              </IonCardTitle>
            </IonCol>
            <IonCol size="auto">
              <ViewAll>View all</ViewAll>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardHeader>
      <IonCardContent>
        <IonGrid className={style['following-widget']}>
          {contacts.get_following.items.map((item: IFollowingItem, index) => (
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

export default FollowingCard;
