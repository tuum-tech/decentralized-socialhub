import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IonRow } from '@ionic/react';
import InfiniteScroll from 'react-infinite-scroll-component';

import Avatar from 'src/components/Avatar';
import { LoadMore } from 'src/components/ViewAllFollowModal/FollowingAll';
import nft_item_icon from 'src/assets/space/nft_item.jpg';
import welcome_badge from 'src/assets/space/welcome_badge.svg';
import { getNFTCollectionOwners } from '../../../../fetchapi';
import { getDIDString } from 'src/utils/did';
import { getOwners } from 'src/utils/nftcollection';
import { shortenAddress } from 'src/utils/web3';
import { SpaceCategory } from 'src/services/space.service';
import Modal from 'src/elements-v2/Modal';
import modal_style from './style.module.scss';
import common_style from '../style.module.scss';

interface Props {
  space: any;
  isOpen: boolean;
  onClose: () => void;
}

const ViewAllMember = ({ space, isOpen, onClose }: Props) => {
  const isNFTSpace = space?.category === SpaceCategory.NFT;
  const style = { ...modal_style, ...common_style };
  const [members, setMembers] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [offset, setOffset] = useState(0);
  const limit = 5;

  const [itemsContainerRef, setItemsContainerRef] = useState();

  const onItemsContainerRefChange = useCallback(node => {
    if (node !== null) {
      setItemsContainerRef(node);
    }
  }, []);

  const membersForNFTSpace = async () => {
    const { data }: any = await getNFTCollectionOwners(
      space.guid,
      offset,
      limit
    );
    if (!data) return [];
    const { totalCount, owners } = data;
    setTotalCount(totalCount || 0);
    const members = await getOwners(
      owners || [],
      space.meta?.network || 'Elastos Smart Contract Chain'
    );
    return members;
  };
  const membersForNonNFTSpace = async () => {
    return [];
  };

  const fetchMoreData = async () => {
    const _members_ = isNFTSpace
      ? await membersForNFTSpace()
      : await membersForNonNFTSpace();

    if (_members_.length > 0) {
      setOffset(offset + limit);
      setMembers(members.concat(_members_));
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
      title={`Members (${totalCount})`}
      isOpen={isOpen}
      onClose={onClose}
      noButton
    >
      <div
        ref={onItemsContainerRefChange}
        className={style['scrollableContent']}
      >
        {itemsContainerRef && (
          <InfiniteScroll
            dataLength={members.length}
            next={fetchMoreData}
            hasMore={hasMore}
            style={{
              width: '100%'
            }}
            loader={<LoadMore />}
            scrollableTarget={itemsContainerRef}
          >
            {members.map((member: any, index: number) => {
              const isProfileUser = member && typeof member === 'object';
              return (
                <IonRow className={style['row']} key={index}>
                  <div className={style['avatar']}>
                    {isProfileUser ? (
                      <Avatar did={member.did} width="40px" />
                    ) : (
                      <img src={nft_item_icon} alt={member.name} />
                    )}
                    <img src={welcome_badge} alt="welcome badge" />
                  </div>
                  {isProfileUser ? (
                    <Link
                      to={getDIDString('/did/' + member.did)}
                      target={'blank'}
                    >
                      <span className={style['name']}>{member.name}</span>
                    </Link>
                  ) : (
                    <span className={style['name']}>
                      {shortenAddress(member)}
                    </span>
                  )}
                </IonRow>
              );
            })}
          </InfiniteScroll>
        )}
      </div>
    </Modal>
  );
};

export default ViewAllMember;
