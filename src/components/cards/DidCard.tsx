import React, { useEffect, useState } from 'react';
import { IonItem, IonList, IonSpinner } from '@ionic/react';
import style from './DidCard.module.scss';
import SkeletonAvatar from '../avatars/SkeletonAvatar';
import { ProfileService } from 'src/services/profile.service';
import { Link } from 'react-router-dom';
import { ISessionItem } from 'src/services/user.service';

interface Props {
  name?: string;
  did: string;
  avatar?: string;
  indexItem?: number;
  sessionItem?: ISessionItem;
  following?: boolean;
  colSize?: string;
  type?: string;
}

const DidCard: React.FC<Props> = ({
  name,
  did = '',
  avatar,
  indexItem,
  sessionItem = {
    tutorialStep: 1
  },
  following = false,
  colSize = '100%',
  type = 'user'
}) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const followDid = async (did: string) => {
    setLoading(true);
    await ProfileService.addFollowing(did);
    setIsFollowing(true);
    setLoading(false);
  };

  const unfollowDid = async (did: string) => {
    setLoading(true);
    await ProfileService.unfollow(did);
    setIsFollowing(false);
    setLoading(false);
  };

  const getLink = (did: string) => {
    return '/explore/' + did;
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
      {/* {loading && <LoadingIndicator loadingText="Creating new profie now..." />} */}
      <IonItem className={style['badge-item']}>
        <div>
          <SkeletonAvatar />
          <img
            src={avatar}
            width="80"
            height="80"
            className={style['clip-avatar-svg']}
          />
        </div>
        <div className={style['card-data']}>
          <Link className={style['name-value']} to={getLink(did)}>
            {name}
          </Link>
          <span className={style['did-value']}>
            {'DID:' + did.replace('did:elastos:', '')}
          </span>
        </div>
        {type === 'user' && sessionItem.tutorialStep === 4 && (
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
                <span>Wait a while...</span>
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
