import { IonPage, IonGrid, IonRow, IonCol, IonRouterLink } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import ProfileComponent from 'src/components/profile/ProfileComponent';
import { UserService } from 'src/services/user.service';
import PageLoading from 'src/components/layouts/PageLoading';
import {
  ProfileService,
  defaultUserInfo,
  defaultFullProfile
} from 'src/services/profile.service';

import style from './style.module.scss';
import { ProfileDTO } from './types';

const SignInButton = styled(IonRouterLink)`
  width: 140px;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border-radius: 9px;
  background-color: #4c6fff;
  flex-grow: 0;
  font-family: 'SF Pro Display';
  font-size: 12px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: #ffffff;
`;

const PublicNavbar = styled(IonRow)`
  width: 100%;
  height: 83px;
  padding: 21px 0 0;
  background-color: #ffffff;
  z-index: 1001;
`;

const ContentRow = styled(IonRow)`
  width: 100%;
  height: 100%;
  padding: 0;
  background-color: #ffffff;
  z-index: 1001;
`;

interface MatchParams {
  did: string;
}

const PublicPage: React.FC<RouteComponentProps<MatchParams>> = (
  props: RouteComponentProps<MatchParams>
) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(defaultUserInfo);
  const [full_profile, setfull_profile] = useState(defaultFullProfile);

  let did: string = props.match.params.did;

  useEffect(() => {
    (async () => {
      try {
        let userInfo = await UserService.SearchUserWithDID(did);
        setUserInfo(userInfo as any);
      } catch (e) {
        setError(true);
      }

      try {
        let profile:
          | ProfileDTO
          | undefined = await ProfileService.getFullProfile(did);
        if (profile) {
          profile.basicDTO.isEnabled = true;
          profile.experienceDTO.isEnabled = true;
          profile.educationDTO.isEnabled = true;
          setfull_profile(profile);
        }
      } catch (e) {}
      setLoading(false);
    })();
  }, []);

  const scrollToPosition = (position: number) => {
    let ionContent = document.querySelector('ion-content');
    ionContent!.scrollToPoint(0, position);
  };

  if (loading) {
    return <PageLoading />;
  }

  return (
    <IonPage className={style['profilepage']}>
      <IonGrid className={style['profilepagegrid']}>
        <PublicNavbar className="ion-justify-content-between">
          <IonCol size="auto">
            <img src="../../assets/logo_profile_black.svg" />
          </IonCol>
          <IonCol size="auto">
            <IonRow>
              <IonCol>
                <SignInButton href="create-profile">
                  Register new user
                </SignInButton>
              </IonCol>
              <IonCol>
                <SignInButton href="../sign-did">Sign In</SignInButton>
              </IonCol>
            </IonRow>
          </IonCol>
        </PublicNavbar>

        <ContentRow className="ion-justify-content-around">
          <IonCol size="9">
            {userInfo && userInfo.did !== '' ? (
              <ProfileComponent
                profile={full_profile}
                sessionItem={userInfo as any}
                error={error}
              />
            ) : (
              '404 user not found'
            )}
          </IonCol>
        </ContentRow>
      </IonGrid>
    </IonPage>
  );
};

export default PublicPage;
