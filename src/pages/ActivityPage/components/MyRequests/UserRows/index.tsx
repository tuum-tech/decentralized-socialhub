import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Avatar from 'src/components/Avatar';
import { DefaultButton } from 'src/elements-v2/buttons';
import { SearchService } from 'src/services/search.service';
import { getItemsFromData } from 'src/utils/script';
import { getDIDString } from 'src/utils/did';
import { timeSince } from 'src/utils/time';
import { getCategoryTitle } from 'src/utils/credential';
import { ActionCol, getStatusColor, InfoCol, UserRow } from '../../common';

export interface Props {
  session: ISessionItem;
  verifications: VerificationRequest[];
  setSelectVerification: (v: any) => void;
  cancelVerification: (v: any) => void;
}

const UserRows: React.FC<Props> = ({
  session,
  verifications,
  setSelectVerification,
  cancelVerification
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
        <InfoCol>
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
        </InfoCol>

        <ActionCol size="auto">
          <DefaultButton
            size="small"
            variant="contained"
            btnColor="primary-gradient"
            bgColor="#F7FAFC"
            textType="gradient"
            style={{
              margin: '0 10px 0 auto'
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
          {v.status === 'requested' ? (
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
                cancelVerification(v);
              }}
            >
              Cancel Request
            </DefaultButton>
          ) : (
            ''
          )}
        </ActionCol>
      </UserRow>
    );
  };

  return <>{verifications.map(v => rednerUserRow(v))}</>;
};

export default UserRows;
