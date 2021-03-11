import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonList,
  IonLabel,
  IonItem,
  IonCol,
  IonGrid,
  IonRow,
} from '@ionic/react';
import style from './style.module.scss';
import { FollowingDTO, PageDTO, PeopleDTO } from '../types';
import PeopleCard from 'src/components/cards/PeopleCard';
import PagesCard from 'src/components/cards/PagesCard';

interface Props {
  tab?: string;
  people?: PeopleDTO;
  pages?: PageDTO;
  following?: FollowingDTO;
  searchKeyword?: string;
  isSearchKeywordDID?: boolean;
}

const ExploreNav: React.FC<Props> = ({
  tab = 'all',
  // perPage = 1,
  people,
  pages,
  following,
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
            <PeopleCard
              people={people}
              following={following}
              searchKeyword={searchKeyword}
              isSearchKeywordDID={isSearchKeywordDID}
            />
            <PagesCard
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
            <PeopleCard
              people={people}
              following={following}
              searchKeyword={searchKeyword}
              size='6'
            />
          </IonRow>
        </IonGrid>
      )}
      {active == 'pages' && (
        <IonGrid className={style['tab-grid']}>
          <IonRow>
            <PagesCard pages={pages} searchKeyword={searchKeyword} size='6' />
          </IonRow>
        </IonGrid>
      )}
    </IonContent>
  );
};

export default ExploreNav;
