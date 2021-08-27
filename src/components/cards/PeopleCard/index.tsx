import React, { useEffect, useState, useCallback } from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol
} from '@ionic/react';
import ReactPaginate from 'react-paginate';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import { InferMappedProps, SubState } from '../SocialProfileCard/types';
import { ProfileService } from 'src/services/profile.service';

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
  const perPage = parseInt(size) / 12 === 1 ? 4 : 8;
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
    await loadFollowing();
  };

  const loadFollowing = useCallback(async () => {
    try {
      if (session && session.did !== '') {
        const response = (await ProfileService.getFollowings(
          session.did,
          session
        )) as IFollowingResponse;
        setListFollowing(response.get_following);
      }
    } catch (e) {
      // alertError(null, 'Could not load users that you follow');
      setListFollowing({ items: [] });
      return;
    }
  }, [session]);

  useEffect(() => {
    (async () => {
      await loadFollowing();
    })();
  }, [following, loadFollowing, session]);

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
  }, [peoplePageOffset, people, listFollowing]);

  const handlePeoplePageClick = (data: any) => {
    let selected = data.selected;
    let offset = Math.ceil(selected * perPage);

    setPeoplePageOffset(offset);
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
