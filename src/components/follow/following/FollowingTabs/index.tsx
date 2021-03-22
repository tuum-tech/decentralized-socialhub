import React, { useState } from 'react';
import {
  IonContent,
  IonList,
  IonLabel,
  IonItem,
  IonGrid,
  IonRow
} from '@ionic/react';
import style from './style.module.scss';
import { PageDTO, PeopleDTO } from '../types';
import PeopleCard from 'src/components/cards/PeopleCard';
import PagesCard from 'src/components/cards/PagesCard';
import { FollowingDTO } from 'src/components/search/types';

interface Props {
  tab?: string;
  people?: PeopleDTO;
  following?: FollowingDTO;
  pages?: PageDTO;
  searchKeyword?: string;
  isSearchKeywordDID?: boolean;
}

const FollowingTabs: React.FC<Props> = ({
  tab = 'people',
  // perPage = 1,
  people,
  following,
  pages,
  searchKeyword = '',
  isSearchKeywordDID = false
}) => {
  const [active, setActive] = useState(tab);

  return (
    <IonContent className={style['followingtabs']}>
      <IonList className={style['tab-list']}>
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
            (active === 'pages' ? style['tab-active'] : '') +
            ' ' +
            style['tab-item']
          }
          onClick={() => setActive('pages')}
        >
          <IonLabel className={style['tab-label']}>Pages</IonLabel>
        </IonItem>
      </IonList>

      {active === 'people' && (
        <IonGrid className={style['tab-grid']}>
          <IonRow>
            <PeopleCard
              people={people}
              following={following}
              searchKeyword={searchKeyword}
              size="6"
            />
          </IonRow>
        </IonGrid>
      )}
      {active === 'pages' && (
        <IonGrid className={style['tab-grid']}>
          <IonRow>
            <PagesCard pages={pages} searchKeyword={searchKeyword} size="6" />
          </IonRow>
        </IonGrid>
      )}
    </IonContent>
  );
};

export default FollowingTabs;
