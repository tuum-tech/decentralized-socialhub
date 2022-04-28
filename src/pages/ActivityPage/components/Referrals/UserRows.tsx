import React, { useEffect, useState } from 'react';

import Avatar from 'src/components/Avatar';
import { SmallLightButton } from 'src/elements/buttons';

import { SearchService } from 'src/services/search.service';
import { UserRow, getStatusColor } from '../MyRequests/UserRows';
import { getItemsFromData } from 'src/utils/script';

interface Props {
  referrals: IReferral[];
}

const UserRows: React.FC<Props> = ({ referrals }: Props) => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const searchServiceLocal = await SearchService.getSearchServiceAppOnlyInstance();
      let usersRes: any = await searchServiceLocal.getUsersByDIDs(
        referrals.map(v => v.did),
        referrals.length,
        0
      );
      setUsers(getItemsFromData(usersRes, 'get_users_by_dids'));
    })();
  }, [referrals]);

  const rednerUserRow = (r: IReferral) => {
    const status = r.sign_up_date ? 'approved' : 'pending';
    let date = '';
    if (r.sign_up_date) {
      date = new Date((r.sign_up_date as any)['$date']).toUTCString();
    }

    return (
      <UserRow key={r.did}>
        <div className="left">
          <Avatar did={r.did} width="50px" />
        </div>
        <div className="right">
          <p className="bottom">
            <li style={{ color: getStatusColor(status) }}>
              {status.toUpperCase()}
            </li>

            {date !== '' ? <li>Created At: {date}</li> : <></>}
          </p>
        </div>
        <SmallLightButton
          style={{
            margin: '0 0 0 auto'
          }}
          onClick={() => {}}
        >
          View Info
        </SmallLightButton>
      </UserRow>
    );
  };

  return <>{referrals.map(r => rednerUserRow(r))}</>;
};

export default UserRows;
