import React, { useEffect, useState } from 'react';
import { IonContent, IonSearchbar, IonSpinner } from '@ionic/react';
import InfiniteScroll from 'react-infinite-scroll-component';

import { FollowService } from 'src/services/follow.service';
import { ProfileService } from 'src/services/profile.service';

import UserRow from '../FollowingAllModal/UserRow';
import style from '../FollowingAllModal/style.module.scss';
import { Loading, CloseButton } from '../FollowingAllModal';

interface Props {
  targetDid: string;
  onClose: () => void;
  editable?: boolean;
}

const ViewAllModal = ({ targetDid, onClose, editable = true }: Props) => {
  const [followerDids, setFollowerDids] = useState<string[]>([]);
  const [followingDids, setFollowingDids] = useState<string[]>([]);
  const [followerUsers, setFollowerUsers] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    (async () => {
      const followingdids = await FollowService.getFollowingDids(targetDid);
      setFollowingDids(followingdids);

      const followerDids = await FollowService.getFollowerDids(targetDid);
      setFollowerDids(followerDids);

      setFollowerUsers(
        await FollowService.invokeSearch(followerDids, '', pageSize, pageNumber)
      );
    })();
  }, [targetDid]);

  return (
    <div className={style['modal']}>
      <div className={style['modal_container']}>
        <div className={style['modal_content']}>
          <p
            className={style['modal_title']}
          >{`Followers (${followerDids.length})`}</p>
          <IonContent className={style['searchcomponent']}>
            <IonSearchbar
              value={searchQuery}
              onIonChange={async e => {
                setSearchQuery(e.detail.value!);
                const res = await FollowService.invokeSearch(
                  followerDids,
                  e.detail.value!,
                  200,
                  1
                );
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
                const newUsers = await FollowService.invokeSearch(
                  followerDids,
                  '',
                  pageSize,
                  pageNumber + 1
                );

                if (newUsers.length > 0) {
                  setFollowerUsers(followerUsers.concat(newUsers));
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
              {followerUsers.map((user: any) => {
                console.log(
                  '====>followingDids.includes(user.did)',
                  followingDids,
                  followingDids.includes(user.did)
                );

                return (
                  <UserRow
                    did={user.did}
                    name={user.name}
                    key={user.did}
                    disabled={!editable}
                    text={
                      followingDids.includes(user.did)
                        ? `UnFollow${loading === user.did ? 'ing' : ''}`
                        : `Follow${loading === user.did ? 'ing' : ''}`
                    }
                    followAction={async () => {
                      setLoading(user.did);
                      let newFollowingDids = followingDids;
                      if (followingDids.includes(user.did)) {
                        newFollowingDids = await ProfileService.unfollow(
                          user.did
                        );
                      } else {
                        newFollowingDids = await ProfileService.addFollowing(
                          user.did
                        );
                      }
                      setFollowingDids(newFollowingDids);
                      setLoading('');
                    }}
                  />
                );
              })}
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

export default ViewAllModal;
