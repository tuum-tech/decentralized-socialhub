import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IonRow, IonContent, IonSearchbar } from '@ionic/react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FollowService } from 'src/services/follow.service';
import Avatar from 'src/components/Avatar';
import { LoadMore } from 'src/components/ViewAllFollowModal/FollowingAll';
import modal_style from './style.module.scss';
import common_style from '../style.module.scss';
import { getDIDString } from 'src/utils/did';
import Modal from 'src/elements-v2/Modal';

interface Props {
  space: any;
  isOpen: boolean;
  onClose: () => void;
}

const ViewAllFollower = ({ space, isOpen, onClose }: Props) => {
  const style = { ...modal_style, ...common_style };
  const dids = space.followers || [];
  const [followers, setFollowers] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [searchStr, setSearchStr] = useState('');
  const [pageNum, setPageNum] = useState(1);
  const pageSize = 5;

  const fetchMoreData = async () => {
    const _followers_ = await FollowService.invokeSearch(
      dids,
      searchStr,
      pageSize,
      pageNum
    );
    if (_followers_.length > 0) {
      setPageNum(pageNum + 1);
      setFollowers(followers.concat(_followers_));
    } else {
      setHasMore(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchMoreData();
    })();
  }, []);

  return (
    <Modal
      title={`Followers (${dids.length})`}
      isOpen={isOpen}
      onClose={onClose}
      noButton
    >
      <IonContent className={style['searchcomponent']}>
        <IonSearchbar
          onIonChange={async e => {
            setSearchStr(e.detail.value || '');
          }}
          placeholder="Search people, pages by name or DID"
          className={style['search-input']}
        ></IonSearchbar>
      </IonContent>

      <div className={style['scrollableContent']} id="scrollableDiv">
        <InfiniteScroll
          dataLength={followers.length}
          next={fetchMoreData}
          hasMore={hasMore}
          style={{
            width: '100%'
          }}
          loader={<LoadMore />}
          scrollableTarget="scrollableDiv"
        >
          {followers.map((follower: any) => {
            return (
              <IonRow className={style['row']} key={follower.did}>
                <div className={style['avatar']}>
                  {/* <img src={nft_item_icon} /> */}
                  <Avatar did={follower.did} width="40px" />
                </div>
                <Link
                  className={style['name']}
                  to={getDIDString('/did/' + follower.did)}
                  target={'blank'}
                >
                  <span className={style['name']}>{follower.name}</span>
                </Link>
              </IonRow>
            );
          })}
        </InfiniteScroll>
      </div>
    </Modal>
  );
};

export default ViewAllFollower;
