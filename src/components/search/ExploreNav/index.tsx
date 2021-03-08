import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonList,
  IonLabel,
  IonItem,
  IonCol,
  IonGrid,
  IonRow,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/react';
import style from './style.module.scss';
import DidCard from '../../cards/DidCard';
import { PageDTO, PeopleDTO } from '../types';
import ReactPaginate from 'react-paginate';

// const peopleData = [
//   {
//     name: 'Waqas Ahmed',
//     did: '1sdf87sdf87sdf87',
//     avatar:
//       'https://media-exp1.licdn.com/dms/image/C5103AQGAj2dZpTgHrw/profile-displayphoto-shrink_100_100/0/1517341859509?e=1619654400&v=beta&t=fVEIup7pmT6pvNkCyAgqHDUUcByq-iuUGBq25TYulGc',
//   },
//   {
//     name: 'Faizan Atiq',
//     did: '1sdf87sdf87sdf88',
//     avatar:
//       'https://media-exp1.licdn.com/dms/image/C4D03AQHJrVWT1os_uQ/profile-displayphoto-shrink_100_100/0/1613330591466?e=1619654400&v=beta&t=oE-BJ4-vYiefNuEYQTaKeVDaJWh8coNOUypjIwHoY2s',
//   },
// ];

interface IProps {
  people?: PeopleDTO; // | never[];
  pages?: PageDTO; // | never[];
  searchKeyword?: string;
  isSearchKeywordDID?: boolean;
  size?: string;
}

const peopleItem = (peopleItem: any, indexItem: number, colSize: any) => {
  return (
    <DidCard
      name={peopleItem.name}
      did={peopleItem.did}
      avatar={peopleItem.avatar}
      colSize={colSize}
      key={'did-people-card-' + indexItem}
    />
  );
};

const pageItem = (pageItem: any, indexItem: number, colSize: any) => {
  return (
    <DidCard
      name={pageItem.name}
      did={pageItem.did}
      avatar={pageItem.avatar}
      colSize={colSize}
      key={'did-page-card-' + indexItem}
    />
  );
};

const Pages: React.FC<IProps> = ({
  pages,
  searchKeyword,
  isSearchKeywordDID,
  size = '12',
}: IProps) => {
  console.log('Pages IProps called');
  console.log(pages);

  const perPage = parseInt(size) / 12 == 1 ? 4 : 8;
  const totalPages = pages && pages.items ? pages.items.length / perPage : 1;

  const [pagesPageOffset, setPagesPageOffset] = useState(0);
  const [listPages, setListPages] = useState<any[]>([]); //useState([]);

  useEffect(() => {
    let listPagesLocal: any =
      pages &&
      pages.items
        .slice(pagesPageOffset, pagesPageOffset + perPage)
        .map((p, index) =>
          pageItem(p, index, parseInt(size) / 12 == 1 ? '100%' : '50%')
        );

    setListPages(listPagesLocal);
  }, [pagesPageOffset, pages]);

  const handlePagesPageClick = (data: any) => {
    let selected = data.selected;
    let offset = Math.ceil(selected * perPage);

    setPagesPageOffset(offset);
  };

  return (
    <IonCol
      size={(parseInt(size) / 12 == 1 ? parseInt(size) / 2 : 12).toString()}
    >
      <IonCard className={style['tab-card']}>
        <IonCardHeader>
          <IonCardTitle className={style['card-title']}>Pages</IonCardTitle>
        </IonCardHeader>
        {listPages}
        {listPages && (
          <ReactPaginate
            previousLabel={'<'}
            nextLabel={'>'}
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={totalPages}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePagesPageClick}
            containerClassName={style['pagination']}
            //  subContainerClassName={'pages pagination'}
            activeClassName={style['page-active']}
          />
        )}

        {!listPages && (
          <IonCardContent>
            No page found with the {isSearchKeywordDID ? 'DID' : 'keyword'}:{' '}
            <strong>{searchKeyword}</strong>
          </IonCardContent>
        )}
      </IonCard>
    </IonCol>
  );
};

const People: React.FC<IProps> = ({
  people,
  searchKeyword,
  isSearchKeywordDID,
  size = '12',
}: IProps) => {
  const perPage = parseInt(size) / 12 == 1 ? 4 : 8;
  const totalPages = people && people.items ? people.items.length / perPage : 1;

  const [peoplePageOffset, setPeoplePageOffset] = useState(0);
  const [listPeople, setListPeople] = useState([]);

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
    >
      <IonCard className={style['tab-card']}>
        <IonCardHeader>
          <IonCardTitle className={style['card-title']}>People</IonCardTitle>
        </IonCardHeader>
        {listPeople}
        {listPeople && listPeople.length > 0 && (
          <ReactPaginate
            previousLabel={'<'}
            nextLabel={'>'}
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

        {listPeople.length <= 0 && (
          <IonCardContent>
            No user found with the {isSearchKeywordDID ? 'DID' : 'keyword'}:{' '}
            <strong>{searchKeyword}</strong>
          </IonCardContent>
        )}
      </IonCard>
    </IonCol>
  );
};

interface Props {
  tab?: string;
  people?: PeopleDTO;
  pages?: PageDTO;
  searchKeyword?: string;
  isSearchKeywordDID?: boolean;
}

const ExploreNav: React.FC<Props> = ({
  tab = 'all',
  // perPage = 1,
  people,
  pages,
  searchKeyword = '',
  isSearchKeywordDID = false,
}) => {
  const [active, setActive] = useState(tab);

  return (
    <IonContent className={style['explorenav']}>
      <IonList className={style['tab-list']}>
        <IonItem
          className={
            (active == 'all' ? style['tab-active'] : '') +
            ' ' +
            style['tab-item']
          }
          onClick={() => setActive('all')}
        >
          <IonLabel className={style['tab-label']}>All</IonLabel>
        </IonItem>
        <IonItem
          className={
            (active == 'people' ? style['tab-active'] : '') +
            ' ' +
            style['tab-item']
          }
          onClick={() => setActive('people')}
        >
          <IonLabel className={style['tab-label']}>People</IonLabel>
        </IonItem>
        <IonItem
          className={
            (active == 'pages' ? style['tab-active'] : '') +
            ' ' +
            style['tab-item']
          }
          onClick={() => setActive('pages')}
        >
          <IonLabel className={style['tab-label']}>Pages</IonLabel>
        </IonItem>
      </IonList>
      {active == 'all' && (
        <IonGrid className={style['tab-grid']}>
          <IonRow>
            <People
              people={people}
              searchKeyword={searchKeyword}
              isSearchKeywordDID={isSearchKeywordDID}
            />
            <Pages
              pages={pages}
              searchKeyword={searchKeyword}
              isSearchKeywordDID={isSearchKeywordDID}
            />
          </IonRow>
        </IonGrid>
      )}
      {active == 'people' && (
        <IonGrid className={style['tab-grid']}>
          <IonRow>
            <People people={people} searchKeyword={searchKeyword} size='6' />
          </IonRow>
        </IonGrid>
      )}
      {active == 'pages' && (
        <IonGrid className={style['tab-grid']}>
          <IonRow>
            <Pages pages={pages} searchKeyword={searchKeyword} size='6' />
          </IonRow>
        </IonGrid>
      )}
    </IonContent>
  );
};

export default ExploreNav;