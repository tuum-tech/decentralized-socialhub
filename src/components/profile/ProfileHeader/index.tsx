import React, { useEffect, useState } from 'react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { ProfileService } from 'src/services/profile.service';
import { UserService } from 'src/services/user.service';

import SkeletonAvatar from 'src/components/avatars/SkeletonAvatar';
import style from './style.module.scss';
import DidSnippet from 'src/components/DidSnippet';
import defaultAdamAvatar from 'src/assets/icon/defaultAdamAvatar.png';
import { ProfileName } from 'src/components/texts';
import { Button } from 'src/components/buttons';

import followIcon from 'src/assets/icon/follow.svg';
import linkIcon from 'src/assets/icon/link.svg';

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
  const [isFollowing, setIsFollowing] = useState(false);
  const followDid = async () => {
    await ProfileService.addFollowing(user.did);
    setIsFollowing(true);
  };

  const unfollowDid = async () => {
    await ProfileService.unfollow(user.did);
    setIsFollowing(false);
  };

  const getPublicProfileLink = (): string => {
    return `/did/${user.did}`;
  };
  useEffect(() => {
    (async () => {
      const userSession = UserService.GetUserSession();
      if (userSession && userSession.did) {
        let followings = (await ProfileService.getFollowings(userSession.did))
          .get_following;
        if (followings && followings.items) {
          if (followings.items.findIndex(item => item.did === user.did) != -1) {
            setIsFollowing(true);
          }
        }
      }
    })();
  }, [user]);
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

        <IonCol size="7">
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
        <IonCol size="3" className={style['d-flex']}>
          <Link
            to={getPublicProfileLink}
            target="_blank"
            onClick={event => {
              event.preventDefault();
              window.open(getPublicProfileLink());
            }}
          >
            <Button
              type="secondary"
              text="View Profile"
              icon={linkIcon}
              onClick={async () => {}}
            />
          </Link>
          {isFollowing ? (
            <Button
              type="primary"
              text="Unfollow"
              icon={followIcon}
              onClick={async () => {
                unfollowDid();
              }}
            />
          ) : (
            <Button
              type="primary"
              text="Follow"
              icon={followIcon}
              onClick={async () => {
                followDid();
              }}
            />
          )}
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default ProfileHeader;
