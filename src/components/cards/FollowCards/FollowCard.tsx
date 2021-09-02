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
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';

import Avatar from '../../Avatar';
import { CardOverview } from '../common';

import style from './style.module.scss';

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

interface FollowCardProps {
  users: string[];
  getLinkFunc: any;
  viewAllClicked: () => void;
  template: string;
  title: string;
}

const FollowCard: React.FC<FollowCardProps> = ({
  users,
  getLinkFunc,
  viewAllClicked,
  template,
  title
}: FollowCardProps) => {
  return (
    <CardOverview template={template}>
      <IonCardHeader>
        <IonGrid>
          <IonRow className="ion-justify-content-between">
            <IonCol size="6">
              <IonCardTitle id="education">{title}</IonCardTitle>
            </IonCol>
            <IonCol size="auto">
              <ViewAll onClick={viewAllClicked}>View All</ViewAll>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardHeader>

      <IonCardContent>
        <IonGrid className={style['following-widget']}>
          <IonRow style={{ paddingLeft: '-5px', paddingRight: '-5px' }}>
            {users.map((user: any, index) => (
              <IonCol
                key={user.did}
                size="2"
                style={{ paddingLeft: '2.5px', paddingRight: '2.5px' }}
              >
                <Link
                  to={getLinkFunc(user.did)}
                  data-for={user.did}
                  data-tip={`name: ${user.name} <br/> did: ${user.did}`}
                  data-iscapture="true"
                >
                  <Avatar did={user.did} />
                </Link>
                <ReactTooltip id={user.did} multiline={true} />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </CardOverview>
  );
};

export default FollowCard;
