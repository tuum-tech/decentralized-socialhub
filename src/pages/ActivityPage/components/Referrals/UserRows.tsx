import React, { useState, useEffect, useMemo } from 'react';
import { IonLabel, IonRow } from '@ionic/react';
import { Link } from 'react-router-dom';

import { DefaultButton } from 'src/elements-v2/buttons';

import { UserRow, getStatusColor, InfoCol, ActionCol } from '../common';
import { getDIDString } from 'src/utils/did';
import { SearchService } from 'src/services/search.service';
import { getItemsFromData } from 'src/utils/script';
import { timeSince } from 'src/utils/time';
import Avatar from 'src/components/Avatar';
import style from './style.module.scss';

interface Props {
  referrals: IReferral[];
  session: ISessionItem;
  sortBy: number;
  searchQuery: string;
}

const UserRows: React.FC<Props> = ({
  referrals,
  session,
  sortBy,
  searchQuery
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    users.sort((a, b) => {
      if (a.created?.$date > b.created?.$date) {
        return sortBy ? -1 : 1;
      } else if (a.created?.$date < b.created?.$date) {
        return sortBy ? 1 : -1;
      } else {
        return 0;
      }
    });
  }, [sortBy, users]);

  const filteredUsers = useMemo(() => {
    if (searchQuery) {
      return users.filter(
        v =>
          v.name.toLowerCase().includes(searchQuery) ||
          v.owner?.includes(searchQuery)
      );
    }
    return users;
  }, [searchQuery, users]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const searchServiceLocal = await SearchService.getSearchServiceAppOnlyInstance();
        let usersRes: any = await searchServiceLocal.getUsersByDIDs(
          referrals.map(v => v.did),
          referrals.length,
          0
        );
        setLoading(false);
        const data = getItemsFromData(usersRes, 'get_users_by_dids');
        setUsers(
          data.map((v: any) => ({
            ...v,
            sign_up_date: referrals.find(p => p.did === v.did)?.sign_up_date
          }))
        );
      } catch (err) {
        setLoading(false);
      }
    })();
  }, [referrals]);

  const getLink = (did: string) => {
    return getDIDString('/did/' + did, true);
  };

  const renderUserRow = (r: ISessionItem) => {
    return (
      <UserRow key={r.did} className={style['item-row']}>
        <InfoCol>
          <div className="left">
            <Avatar did={r.did} width="50px" />
          </div>
          <div className="right">
            <div className="top">
              <Link to={getLink(r.did)} target="_blank">
                <IonLabel className={style['name']}>{r.name}</IonLabel>
              </Link>
            </div>
            <p className="bottom">
              <IonRow class="ion-justify-content-start">
                <IonLabel className={style['date']}>
                  {timeSince(r.created?.$date)}
                </IonLabel>
                <li
                  style={{
                    color: getStatusColor(
                      r?.sign_up_date ? 'completed' : 'pending'
                    ),
                    marginLeft: '9px'
                  }}
                  className={style['date']}
                >
                  {r?.sign_up_date ? 'Completed' : 'Pending'}
                </li>
                <li
                  className={style['tab-label']}
                  style={{ marginLeft: '9px' }}
                >
                  Earned: 0 MTRL
                </li>
              </IonRow>
            </p>
          </div>
        </InfoCol>

        <ActionCol size="auto">
          {/* TODO */}
          {/* <DefaultButton
          variant="outlined"
          size="large"
          btnColor="primary-gradient"
          className={style['button']}
          disabled
        >
          <img src={RingIcon} alt="ownership" />
          <IonLabel className={style['tab-label']}> Send Reminder</IonLabel>
        </DefaultButton> */}
          {loading && <DefaultButton loading>''</DefaultButton>}
        </ActionCol>
      </UserRow>
    );
  };

  return <>{filteredUsers.map(r => renderUserRow(r))}</>;
};

export default UserRows;
