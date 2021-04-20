/**
 * Page
 */
import { IonPage, IonGrid, IonRow, IonCol } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import React from 'react';
import style from './style.module.scss';
import Logo from 'src/components/Logo';
import LeftSideMenu from 'src/components/layouts/LeftSideMenu';
import SearchComponent from './components/SearchComponent';
import ExploreProfileComponent from './components/ExploreProfileComponent';

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
            <LeftSideMenu />
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
