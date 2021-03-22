import React, { useEffect, useState } from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol
} from '@ionic/react';
import ReactPaginate from 'react-paginate';

import { ISessionItem, UserService } from 'src/services/user.service';
import { defaultUserInfo } from 'src/services/profile.service';

import style from './PeopleCard.module.scss';
import DidCard from './DidCard';
import { PeopleDTO, FollowingDTO } from '../search/types';

interface IProps {
  people?: PeopleDTO;
  following?: FollowingDTO;
  searchKeyword?: string;
  isSearchKeywordDID?: boolean;
  size?: string;
  showHeader?: boolean;
}

const peopleItem = (
  peopleItem: any,
  isFollowing: boolean,
  indexItem: number,
  userInfo: ISessionItem,
  colSize: any
) => {
  return (
    <DidCard
      name={peopleItem.name}
      did={peopleItem.did}
      avatar={peopleItem.avatar}
      colSize={colSize}
      sessionItem={userInfo}
      following={isFollowing}
      type="user"
      key={'did-people-card-' + indexItem}
    />
  );
};

const PeopleCard: React.FC<IProps> = ({
  people,
  following,
  searchKeyword,
  isSearchKeywordDID,
  showHeader = true,
  size = '12'
}: IProps) => {
  const perPage = parseInt(size) / 12 === 1 ? 4 : 8;
  const totalPages = people && people.items ? people.items.length / perPage : 1;

  const [peoplePageOffset, setPeoplePageOffset] = useState(0);
  const [listPeople, setListPeople] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState<ISessionItem>(defaultUserInfo);

  useEffect(() => {
    (async () => {
      let instance = UserService.GetUserSession();
      if (!instance || !instance.userToken) return;

      setUserInfo(instance);
    })();
  }, []);

  const isFollowing = (did: string): boolean => {
    if (following && following.items) {
      for (let i = 0; i < following.items.length; i++) {
        if (following.items[i].did === did) {
          return true;
        }
      }
    }
    return false;
  };

  useEffect(() => {
    let listPeopleLocal: any =
      people &&
      people.items
        .slice(peoplePageOffset, peoplePageOffset + perPage)
        .map((p, index) =>
          peopleItem(
            p,
            isFollowing(p.did),
            index,
            userInfo,
            parseInt(size) / 12 === 1 ? '100%' : '50%'
          )
        );

    setListPeople(listPeopleLocal);
  }, [peoplePageOffset, people, following]);

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
        {/* <IonSearchbar
          // value={searchQuery}
          // onIonChange={(e) => search(e)}
          placeholder='Search people, pages by name or DID'
          className={style['search-input']}
        ></IonSearchbar> */}

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
            //  subContainerClassName={'pages pagination'}
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

export default PeopleCard;
