import React, { useEffect, useState } from 'react';
import { IonItem, IonList } from '@ionic/react';
import style from './DidCard.module.scss';
import SkeletonAvatar from '../avatars/SkeletonAvatar';
import { ProfileService } from 'src/services/profile.service';

interface Props {
  name?: string;
  did: string;
  avatar?: string;
  indexItem?: number;
  following?: boolean;
  colSize?: string;
  type?: string;
}

const DidCard: React.FC<Props> = ({
  name,
  did = '',
  avatar,
  indexItem,
  following = false,
  colSize = '100%',
  type = 'user',
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  let profileService: ProfileService;

  const getUserHiveInstance = async (): Promise<ProfileService> => {
    return ProfileService.getProfileServiceUserOnlyInstance();
  };

  const followDid = async (did: string) => {
    if (!profileService || !profileService.hiveClient) {
      profileService = await getUserHiveInstance();
    }

    let list: any = await profileService.addFollowing(did);
    console.log('FollowingList', list);
    setIsFollowing(true);
  };

  const unfollowDid = async (did: string) => {
    if (!profileService || !profileService.hiveClient) {
      profileService = await getUserHiveInstance();
    }

    let list: any = await profileService.unfollow(did);
    setIsFollowing(false);
  };

  useEffect(() => {
    setIsFollowing(following);
  }, [following]);

  return (
    <IonList
      className={style['did']}
      style={{ width: colSize, display: 'inline-block' }}
      key={indexItem}
    >
      <IonItem className={style['badge-item']}>
        <div>
          <SkeletonAvatar />
          <img
            src={avatar}
            width='80'
            height='80'
            className={style['clip-avatar-svg']}
          />
        </div>
        <div className={style['card-data']}>
          <span className={style['name-value']}>{name}</span>
          <span className={style['did-value']}>
            {'DID:' + did.replace('did:elastos:', '')}
          </span>
        </div>
        {type == 'user' && (
          <div className={style['card-link']}>
            {isFollowing && (
              <span
                className={style['card-link-inner']}
                onClick={() => unfollowDid(did)}
              >
                -Unfollow
              </span>
            )}

            {!isFollowing && (
              <span
                className={style['card-link-inner']}
                onClick={() => followDid(did)}
              >
                +Follow
              </span>
            )}
          </div>
        )}
      </IonItem>
    </IonList>
  );
};

export default DidCard;
