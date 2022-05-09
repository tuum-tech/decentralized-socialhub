import React, { useEffect, useState } from 'react';
import { IonItem, IonList, IonSpinner } from '@ionic/react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';

import { getDIDString } from 'src/utils/did';
import FingerPrintFill from 'src/assets/icon/fingerprint-fill.svg';

import Avatar from 'src/components/Avatar';
import { InferMappedProps, SubState } from '../../types';

import style from './DidCard.module.scss';

interface Props extends InferMappedProps {
  name?: string;
  did: string;
  avatar?: string;
  sessionItem?: ISessionItem;
  following?: FollowingDTO;
  connectClicked: (did: string) => void;
}

const DidCard: React.FC<Props> = ({
  name,
  did = '',
  avatar = '',
  session,
  following,
  connectClicked
}: Props) => {
  let colSize = '100%';
  const tutorialStep = session ? session.tutorialStep : 1;
  const [isFollowing, setIsFollowing] = useState(
    following?.items
      .map(f => f.did)
      .join(', ')
      .includes(did)
  );

  const [loading, setLoading] = useState(false);

  const connectFriend = async (did: string) => {
    setLoading(true);
    await connectClicked(did);
    setLoading(false);
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
      key={did}
    >
      <IonItem className={style['badge-item']}>
        <Avatar did={did} />
        <div className={style['did-card-wrapper']}>
          <div className={style['card-data']}>
            <div className={style['name-value']}>{name}</div>
            <span className={style['did-value']}>
              <img src={FingerPrintFill} alt="filgerprint" />
              {'DID:' + did.replace('did:elastos:', '')}
            </span>
          </div>

          {tutorialStep === 4 && (
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
              <span
                className={style['card-link-inner']}
                onClick={() => connectFriend(did)}
              >
                Connect
              </span>
            </div>
          )}
        </div>
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
