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
import PagesCard from 'src/components/cards/PagesCard';
import NoConnectionComp from 'src/components/NoConnection';

import style from './style.module.scss';

interface Props {
  tab?: string;
  people?: PeopleDTO;
  following: FollowingDTO;
  pages?: PageDTO;
  searchKeyword?: string;
  isSearchKeywordDID?: boolean;
}

const FollowingTabs: React.FC<Props> = ({
  tab = 'people',
  people,
  following,
  pages,
  searchKeyword = '',
  isSearchKeywordDID = false
}) => {
  return (
    <IonContent className={style['followingtabs']}>
      <IonGrid className={style['tab-grid']}>
        <IonRow>
          {people?.items.length === 0 ? (
            <NoConnectionComp pageType="followingPeople" />
          ) : (
            <PeopleCard
              people={people}
              following={following}
              searchKeyword={searchKeyword}
              size="6"
            />
          )}
        </IonRow>
      </IonGrid>
    </IonContent>
  );
};

export default FollowingTabs;
