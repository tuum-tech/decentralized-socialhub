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

import styleCards from 'src/components/cards/WidgetCards.module.scss';
import style from './style.module.scss';

interface FollowingsWidgetProps {
  dids: string[];
  resolveUserFunc: any;
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
  dids,
  resolveUserFunc,
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
                Following ({dids.length})
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
          {dids.map((did: string, index) => (
            <IonRow key={index}>
              <IonCol size="*">
                <img
                  className={style['thumbnail']}
                  src={resolveUserFunc(did).image}
                  alt="thumbnail"
                />
              </IonCol>
              <IonCol size="7">
                <Link to={getLinkFunc(did)}>
                  <IonGrid>
                    <IonRow>
                      <Name>{resolveUserFunc(did).name}</Name>
                    </IonRow>
                    <IonRow>
                      <TruncatedSpan>{did}</TruncatedSpan>
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
