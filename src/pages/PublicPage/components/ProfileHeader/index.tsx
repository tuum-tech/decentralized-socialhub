import React from 'react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { Link } from 'react-router-dom';

import Avatar, { AvatarBox } from 'src/components/avatars';
import style from './style.module.scss';
import DidSnippet from 'src/components/DidSnippet';
import defaultAdamAvatar from 'src/assets/icon/defaultAdamAvatar.png';
import { ProfileName } from 'src/components/texts';
import { FollowButton } from 'src/components/buttons';

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
        <IonCol size="2">
          <AvatarBox>
            {user && user.avatar ? (
              <Avatar avatar={user.avatar as string} mode="big" />
            ) : (
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
          <Link to="/sign-did">
            <FollowButton>View profile</FollowButton>
          </Link>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default ProfileHeader;
