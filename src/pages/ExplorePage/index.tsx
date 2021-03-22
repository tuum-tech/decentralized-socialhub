/**
 * Page
 */
import { IonPage, IonGrid, IonRow, IonCol } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import React from 'react';
import style from './style.module.scss';
import Logo from 'src/components/Logo';
import DashboardNavBar from 'src/components/layouts/Navbar/DashboardNavbar';
import SearchComponent from 'src/components/search/SearchComponent';
import ExploreProfileComponent from 'src/components/ExploreProfileComponent';

interface MatchParams {
  did: string;
}

const ExplorePage: React.FC<RouteComponentProps<MatchParams>> = (
  props: RouteComponentProps<MatchParams>
) => {
  return (
    <IonPage className={style['explorepage']}>
      <IonGrid className={style['profilepagegrid']}>
        <IonRow className={style['profilecontent']}>
          <IonCol size="2" className={style['left-panel']}>
            <Logo />
            <DashboardNavBar />
          </IonCol>
          <IonCol size="10" className={style['right-panel']}>
            {props.match.params.did === undefined ? (
              <SearchComponent />
            ) : (
              <ExploreProfileComponent did={props.match.params.did} />
            )}
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonPage>
  );
};

export default ExplorePage;
