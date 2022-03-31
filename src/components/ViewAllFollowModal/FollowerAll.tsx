import React, { useEffect, useState } from 'react';
import { IonContent, IonSearchbar } from '@ionic/react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { FollowService } from 'src/services/follow.service';
import { ProfileService } from 'src/services/profile.service';

import UserRow from './UserRow';
import style from './style.module.scss';
import { CloseButton, LoadMore } from './FollowingAll';

interface Props {
  followerDids: string[];
  followingDids: string[];
  editable: boolean;
  onClose: () => void;
  setFollowingDids: (newFollowerDids: string[]) => void;
  userSession: ISessionItem;
}

const ViewAllModal = ({
  followerDids,
  followingDids,
  onClose,
  editable,
  setFollowingDids,
  userSession
}: Props) => {
  const [followerUsers, setFollowerUsers] = useState<any[]>([]);

  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState('');

  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    (async () => {
      const fUsers = await retrieveNewData(
        followerDids,
        '',
        pageSize,
        pageNumber
      );
      setFollowerUsers(fUsers);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const retrieveNewData = async (
    followerDids: string[],
    searchStr = '',
    pageSize: number,
    pageNumber: number
  ) => {
    if (loading === '') {
      setLoading('retrieving new data');
    }
    const fUsers = await FollowService.invokeSearch(
      followerDids,
      searchStr,
      pageSize,
      pageNumber
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
      <p
        className={style['modal_title']}
      >{`Followers (${followerDids.length})`}</p>
      <IonContent className={style['searchcomponent']}>
        <IonSearchbar
          onIonChange={async e => {
            const searchStr = e.detail.value || '';
            const res = await retrieveNewData(followerDids, searchStr, 200, 1);
            setFollowerUsers(res);
          }}
          placeholder="Search people, pages by name or DID"
          className={style['search-input']}
        ></IonSearchbar>
      </IonContent>

      <div className={style['scrollableContent']} id="scrollableDiv">
        <InfiniteScroll
          dataLength={followerUsers.length}
          next={async () => {
            const fUsers = await retrieveNewData(
              followerDids,
              '',
              pageSize,
              pageNumber
            );
            if (fUsers.length > 0) {
              setFollowerUsers(fUsers);
              setFollowerUsers(followerUsers.concat(fUsers));
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
          {followerUsers.map((user: any) => (
            <UserRow
              did={user.did}
              name={user.name}
              key={user.did}
              disabled={!editable}
              text={`${
                followingDids.includes(user.did) ? 'UnFollow' : 'Follow'
              }${loading === user.did ? 'ing' : ''}`}
              followAction={async () => {
                setLoading(user.did);
                if (user && followingDids.includes(user.did)) {
                  const res = await ProfileService.unfollow(user.did, user);
                  if (res) {
                    setFollowingDids(
                      followingDids.filter(item => item !== user.did)
                    );
                  }
                } else {
                  const res = await ProfileService.addFollowing(user.did, user);
                  if (res) {
                    setFollowingDids(followingDids.concat(user.did));
                  }
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

export default ViewAllModal;
