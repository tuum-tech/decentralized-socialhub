import React, { useState } from 'react';
import { IonContent, IonGrid, IonLabel, IonList, IonRow } from '@ionic/react';
import styled from 'styled-components';

import PeopleCard from 'src/components/cards/PeopleCard';
import style from './style.module.scss';
import SpaceView from '../SpaceView';
import { TabItem } from 'src/elements-v2/tabs';

export const TabList = styled(IonList)`
  background: #f7fafc;
  padding: 5px 30px;
`;

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
      <TabList>
        {/* <TabItem
          active={active === 'all'}
          onClick={() => setActive('all')}
        >
          <IonLabel>All</IonLabel>
        </TabItem> */}
        <TabItem
          active={active === 'people'}
          onClick={() => setActive('people')}
        >
          <IonLabel>People</IonLabel>
        </TabItem>
        <TabItem
          active={active === 'spaces'}
          onClick={() => setActive('spaces')}
        >
          <IonLabel>Spaces</IonLabel>
        </TabItem>
        {/* <TabItem active={active === 'pages'} onClick={() => setActive('pages')}>
          <IonLabel>
            Pages <ComingSoon />
          </IonLabel>
        </TabItem> */}
      </TabList>
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
      {active === 'spaces' && <SpaceView searchKeyword={searchKeyword} />}
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
