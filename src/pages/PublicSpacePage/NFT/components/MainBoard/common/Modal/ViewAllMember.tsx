import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IonRow } from '@ionic/react';
import InfiniteScroll from 'react-infinite-scroll-component';

import Avatar from 'src/components/Avatar';
import {
  CloseButton,
  LoadMore
} from 'src/components/ViewAllFollowModal/FollowingAll';
import nft_item_icon from 'src/assets/space/nft_item.jpg';
import welcome_badge from 'src/assets/space/welcome_badge.svg';
import modal_style from './style.module.scss';
import common_style from '../style.module.scss';
import { getNFTCollectionAssets } from '../../../../fetchapi';
import { getDIDString } from 'src/utils/did';
import { getOwners } from 'src/utils/nftcollection';

interface Props {
  space: any;
  onClose: () => void;
}

const ViewAllMember = ({ space, onClose }: Props) => {
  const style = { ...modal_style, ...common_style };
  const [members, setMembers] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [offset, setOffset] = useState(0);
  const limit = 5;

  useEffect(() => {
    (async () => {
      await fetchMoreData();
    })();
  }, []);

  const fetchMoreData = async () => {
    const { data }: any = await getNFTCollectionAssets(
      space.guid,
      offset,
      limit
    );
    const { totalCount, assets } = data;
    console.log(assets);
    setTotalCount(totalCount);

    if (assets.length > 0) {
      const _members_ = await getOwners(assets);
      setOffset(offset + limit);
      setMembers(members.concat(_members_));
    } else {
      setHasMore(false);
    }
  };
  return (
    <div className={style['modal']}>
      <div className={style['modal_container']}>
        <div className={style['modal_content']}>
          <p className={style['modal_title']}>{`Members (${totalCount})`}</p>
          <div className={style['scrollableContent']} id="scrollableDiv">
            <InfiniteScroll
              dataLength={members.length}
              next={fetchMoreData}
              hasMore={hasMore}
              style={{
                width: '100%'
              }}
              loader={<LoadMore />}
              scrollableTarget="scrollableDiv"
            >
              {members.map((member: any, index: number) => {
                const isProfileUser = typeof member === 'object';
                return (
                  <IonRow className={style['row']} key={index}>
                    <div className={style['avatar']}>
                      {isProfileUser ? (
                        <Avatar did={member.did} width="40px" />
                      ) : (
                        <img src={nft_item_icon} />
                      )}
                      <img src={welcome_badge} />
                    </div>
                    {isProfileUser ? (
                      <Link
                        to={getDIDString('/did/' + member.did)}
                        target={'blank'}
                      >
                        <span className={style['name']}>{member.name}</span>
                      </Link>
                    ) : (
                      <span className={style['name']}>{member}</span>
                    )}
                  </IonRow>
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

export default ViewAllMember;
