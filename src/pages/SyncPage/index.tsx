import React, { useEffect } from 'react';
import {
  IonContent,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonImg
} from '@ionic/react';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import {
  InferMappedProps,
  SubState,
  Header,
  ArrowImage,
  HeaderInfo,
  PageTitle,
  PageSubtitle,
  Content
} from './types';

import style from './style.module.scss';

import Logo from 'src/elements/Logo';
import LeftSideMenu from 'src/components/layouts/LeftSideMenu';

import arrowLeft from '../../assets/icon/arrow-left-square.svg';
import SyncProgressCard from './components/SyncProgressCard';
import SyncItemsCard from './components/SyncItemsCard';

const SyncPage: React.FC<InferMappedProps> = ({
  eProps,
  ...props
}: InferMappedProps) => {
  useEffect(() => {
    console.log('I am on manager page');
  }, []);
  return (
    <>
      <IonPage className={style['syncpage']}>
        <IonContent className={style['profilecontent']}>
          <IonGrid className={style['profilepagegrid']}>
            <IonRow className={style['profilecontent']}>
              <IonCol size="2" className={style['left-panel']}>
                <Logo />
                <LeftSideMenu />
              </IonCol>
              <IonCol size="10" className={style['right-panel']}>
                <Header>
                  <ArrowImage
                    onClick={() => (window.location.href = '/manager')}
                  >
                    <IonImg src={arrowLeft}></IonImg>
                  </ArrowImage>
                  <HeaderInfo>
                    <PageTitle>Profile Manager</PageTitle>
                    <PageSubtitle>Sync Profile</PageSubtitle>
                  </HeaderInfo>
                </Header>
                <Content>
                  <SyncProgressCard
                    totalAmount={10}
                    onSync={async () => {}}
                  ></SyncProgressCard>
                  <SyncItemsCard></SyncItemsCard>
                </Content>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    </>
  );
};

export const mapStateToProps = createStructuredSelector<SubState, SubState>({
  session: makeSelectSession()
});

export function mapDispatchToProps(dispatch: any) {
  return {
    eProps: {
      setSession: (props: { session: ISessionItem }) =>
        dispatch(setSession(props))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SyncPage);
