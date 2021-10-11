import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import Avatar from 'src/components/Avatar';
import { SmallLightButton } from 'src/elements/buttons';

import { SearchService } from 'src/services/search.service';

import { getItemsFromData } from 'src/utils/script';
import { getDIDString } from 'src/utils/did';
import { timeSince } from 'src/utils/time';
import { getCategoryTitle } from 'src/utils/credential';

export const UserRow = styled.div`
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0px 3px 8px -1px rgba(50, 50, 71, 0.05);
  filter: drop-shadow(0px 0px 1px rgba(12, 26, 75, 0.24));

  margin-top: 30px;
  display: flex;
  align-items: center;
  padding: 14px;

  .left {
    display: block;
    margin-right: 20px;
  }

  .right {
    display: block;

    .top {
      font-size: 16px;
      line-height: 162.02%;
      color: #425466;
    }

    .bottom {
      font-weight: normal;
      font-size: 13px;
      line-height: 162.02%;
      color: #425466;
    }
  }
`;

export const getStatusColor = (status: string) => {
  let statusColor = '#2FD5DD';
  if (status === 'requested') {
    statusColor = '#FF5A5A';
  } else if (status === 'rejected') {
    statusColor = '#FF9840';
  }
  return statusColor;
};
export interface Props {
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
        verifications.map(v => v.to_did),
        verifications.length,
        0
      );
      setUsers(getItemsFromData(usersRes, 'get_users_by_dids'));
    })();
  }, [verifications]);

  const renderUserName = (user: ISessionItem, v: VerificationRequest) => {
    if (user && user.name) {
      return <Link to={getDIDString('/did/' + user.did)}>{user.name}</Link>;
    }
    return <Link to={getDIDString('/did/' + v.to_did)}>{v.to_did}</Link>;
  };

  const rednerUserRow = (v: VerificationRequest) => {
    const user = users.filter((user: any) => user.did === v.to_did)[0];

    return (
      <UserRow key={(v as any)._id.$oid}>
        <div className="left">
          <Avatar did={v.to_did} width="50px" />
        </div>
        <div className="right">
          <p className="top">
            {getCategoryTitle(v)}
            <span style={{ fontWeight: 'bold' }}>sent to </span>
            {renderUserName(user, v)}
          </p>
          <p className="bottom" style={{ display: 'flex' }}>
            {timeSince(new Date(v.modified.$date))}
            <li
              style={{ color: getStatusColor(v.status), marginLeft: ' 20px' }}
            >
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
