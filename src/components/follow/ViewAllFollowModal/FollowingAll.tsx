import React, { useEffect, useState } from 'react';
import { IonContent, IonSearchbar, IonSpinner } from '@ionic/react';
import InfiniteScroll from 'react-infinite-scroll-component';
import styled from 'styled-components';

import { FollowButton } from 'src/components/buttons';
import { FollowService } from 'src/services/follow.service';
import { ProfileService } from 'src/services/profile.service';

import UserRow from './UserRow';
import style from './style.module.scss';

export const Loading = styled.div`
  font-style: normal;
  font-weight: 500;

  display: flex;
  align-items: center;
  justify-content: center !important;
  margin: 10px auto;

  color: #4c7eff;
  width: 100%;

  line-height: 1rem;
  font-size: 1rem;
`;

export const CloseButton = styled(FollowButton)`
  display: block;
  margin: 25px auto 0px;
`;

export const LoadMore = () => (
  <Loading>
    Loading &nbsp;
    <IonSpinner
      color="#4c7eff"
      style={{
        width: '1rem',
        height: '1rem'
      }}
    />
  </Loading>
);

interface Props {
  followingDids: string[];
  editable: boolean;
  onClose: () => void;
  setFollowingDids: (newFollowerDids: string[]) => void;
  userSession: ISessionItem;
}

const FollowingAllModal = ({
  followingDids,
  onClose,
  editable,
  setFollowingDids,
  userSession
}: Props) => {
  const [followingUsers, setFollowingUsers] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState('');

  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    (async () => {
      const fUsers = await retrieveNewData(
        followingDids,
        '',
        pageSize,
        pageNumber
      );
      setFollowingUsers(fUsers);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const retrieveNewData = async (
    dids: string[],
    searchStr = '',
    pageSize: number,
    pageNumber: number
  ) => {
    if (loading === '') {
      setLoading('retrieving new data');
    }
    const fUsers = await FollowService.invokeSearch(
      dids,
      searchStr,
      pageSize,
      pageNumber,
      userSession
    );

    if (fUsers.length > 0) {
      setPageNumber(pageNumber + 1);
    }

    if (loading !== '') {
      setLoading('');
    }
    return fUsers;
  };

  return (
    <>
      <IonContent className={style['searchcomponent']}>
        <IonSearchbar
          onIonChange={async e => {
            const searchStr = e.detail.value || '';
            const res = await FollowService.invokeSearch(
              followingDids,
              searchStr,
              200,
              1,
              userSession
            );
            setFollowingUsers(res);
          }}
          placeholder="Search people, pages by name or DID"
          className={style['search-input']}
        ></IonSearchbar>
      </IonContent>

      <div className={style['scrollableContent']} id="scrollableDiv">
        <InfiniteScroll
          dataLength={followingUsers.length}
          next={async () => {
            const fUsers = await retrieveNewData(
              followingDids,
              '',
              pageSize,
              pageNumber
            );

            if (fUsers.length > 0) {
              setFollowingUsers(followingUsers.concat(fUsers));
              setPageNumber(pageNumber + 1);
            } else {
              setHasMore(false);
            }
          }}
          hasMore={hasMore}
          style={{
            width: '100%'
          }}
          loader={<LoadMore />}
          scrollableTarget="scrollableDiv"
        >
          {followingUsers.map((user: any) => (
            <UserRow
              did={user.did}
              name={user.name}
              key={user.did}
              text={`UnFollow${loading === user.did ? 'ing' : ''}`}
              disabled={!editable}
              followAction={async () => {
                if (!user) return;
                setLoading(user.did);
                const res = await ProfileService.unfollow(user.did, user);
                if (res) {
                  setFollowingDids(
                    res['get_following']['items'].map((item: any) => item.did)
                  );
                  setFollowingUsers(
                    followingUsers.filter(item => item.did !== user.did)
                  );
                }
                setLoading('');
              }}
            />
          ))}
        </InfiniteScroll>
      </div>

      <CloseButton onClick={onClose} width={100} height={35}>
        Close
      </CloseButton>
    </>
  );
};

export default FollowingAllModal;
