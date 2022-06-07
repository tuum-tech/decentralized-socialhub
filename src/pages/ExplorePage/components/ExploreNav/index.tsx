import React, { useState } from 'react';
import { IonContent, IonGrid, IonLabel, IonList, IonRow } from '@ionic/react';
import styled from 'styled-components';
import { down } from 'styled-breakpoints';

import PeopleCard from 'src/components/cards/PeopleCard';
import SpaceView from '../SpaceView';
import { TabItem } from 'src/elements-v2/tabs';

export const TabList = styled(IonList)`
  background: #f7fafc;
  padding: 5px 30px;
`;

const Container = styled(IonContent)`
  background: #f7fafc;
  height: calc(100vh - 80px);
`;

const TabGrid = styled(IonGrid)`
  background: #f7fafc;
  min-height: 100%;
  padding: 5px 30px;

  ${down('sm')} {
    padding: 5px 0;
  }
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
    <Container>
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
        <TabGrid>
          <IonRow>
            <PeopleCard
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
        </TabGrid>
      )}
      {active === 'people' && (
        <TabGrid>
          <IonRow className="ion-no-padding">
            <PeopleCard
              showHeader={false}
              people={people}
              following={following}
              searchKeyword={searchKeyword}
            />
          </IonRow>
        </TabGrid>
      )}
      {active === 'spaces' && <SpaceView searchKeyword={searchKeyword} />}
      {/* {active === 'pages' && (s
        <TabGrid>
          <IonRow>
            <PagesCard pages={pages} searchKeyword={searchKeyword} size="6" />
          </IonRow>
        </TabGrid>
      )} */}
    </Container>
  );
};

export default ExploreNav;
