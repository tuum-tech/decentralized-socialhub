import React, { useState, useEffect } from 'react';

import { SearchService } from 'src/services/search.service';
import { SmallLightButton } from 'src/elements/buttons';

import Avatar from 'src/components/Avatar';
import { UserRow } from '../MyRequests/UserRows';
import { getItemsFromData } from 'src/utils/script';
import { timeSince } from 'src/utils/time';

interface Props {
  session: ISessionItem;
  verifications: VerificationRequest[];
  setSelectVerification: (v: any) => void;
}

const UserRows: React.FC<Props> = ({
  session,
  verifications,
  setSelectVerification
}: Props) => {
  const [users, setUsers] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      const searchServiceLocal = await SearchService.getSearchServiceAppOnlyInstance();
      let usersRes: any = await searchServiceLocal.getUsersByDIDs(
        verifications.map(v => v.from_did),
        verifications.length,
        0
      );
      setUsers(getItemsFromData(usersRes, 'get_users_by_dids'));
    })();
  }, [verifications]);

  const rednerUserRow = (v: VerificationRequest) => {
    const user = users.filter((user: any) => user.did === v.from_did)[0];

    let statusColor = '#FF5A5A';
    if (v.status === 'approved') {
      statusColor = '#2FD5DD';
    } else if (v.status === 'requested') {
      statusColor = '#FF9840';
    }
    return (
      <UserRow key={v.from_did + v.to_did + v.status + v.category}>
        <div className="left">
          <Avatar did={v.from_did} width="50px" />
        </div>
        <div className="right">
          <p className="top">
            {v.category} <span style={{ fontWeight: 'bold' }}>from </span>
            {user ? user.name : v.from_did}
          </p>
          <p className="bottom" style={{ display: 'flex' }}>
            {timeSince(new Date(v.updated_at))}
            <li style={{ color: statusColor, marginLeft: ' 20px' }}>
              {v.status}
            </li>
          </p>
        </div>
        <SmallLightButton
          style={{
            margin: '0 0 0 auto'
          }}
          onClick={() => {
            setSelectVerification({
              verification: v,
              user
            });
          }}
        >
          View Info
        </SmallLightButton>
      </UserRow>
    );
  };

  return <>{verifications.map(v => rednerUserRow(v))}</>;
};

export default UserRows;
