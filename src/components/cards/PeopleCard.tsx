import React, { useEffect, useState } from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonItem,
  IonList,
} from '@ionic/react';
import style from './PeopleCard.module.scss';
import { PeopleDTO } from '../search/types';
import DidCard from './DidCard';
import ReactPaginate from 'react-paginate';

interface IProps {
  people?: PeopleDTO;
  searchKeyword?: string;
  isSearchKeywordDID?: boolean;
  size?: string;
  showHeader?: boolean;
}

const peopleItem = (peopleItem: any, indexItem: number, colSize: any) => {
  return (
    <DidCard
      name={peopleItem.name}
      did={peopleItem.did}
      avatar={peopleItem.avatar}
      colSize={colSize}
      type='user'
      key={'did-people-card-' + indexItem}
    />
  );
};

const PeopleCard: React.FC<IProps> = ({
  people,
  searchKeyword,
  isSearchKeywordDID,
  showHeader = true,
  size = '12',
}: IProps) => {
  const perPage = parseInt(size) / 12 == 1 ? 4 : 8;
  const totalPages = people && people.items ? people.items.length / perPage : 1;

  const [peoplePageOffset, setPeoplePageOffset] = useState(0);
  const [listPeople, setListPeople] = useState<any[]>([]);

  useEffect(() => {
    let listPeopleLocal: any =
      people &&
      people.items
        .slice(peoplePageOffset, peoplePageOffset + perPage)
        .map((p, index) =>
          peopleItem(p, index, parseInt(size) / 12 == 1 ? '100%' : '50%')
        );

    setListPeople(listPeopleLocal);
  }, [peoplePageOffset, people]);

  const handlePeoplePageClick = (data: any) => {
    let selected = data.selected;
    let offset = Math.ceil(selected * perPage);

    setPeoplePageOffset(offset);
  };

  return (
    <IonCol
      size={(parseInt(size) / 12 == 1 ? parseInt(size) / 2 : 12).toString()}
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
