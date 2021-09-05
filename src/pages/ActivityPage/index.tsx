import React, { useEffect, useState } from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol } from '@ionic/react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import Logo from 'src/elements/Logo';
import LeftSideMenu from 'src/components/layouts/LeftSideMenu';

import ActivityTimeline from './components/ActivityTimeline';
import VerificationRequests from './components/VerificationRequests';
import MyRequests from './components/MyRequests';
import {
  ActivityPageHeader,
  Header,
  PageTitle,
  ActivityTabsContainer
} from './components/SubComponents';

import { InferMappedProps, SubState } from './types';
import style from './style.module.scss';

const ActivityPage: React.FC<InferMappedProps> = ({
  eProps,
  ...props
}: InferMappedProps) => {
  const [active, setActive] = useState('myrequests'); // timeline or veificationrequests

  useEffect(() => {
    console.log('I am on manager page');
  }, []);
  return (
    <>
      <IonPage className={style['activitypage']}>
        <IonContent className={style['content-page']}>
          <IonGrid className={style['profilepagegrid']}>
            <IonRow className={style['profilecontent']}>
              <IonCol size="2" className={style['left-panel']}>
                <Logo />
                <LeftSideMenu />
              </IonCol>
              <IonCol size="10" className={style['right-panel']}>
                <Header>
                  <PageTitle>Activities</PageTitle>
                </Header>
                <ActivityTabsContainer template="default">
                  <ActivityPageHeader active={active} setActive={setActive} />
                  {active === 'timeline' && (
                    <ActivityTimeline session={props.session} />
                  )}
                  {active === 'myrequests' && (
                    <MyRequests session={props.session} />
                  )}
                  {active === 'verificationrequests' && (
                    <VerificationRequests session={props.session} />
                  )}
                </ActivityTabsContainer>
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

export default connect(mapStateToProps, mapDispatchToProps)(ActivityPage);
