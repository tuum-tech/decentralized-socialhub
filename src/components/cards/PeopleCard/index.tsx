import React, { useEffect, useState } from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonRow,
  IonCol
} from '@ionic/react';
import ReactPaginate from 'react-paginate';
import Select from 'react-select';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import { InferMappedProps, SubState } from '../SocialProfileCard/types';
import { ProfileService } from 'src/services/profile.service';
import { ITEMS_PER_PAGE } from 'src/pages/ExplorePage/constants';

import style from './PeopleCard.module.scss';
import DidCard from '../DidCard';

export interface IFollowingResponse {
  _status?: string;
  get_following: IGetFollowing;
}

const peopleItem = (
  peopleItem: any,
  following: FollowingDTO,
  indexItem: number,
  colSize: any,
  followClicked: (isFollow: boolean, did: string) => void
) => {
  return (
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
};

interface Props extends InferMappedProps {
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
  session,
  unfollowMutualFollower
}: Props) => {
  // const perPage = parseInt(size) / 12 === 1 ? 4 : 8;
  const [perPage, setPerPage] = useState<number>(10);
  const totalPages = people && people.items ? people.items.length / perPage : 1;

  const [peoplePageOffset, setPeoplePageOffset] = useState(0);
  const [listPeople, setListPeople] = useState<any[]>([]);
  const [listFollowing, setListFollowing] = useState<FollowingDTO>(following);

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
    console.log('====>card', response.get_following);
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

  useEffect(() => {
    (async () => {
      let listPeopleLocal: any =
        people &&
        people.items
          .slice(peoplePageOffset, peoplePageOffset + perPage)
          .map((p, index) =>
            peopleItem(
              p,
              listFollowing,
              index,
              parseInt(size) / 12 === 1 ? '100%' : '50%',
              // handleUnfollow,
              // loadFollowing
              followClicked
            )
          );

      setListPeople(listPeopleLocal);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peoplePageOffset, people, listFollowing, perPage]);

  const handlePeoplePageClick = (data: any) => {
    let selected = data.selected;
    let offset = Math.ceil(selected * perPage);

    setPeoplePageOffset(offset);
  };

  const handlePageCount = (selected: any) => {
    setPerPage(selected.label);
  };

  return (
    <IonCol
      size={(parseInt(size) / 12 === 1 ? parseInt(size) / 2 : 12).toString()}
      className={style['people']}
    >
      <IonCard className={style['tab-card']}>
        {showHeader && (
          <IonCardHeader>
            <IonCardTitle className={style['card-title']}>People</IonCardTitle>
          </IonCardHeader>
        )}
        {listPeople}
        {listPeople && (
          <IonRow className={style['pagination-footer']}>
            <div>
              Showing {perPage} item out of {people?.items.length}
            </div>
            <ReactPaginate
              previousLabel={'◀︎'}
              nextLabel={'▶︎'}
              breakLabel={'...'}
              breakClassName={'break-me'}
              pageCount={totalPages}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={handlePeoplePageClick}
              containerClassName={style['pagination']}
              activeClassName={style['page-active']}
            />
            <div className={style['page-count-select']}>
              <div>Rows per page</div>
              <Select
                className="items-per-page"
                classNamePrefix="select"
                name="pagecount"
                options={ITEMS_PER_PAGE}
                onChange={handlePageCount}
              />
            </div>
          </IonRow>
        )}
        {!listPeople && (
          <IonCardContent>
            No user found with the {isSearchKeywordDID ? 'DID' : 'keyword'}:{' '}
            <strong>{searchKeyword}</strong>
          </IonCardContent>
        )}
      </IonCard>
    </IonCol>
  );
};

// export default PeopleCard;

export const mapStateToProps = createStructuredSelector<SubState, SubState>({
  session: makeSelectSession()
});

export function mapDispatchToProps(dispatch: any) {
  return {
    eProps: {
      setSession: (props: { session: ISessionItem }) =>
        dispatch(setSession(props))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PeopleCard);
