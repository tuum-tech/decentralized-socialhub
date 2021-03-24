import React from 'react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import styled from 'styled-components';

import SkeletonAvatar from 'src/components/avatars/SkeletonAvatar';
import style from './style.module.scss';
import DidSnippet from 'src/components/DidSnippet';
import defaultAdamAvatar from 'src/assets/icon/defaultAdamAvatar.png';
import { ProfileName } from 'src/components/texts';
import { DashboardSignInButton } from 'src/components/buttons';

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
              // <Avatar avatar={user.avatar as string} mode="big" />
              <img src={defaultAdamAvatar} alt="default avatar" />
            )}
          </AvatarBox>
        </IonCol>

        <IonCol size="8">
          <IonGrid>
            <IonRow>
              <ProfileName>{user ? user.name : ''}</ProfileName>
            </IonRow>
            <IonRow className="ion-justify-content-start">
              <IonCol>
                <DidSnippet did={user.did} />
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>
        <IonCol size="2">
          <DashboardSignInButton href="../sign-did">
            Follow
          </DashboardSignInButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default ProfileHeader;
