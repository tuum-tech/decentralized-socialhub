import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { SearchService } from 'src/services/search.service';
import { DefaultButton } from 'src/elements-v2/buttons';
import Avatar from 'src/components/Avatar';
import { getItemsFromData } from 'src/utils/script';
import { getDIDString } from 'src/utils/did';
import { timeSince } from 'src/utils/time';
import { getCategoryTitle } from 'src/utils/credential';
import { UserRow, getStatusColor } from '../MyRequests/UserRows';

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

    const renderUserName = (user: ISessionItem, v: VerificationRequest) => {
      if (user && user.name) {
        return <Link to={getDIDString('/did/' + user.did)}>{user.name}</Link>;
      }
      return <Link to={getDIDString('/did/' + v.from_did)}>{v.from_did}</Link>;
    };

    return (
      <UserRow key={(v as any)._id.$oid}>
        <div className="left">
          <Avatar did={v.from_did} width="50px" />
        </div>
        <div className="right">
          <p className="top">
            {getCategoryTitle(v)}
            <span style={{ fontWeight: 'bold' }}>from </span>
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
        <DefaultButton
          size="small"
          variant="contained"
          btnColor="primary-gradient"
          bgColor="#F7FAFC"
          textType="gradient"
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
        </DefaultButton>
        {/* <DefaultButton
          size="small"
          variant="contained"
          btnColor="primary-gradient"
          bgColor="#F7FAFC"
          textType="gradient"
          style={{
            margin: '0 0 0 auto'
          }}
          onClick={() => {
              cancelRequest(v);
          }}
        >
          Cancel Request
        </DefaultButton> */}
      </UserRow>
    );
  };

  return <>{verifications.map(v => rednerUserRow(v))}</>;
};

export default UserRows;
