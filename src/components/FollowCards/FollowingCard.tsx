import React from 'react';
import {
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardTitle,
  IonCardHeader,
  IonCardContent,
  IonRouterLink
} from '@ionic/react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import Avatar from '../Avatar';
import styleCards from 'src/components/cards/WidgetCards.module.scss';
import style from './style.module.scss';

interface FollowingsWidgetProps {
  users: any[];
  getLinkFunc: any;
  isSigned: boolean;
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

export const ViewAll = styled(IonRouterLink)`
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
  users,
  getLinkFunc,
  isSigned
}: FollowingsWidgetProps) => {
  return (
    <IonCard className={styleCards['overview']}>
      <IonCardHeader>
        <IonGrid>
          <IonRow className="ion-justify-content-between">
            <IonCol size="6">
              <IonCardTitle id="education">
                Following ({users.length})
              </IonCardTitle>
            </IonCol>
            <IonCol size="auto">
              <ViewAll
                href={isSigned ? '/connections/followings' : '/sign-did'}
              >
                View All
              </ViewAll>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardHeader>
      <IonCardContent>
        <IonGrid className={style['following-widget']}>
          {users.map((user: any, index: number) => (
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
    </IonCard>
  );
};

export default FollowingCard;
