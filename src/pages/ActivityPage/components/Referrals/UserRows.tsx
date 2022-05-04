import React, { useState } from 'react';
import { IonSpinner } from '@ionic/react';
import { Link } from 'react-router-dom';

import Avatar from 'src/components/Avatar';
import DidSnippet from 'src/elements/DidSnippet';
import { SmallLightButton } from 'src/elements/buttons';

import { UserRow, getStatusColor } from '../MyRequests/UserRows';
import { getDIDString } from 'src/utils/did';

interface Props {
  referrals: IReferral[];
  following: string[];
  followClicked: (isFollow: boolean, did: string) => void;
  session: ISessionItem;
}

const UserRows: React.FC<Props> = ({
  referrals,
  followClicked,
  following,
  session
}: Props) => {
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

  const rednerUserRow = (r: IReferral) => {
    const isFollowing = following.includes(r.did);
    const status = r.sign_up_date ? 'Completed' : 'Pending';

    let joined = 0;
    if (r.sign_up_date) {
      joined = new Date(r.sign_up_date).getTime();
    }
    return (
      <UserRow key={r.did}>
        <div className="left">
          <Link to={getLink(r.did)} target="_blank">
            <Avatar did={r.did} width="50px" />
          </Link>
        </div>
        <div className="right">
          <p className="bottom">
            <li style={{ color: getStatusColor(status) }}>
              {status.toUpperCase()}
            </li>
            <DidSnippet did={r.did} dateJoined={joined} />
          </p>
        </div>
        <div style={{ margin: '0 0 0 auto' }}>
          {loading && (
            <SmallLightButton>
              <IonSpinner
                color="#007bff"
                style={{
                  width: '1rem',
                  height: '1rem'
                }}
              />
            </SmallLightButton>
          )}
          {!loading && isFollowing && (
            <SmallLightButton onClick={() => unfollowDid(r.did)}>
              - Unfollow
            </SmallLightButton>
          )}

          {!loading && !isFollowing && (
            <SmallLightButton onClick={() => followDid(r.did)}>
              + Follow
            </SmallLightButton>
          )}
        </div>
      </UserRow>
    );
  };

  return <>{referrals.map(r => rednerUserRow(r))}</>;
};

export default UserRows;
