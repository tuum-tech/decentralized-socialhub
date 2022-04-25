import React, { useEffect, useState } from 'react';
import { IonItem, IonList, IonSpinner } from '@ionic/react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

import { useSelector } from 'react-redux';
import { selectSession } from 'src/store/users/selectors';

import Avatar from '../../Avatar';
import { getDIDString } from 'src/utils/did';
import FingerPrintFill from 'src/assets/icon/fingerprint-fill.svg';

import style from './DidCard.module.scss';
interface Props {
  name?: string;
  did: string;
  avatar?: string;
  indexItem?: number;
  sessionItem?: ISessionItem;
  following?: FollowingDTO;
  colSize?: string;
  type?: string;
  // unfollowMutualFollower?: (did: string) => void;
  // loadFollowing: () => void;
  followClicked: (isFollow: boolean, did: string) => void;
}

const DidCard: React.FC<Props> = ({
  name,
  did = '',
  avatar,
  indexItem,
  colSize = '100%',
  type = 'user',
  following,
  followClicked
}: Props) => {
  const session = useSelector((state: any) => selectSession(state));
  const tutorialStep = session ? session.tutorialStep : 1;
  const [isFollowing, setIsFollowing] = useState(
    following?.items
      .map(f => f.did)
      .join(', ')
      .includes(did)
  );

  const [loading, setLoading] = useState(false);

  const followDid = async (did: string) => {
    setLoading(true);
    await followClicked(true, did);
    setLoading(false);
  };

  const unfollowDid = async (did: string) => {
    setLoading(true);
    await followClicked(false, did);
    setLoading(false);
  };

  const getLink = (did: string) => {
    return getDIDString('/did/' + did, true);
  };

  useEffect(() => {
    setIsFollowing(
      following?.items
        .map(f => f.did)
        .join(', ')
        .includes(did)
    );
  }, [following, did]);

  return (
    <IonList
      className={clsx(style['did'], { [style['col-3']]: colSize === '33.33%' })}
      style={{ width: colSize, display: 'inline-block' }}
      key={indexItem}
    >
      {/* {loading && <LoadingIndicator loadingText="Creating new profie now..." />} */}
      <IonItem className={style['badge-item']}>
        {type === 'user' ? (
          <Avatar did={did} />
        ) : (
          <img alt="avatar" src={avatar} width={80} height={80} />
        )}
        <div className={style['did-card-wrapper']}>
          <div className={style['card-data']}>
            <Link
              className={style['name-value']}
              to={getLink(did)}
              target="_blank"
            >
              {name}
            </Link>
            <span className={style['did-value']}>
              <img src={FingerPrintFill} alt="filgerprint" />
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
                  className={clsx(
                    style['card-link-inner'],
                    style['card-link-unfollow']
                  )}
                  onClick={() => unfollowDid(did)}
                >
                  - Unfollow
                </span>
              )}

              {!loading && !isFollowing && (
                <span
                  className={style['card-link-inner']}
                  onClick={() => followDid(did)}
                >
                  + Follow
                </span>
              )}
            </div>
          )}
        </div>
      </IonItem>
    </IonList>
  );
};

export default DidCard;
