/**
 * Page
 */
import { IonContent, IonPage, IonGrid, IonRow, IonCol } from '@ionic/react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injector from 'src/baseplate/injectorWrap';
import { matchPath, RouteComponentProps } from 'react-router';
import React, { memo } from 'react';
import style from './style.module.scss';
import { NameSpace } from './constants';
import Logo from 'src/components/Logo';
import Navbar from 'src/components/layouts/Navbar';
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
            <Navbar tab="explore" />
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
