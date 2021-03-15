import React from 'react';
import {
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonRouterLink
} from '@ionic/react';

import style from './style.module.scss';

import ProfileName from '../ProfileName';
import styled from 'styled-components';
import { ProfileDTO } from 'src/pages/PublicPage/types';

// import photo from '../../assets/photo.png';
import photo from '../../../assets/dp.jpeg';
import { ISessionItem } from 'src/services/user.service';

const SignInButton = styled(IonRouterLink)`
  width: 140px;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border-radius: 9px;
  background-color: #4c6fff;
  flex-grow: 0;
  font-family: 'SF Pro Display';
  font-size: 12px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: #ffffff;
`;

interface IProps {
  profile: ProfileDTO;
  sessionItem: ISessionItem;
  error: boolean;
}

const ProfileHeader: React.FC<IProps> = ({
  profile,
  sessionItem,
  error
}: IProps) => {
  return (
    <IonGrid className={style['profileheader']}>
      <IonRow className={style['header']}>
        <IonCol size="auto">
          <img src={photo} className={style['profile-img']} alt="profile" />
        </IonCol>

        <IonCol size="8">
          <IonGrid>
            <IonRow>
              <ProfileName>{sessionItem.name}</ProfileName>
            </IonRow>
          </IonGrid>
        </IonCol>
        <IonCol size="2">
          <SignInButton href="../sign-did">Sign in to Follow</SignInButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default ProfileHeader;

const FollowButton = styled(IonButton)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  --background: #4c6fff;
  --border-radius: 9px;
  height: 40px;
  opacity: 1;
  text-align: center;
  text-transform: none;
  letter-spacing: 0px;
  color: #ffffff;
  font-family: 'SF Pro Display';
  font-size: 12px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
`;
