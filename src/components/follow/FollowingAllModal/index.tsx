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

interface Props {
  targetDid: string;
  onClose: () => void;
  editable?: boolean;
}

const FollowingAllModal = ({ targetDid, onClose, editable = true }: Props) => {
  const [followingDids, setFollowingDids] = useState<string[]>([]);
  const [followingUsers, setFollowingUsers] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    (async () => {
      const dids = await FollowService.getFollowingDids(targetDid);
      setFollowingDids(dids);
      setFollowingUsers(
        await FollowService.invokeSearch(dids, '', pageSize, pageNumber)
      );
    })();
  }, [targetDid]);

  return (
    <div className={style['modal']}>
      <div className={style['modal_container']}>
        <div className={style['modal_content']}>
          <p
            className={style['modal_title']}
          >{`Followings(${followingDids.length})`}</p>
          <IonContent className={style['searchcomponent']}>
            <IonSearchbar
              value={searchQuery}
              onIonChange={async e => {
                setSearchQuery(e.detail.value!);
                const res = await FollowService.invokeSearch(
                  followingDids,
                  e.detail.value!,
                  200,
                  1
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
                const newUsers = await FollowService.invokeSearch(
                  followingDids,
                  '',
                  pageSize,
                  pageNumber + 1
                );

                if (newUsers.length > 0) {
                  setFollowingUsers(followingUsers.concat(newUsers));
                  setPageNumber(pageNumber + 1);
                } else {
                  setHasMore(false);
                }
              }}
              hasMore={hasMore}
              style={{
                width: '100%'
              }}
              loader={
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
              }
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
                    setLoading(user.did);
                    const newFollowingDids = await ProfileService.unfollow(
                      user.did
                    );
                    if (newFollowingDids) {
                      setFollowingDids(newFollowingDids);
                      setFollowingUsers(
                        await FollowService.invokeSearch(
                          newFollowingDids,
                          '',
                          pageSize,
                          pageNumber
                        )
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
        </div>
      </div>
    </div>
  );
};

export default FollowingAllModal;
