/**
 * Page
 */
import { IonContent, IonPage, IonGrid, IonRow, IonCol } from '@ionic/react';
import React from 'react';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import { InferMappedProps, SubState } from './types';

import { UserService } from 'src/services/user.service';
import Logo from 'src/elements/Logo';
import LeftSideMenu from 'src/components/layouts/LeftSideMenu';
import style from './style.module.scss';
import ProfileEditor from './components/ProfileEditor';

const ManagerPage: React.FC<InferMappedProps> = ({
  eProps,
  ...props
}: InferMappedProps) => {
  const Header = styled.div`
    width: 100%;
    height: 83px;
    background: #fff;
    padding: 27px 25px 20px 48px;
  `;

  const PageTitle = styled.h2`
    font-family: 'SF Pro Display';
    font-size: 28px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.36;
    letter-spacing: normal;
    text-align: left;
    color: #27272e;
  `;

  return (
    <>
      <IonPage className={style['managerpage']}>
        <IonContent className={style['content-page']}>
          <IonGrid className={style['profilepagegrid']}>
            <IonRow className={style['profilecontent']}>
              <IonCol size="2" className={style['left-panel']}>
                <Logo />
                <LeftSideMenu />
              </IonCol>
              <IonCol size="10" className={style['right-panel']}>
                <Header>
                  <PageTitle>Profile Manager</PageTitle>
                </Header>
                {props.session && (
                  <ProfileEditor
                    session={props.session}
                    updateSession={async (newSession: {
                      session: ISessionItem;
                    }) => {
                      const updatedSession = await UserService.updateSession(
                        newSession.session
                      );
                      eProps.setSession({ session: updatedSession });
                    }}
                  />
                )}
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

export default connect(mapStateToProps, mapDispatchToProps)(ManagerPage);
