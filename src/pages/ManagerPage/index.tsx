/**
 * Page
 */
import { IonContent, IonPage, IonGrid, IonRow, IonCol } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import { InferMappedProps, SubState } from './types';

import { UserService } from 'src/services/user.service';
import { DidService } from 'src/services/did.service.new';

import { ViewProfileButton } from 'src/elements/buttons';
import LeftSideMenu from 'src/components/layouts/LeftSideMenu';
import style from './style.module.scss';
import ProfileEditor from './components/ProfileEditor';
import { getDIDString } from 'src/utils/did';

const Header = styled.div`
  width: 100%;
  height: 83px;
  background: #fff;
  padding: 27px 48px 20px;

  display: flex;
  justify-content: space-between;
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

const WarningText = styled.div`
  color: red;
  font-size: 15px;
  margin-top: 20px;
  padding: 0 40px;
`;

const ManagerPage: React.FC<InferMappedProps> = ({
  eProps,
  ...props
}: InferMappedProps) => {
  const [user, setUser] = useState<ISessionItem>({} as ISessionItem);
  useEffect(() => {
    if (props.session && props.session.did !== '') {
      setUser(props.session);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <IonPage className={style['managerpage']}>
        <IonContent className={style['content-page']}>
          <IonGrid className={style['profilepagegrid']}>
            <IonRow className={style['profilecontent']}>
              <IonCol size="2" className={style['left-panel']}>
                <LeftSideMenu />
              </IonCol>
              <IonCol size="10" className={style['right-panel']}>
                <Header>
                  <PageTitle>Profile Manager</PageTitle>
                  <ViewProfileButton
                    onClick={() => {
                      if (user.tutorialStep === 4) {
                        window.open(getDIDString('/did/' + user.did));
                      }
                    }}
                    style={{
                      width: '200px',
                      cursor:
                        user.tutorialStep === 4 ? ' pointer' : 'not-allowed'
                    }}
                  >
                    View profile
                  </ViewProfileButton>
                </Header>

                {user.tutorialStep !== 4 && (
                  <WarningText>
                    Please complete the tutorial first before managing your
                    Profile.
                  </WarningText>
                )}

                {user && user.did && user.did !== '' && (
                  <ProfileEditor
                    session={user}
                    updateSession={async (newSession: {
                      session: ISessionItem;
                    }) => {
                      let userService = new UserService(
                        await DidService.getInstance()
                      );
                      await eProps.setSession({
                        session: await userService.updateSession(
                          newSession.session
                        )
                      });
                      setUser(newSession.session);
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
