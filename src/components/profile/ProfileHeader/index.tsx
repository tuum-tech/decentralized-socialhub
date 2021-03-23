import React from 'react';
import {
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonRouterLink
} from '@ionic/react';
import styled from 'styled-components';

import SkeletonAvatar from 'src/components/avatars/SkeletonAvatar';
import ProfileName from '../ProfileName';
import style from './style.module.scss';

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

const AvatarBox = styled.div`
margin-left: 50px;
margin-top: 15px
margin-bottom: 15px;
`;

interface AvatarProps {
  avatar: string;
  mode: string;
}
const Avatar: React.FC<AvatarProps> = ({ avatar, mode }: AvatarProps) => {
  return (
    <>
      <SkeletonAvatar />
      <img
        alt="avatar"
        src={avatar}
        width={mode === 'small' ? '44' : '80'}
        height={mode === 'small' ? '44' : '80'}
        className={style['clip-avatar-svg']}
      />
    </>
  );
};

interface IProps {
  profile: ProfileDTO;
  user: ISessionItem;
  error: boolean;
  mode: string;
}

const ProfileHeader: React.FC<IProps> = ({
  profile,
  user,
  mode,
  error
}: IProps) => {
  return (
    <IonGrid className={style['profileheadersticky']}>
      <IonRow className={style['header']}>
        <IonCol size="auto">
          <AvatarBox>
            {user && user.avatar ? (
              <Avatar avatar={user.avatar as string} mode="big" />
            ) : (
              'avatar'
            )}
          </AvatarBox>
        </IonCol>

        <IonCol size="8">
          <IonGrid>
            <IonRow>
              <ProfileName>{user ? user.name : ''}</ProfileName>
            </IonRow>
          </IonGrid>
        </IonCol>
        <IonCol size="2">
          <SignInButton href="../sign-did">Follow</SignInButton>
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
