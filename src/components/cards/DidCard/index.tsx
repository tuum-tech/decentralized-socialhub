import React, { useEffect, useState } from 'react';
import { IonItem, IonList, IonSpinner } from '@ionic/react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import { InferMappedProps, SubState } from '../../../pages/DashboardPage/types';

import Avatar from '../../Avatar';
import style from './DidCard.module.scss';
import { getDIDString } from 'src/utils/did';
interface Props extends InferMappedProps {
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
  session,
  following,
  followClicked
}: Props) => {
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
    return '/explore/' + getDIDString(did, true);
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
      className={style['did']}
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

export const mapStateToProps = createStructuredSelector<SubState, SubState>({
  session: makeSelectSession()
});

export function mapDispatchToProps(dispatch: any) {
  return {
    eProps: {
      setSession: (props: { session: ISessionItem }) =>
        dispatch(setSession(props))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DidCard);
