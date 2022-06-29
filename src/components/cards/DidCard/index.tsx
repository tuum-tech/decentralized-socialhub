import React, { useEffect, useState } from 'react';
import { IonItem, IonList } from '@ionic/react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

import useSession from 'src/hooks/useSession';
import Avatar from '../../Avatar';
import { getDIDString, getShortenedDid } from 'src/utils/did';
import { DefaultButton } from 'src/elements-v2/buttons';
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
  const { session } = useSession();
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
      className={clsx(style['did'])}
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
              {getShortenedDid(did, 9).replace('did:elastos:', 'DID:')}
            </span>
          </div>

          {type === 'user' && session.onBoardingCompleted && (
            <>
              {isFollowing ? (
                <DefaultButton
                  size="small"
                  variant="outlined"
                  btnColor="grey"
                  textType="gradient"
                  loading={loading}
                  onClick={() => unfollowDid(did)}
                >
                  - Unfollow
                </DefaultButton>
              ) : (
                <DefaultButton
                  size="small"
                  variant="outlined"
                  btnColor="primary-gradient"
                  textType="gradient"
                  loading={loading}
                  onClick={() => followDid(did)}
                >
                  + Follow
                </DefaultButton>
              )}
            </>
          )}
        </div>
      </IonItem>
    </IonList>
  );
};

export default DidCard;
