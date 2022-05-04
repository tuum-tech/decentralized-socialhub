import React, { useState } from 'react';
import {
  IonContent,
  IonList,
  IonLabel,
  IonItem,
  IonGrid,
  IonRow
} from '@ionic/react';

import PeopleCard from 'src/components/cards/PeopleCard';
import style from './style.module.scss';
import SpaceView from '../SpaceView';

interface Props {
  tab?: string;
  people?: PeopleDTO;
  pages?: PageDTO;
  following: FollowingDTO;
  searchKeyword?: string;
  isSearchKeywordDID?: boolean;
}

const ExploreNav: React.FC<Props> = ({
  tab = 'people',
  // perPage = 1,
  people,
  pages,
  following,
  searchKeyword = '',
  isSearchKeywordDID = false
}) => {
  const [active, setActive] = useState(tab);

  return (
    <IonContent className={style['explorenav']}>
      <IonList className={style['tab-list']}>
        {/* <IonItem
          className={
            (active === 'all' ? style['tab-active'] : '') +
            ' ' +
            style['tab-item']
          }
          onClick={() => setActive('all')}
        >
          <IonLabel className={style['tab-label']}>All</IonLabel>
        </IonItem> */}
        <IonItem
          className={
            (active === 'people' ? style['tab-active'] : '') +
            ' ' +
            style['tab-item']
          }
          onClick={() => setActive('people')}
        >
          <IonLabel className={style['tab-label']}>People</IonLabel>
        </IonItem>
        <IonItem
          className={
            (active === 'spaces' ? style['tab-active'] : '') +
            ' ' +
            style['tab-item']
          }
          onClick={() => setActive('spaces')}
        >
          <IonLabel className={style['tab-label']}>Spaces</IonLabel>
        </IonItem>
        {/* <IonItem
          className={
            (active === 'pages' ? style['tab-active'] : '') +
            ' ' +
            style['tab-item']
          }
          onClick={() => setActive('pages')}
        >
          <IonLabel className={style['tab-label']}>
            Pages <ComingSoon />
          </IonLabel>
        </IonItem> */}
      </IonList>
      {active === 'all' && (
        <IonGrid className={style['tab-grid']}>
          <IonRow>
            <PeopleCard
              size="6"
              people={people}
              following={following}
              searchKeyword={searchKeyword}
              isSearchKeywordDID={isSearchKeywordDID}
            />
            {/* <PagesCard
              pages={pages}
              searchKeyword={searchKeyword}
              isSearchKeywordDID={isSearchKeywordDID}
            /> */}
          </IonRow>
        </IonGrid>
      )}
      {active === 'people' && (
        <IonGrid className={style['tab-grid']}>
          <IonRow>
            <PeopleCard
              showHeader={false}
              people={people}
              following={following}
              searchKeyword={searchKeyword}
              size="6"
            />
          </IonRow>
        </IonGrid>
      )}
      {active === 'spaces' && <SpaceView />}
      {/* {active === 'pages' && (s
        <IonGrid className={style['tab-grid']}>
          <IonRow>
            <PagesCard pages={pages} searchKeyword={searchKeyword} size="6" />
          </IonRow>
        </IonGrid>
      )} */}
    </IonContent>
  );
};

export default ExploreNav;
