import React, { useEffect, useState } from 'react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { Link } from 'react-router-dom';

import { ProfileService } from 'src/services/profile.service';
import { UserService } from 'src/services/user.service';
import DidSnippet from 'src/components/DidSnippet';
import { ProfileName } from 'src/components/texts';
import { Button } from 'src/components/buttons';
import Avatar from 'src/components/Avatar';
import followIcon from 'src/assets/icon/follow.svg';
import linkIcon from 'src/assets/icon/link.svg';

import style from './style.module.scss';

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
      if (!userSession) return;
      if (userSession && userSession.did) {
        let followings_res = await ProfileService.getFollowings(
          userSession.did
        );
        if (
          followings_res &&
          followings_res.get_following &&
          followings_res.get_following.items
        ) {
          if (
            followings_res.get_following.items.findIndex(
              item => item.did === user.did
            ) != -1
          ) {
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
          <Avatar did={user.did} />
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
            className="mr-2"
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
