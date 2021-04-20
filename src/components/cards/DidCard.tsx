import React, { useEffect, useState } from 'react';
import { IonItem, IonList, IonSpinner } from '@ionic/react';
import style from './DidCard.module.scss';

import Avatar from '../Avatar';
import { ProfileService } from 'src/services/profile.service';
import { Link } from 'react-router-dom';
import { UserService } from 'src/services/user.service';

interface Props {
  name?: string;
  did: string;
  avatar?: string;
  indexItem?: number;
  sessionItem?: ISessionItem;
  following?: FollowingDTO;
  colSize?: string;
  type?: string;
}

const DidCard: React.FC<Props> = ({
  name,
  did = '',
  avatar,
  indexItem,
  following,
  colSize = '100%',
  type = 'user'
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  const userInfo = UserService.GetUserSession();
  const tutorialStep = userInfo !== undefined ? userInfo.tutorialStep : 1;

  const followDid = async (did: string) => {
    setLoading(true);
    const response = await ProfileService.addFollowing(did);
    following = response.get_following;
    setIsFollowing(true);
    setLoading(false);
  };

  const unfollowDid = async (did: string) => {
    setLoading(true);
    const response = await ProfileService.unfollow(did);
    following = response.get_following;
    setIsFollowing(false);
    setLoading(false);
  };

  const getLink = (did: string) => {
    return '/explore/' + did;
  };

  useEffect(() => {
    setLoading(true);
    setIsFollowing(computeIsFollowing(did));
    setLoading(false);
  }, [following]);

  const computeIsFollowing = (did: string): boolean => {
    if (following && following.items) {
      for (let i = 0; i < following.items.length; i++) {
        if (following.items[i].did === did) {
          return true;
        }
      }
    }
    return false;
  };

  return (
    <IonList
      className={style['did']}
      style={{ width: colSize, display: 'inline-block' }}
      key={indexItem}
    >
      {/* {loading && <LoadingIndicator loadingText="Creating new profie now..." />} */}
      <IonItem className={style['badge-item']}>
        {type === 'user' ? (
          <Avatar did={did} />
        ) : (
          <img src={avatar} width={80} height={80} />
        )}
        <div className={style['card-data']}>
          <Link className={style['name-value']} to={getLink(did)}>
            {name}
          </Link>
          <span className={style['did-value']}>
            {'DID:' + did.replace('did:elastos:', '')}
          </span>
        </div>
        {type === 'user' && tutorialStep === 4 && (
          <div className={style['card-link']}>
            {loading && (
              <span className={style['card-link-inner']}>
                <IonSpinner
                  color="#007bff"
                  style={{
                    width: '1rem',
                    height: '1rem'
                  }}
                />
                {/* <span>Wait a while...</span> */}
              </span>
            )}
            {!loading && isFollowing && (
              <span
                className={style['card-link-inner']}
                onClick={() => unfollowDid(did)}
              >
                -Unfollow
              </span>
            )}

            {!loading && !isFollowing && (
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
