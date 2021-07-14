import React from 'react';
import {
  IonGrid,
  IonRow,
  IonCol,
  IonCardTitle,
  IonCardHeader,
  IonCardContent
} from '@ionic/react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import Avatar from '../../Avatar';
import { CardOverview } from '../../cards/common';
import style from './style.module.scss';

interface FollowingsWidgetProps {
  users: any[];
  getLinkFunc: any;
  isSigned: boolean;
  viewAllClicked: () => void;
  totalNumber: number;
  template: string;
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

export const ViewAll = styled.button`
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
  background: transparent;
`;

const FollowingCard: React.FC<FollowingsWidgetProps> = ({
  users,
  getLinkFunc,
  isSigned,
  totalNumber,
  viewAllClicked,
  template
}: FollowingsWidgetProps) => {
  return (
    <CardOverview template={template}>
      <IonCardHeader>
        <IonGrid>
          <IonRow className="ion-justify-content-between">
            <IonCol size="6">
              <IonCardTitle id="education">
                Following ({totalNumber})
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
    </CardOverview>
  );
};

export default FollowingCard;
