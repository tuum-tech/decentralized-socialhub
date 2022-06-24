import React, { useEffect, useMemo, useState } from 'react';
import { IonCard, IonCardHeader, IonCardTitle, IonCol } from '@ionic/react';
import { useBreakpoint } from 'styled-breakpoints/react-styled';
import { down } from 'styled-breakpoints';

import { ProfileService } from 'src/services/profile.service';
import Pagination from 'src/components/Pagination';
import useSession from 'src/hooks/useSession';

import DidCard from '../DidCard';
import NoDataCard from 'src/components/NoDataCard';
import noResultImg from 'src/assets/nodata/no-result.svg';
import noPeopleImg from 'src/assets/nodata/no-people.svg';
import style from './PeopleCard.module.scss';

export interface IFollowingResponse {
  _status?: string;
  get_following: IGetFollowing;
}

interface PeopleItemProps {
  peopleItem: any;
  following: FollowingDTO;
  indexItem: number;
  colSize: any;
  followClicked: (isFollow: boolean, did: string) => void;
}

const PeopleItem = ({
  peopleItem,
  following,
  indexItem,
  colSize,
  followClicked
}: PeopleItemProps) => (
  <DidCard
    name={peopleItem.name}
    did={peopleItem.did}
    avatar={peopleItem.avatar}
    colSize={colSize}
    following={following}
    type="user"
    key={'did-people-card-' + indexItem}
    followClicked={followClicked}
  />
);

interface Props {
  people?: PeopleDTO;
  following: FollowingDTO;
  searchKeyword?: string;
  isSearchKeywordDID?: boolean;
  size?: string;
  showHeader?: boolean;
  showMutualFollowers?: boolean;
  unfollowMutualFollower?: (did: string) => void;
}

const PeopleCard: React.FC<Props> = ({
  people,
  following,
  searchKeyword,
  isSearchKeywordDID,
  showHeader = true,
  showMutualFollowers = false,
  size = '12',
  unfollowMutualFollower
}: Props) => {
  const { session } = useSession();
  const isSmDown = useBreakpoint(down('sm'));
  const [perPage, setPerPage] = useState<number>(10);
  const totalPages = useMemo(
    () =>
      people && people.items ? Math.ceil(people.items.length / perPage) : 1,
    [people, perPage]
  );

  const [peoplePageOffset, setPeoplePageOffset] = useState(0);
  const [listFollowing, setListFollowing] = useState<FollowingDTO>(following);
  const listPeople = useMemo(() => {
    let listPeopleLocal = people
      ? people.items.slice(peoplePageOffset, peoplePageOffset + perPage)
      : [];

    return listPeopleLocal;
  }, [peoplePageOffset, people, perPage]);

  const followClicked = async (isFollowing: boolean, did: string) => {
    if (!isFollowing && showMutualFollowers && unfollowMutualFollower) {
      unfollowMutualFollower(did);
    }
    if (isFollowing) {
      await ProfileService.addFollowing(did, session);
    } else {
      await ProfileService.unfollow(did, session);
    }

    const response = (await ProfileService.getFollowings(
      session.did
    )) as IFollowingResponse;
    setListFollowing(response.get_following);
  };

  useEffect(() => {
    (async () => {
      if (!session.did || session.did === '' || session.tutorialStep !== 4)
        return;

      const response = (await ProfileService.getFollowings(
        session.did
      )) as IFollowingResponse;
      setListFollowing(response.get_following);
    })();
  }, [session]);

  const handlePeoplePageClick = (data: any) => {
    let selected = data.selected;
    let offset = Math.ceil(selected * perPage);

    setPeoplePageOffset(offset);
  };

  const handlePageCount = (selected: any) => {
    setPerPage(selected.label);
  };

  let peopleCardRatio = isSmDown ? '100%' : perPage > 10 ? '33.33%' : '50%';

  return (
    <IonCol className={style['people']}>
      <IonCard className={style['tab-card']}>
        {showHeader && (
          <IonCardHeader>
            <IonCardTitle className={style['card-title']}>People</IonCardTitle>
          </IonCardHeader>
        )}
        {listPeople.map((p, index) => (
          <PeopleItem
            key={index}
            peopleItem={p}
            following={listFollowing}
            indexItem={index}
            colSize={peopleCardRatio}
            followClicked={followClicked}
          />
          // handleUnfollow,
          // loadFollowing
        ))}
        {listPeople.length > 0 ? (
          <Pagination
            perPage={perPage}
            totalPages={totalPages}
            lists={people?.items ?? []}
            onPageCountChange={handlePageCount}
            onPageChange={handlePeoplePageClick}
          />
        ) : searchKeyword ? (
          <NoDataCard
            img={noResultImg}
            title="Couldn’t find anyone"
            description="We couldn’t find what you are looking for"
          />
        ) : (
          <NoDataCard
            img={noPeopleImg}
            title="Explore Connections"
            description="Search for friends, colleagues & people"
          />
        )}
      </IonCard>
    </IonCol>
  );
};

export default PeopleCard;
