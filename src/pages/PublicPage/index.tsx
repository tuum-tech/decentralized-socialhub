import { IonPage, IonGrid, IonRow, IonCol } from '@ionic/react';
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
import { DashboardSignInButton } from 'src/components/buttons';

import style from './style.module.scss';

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
  const [publicUser, setPublicUser] = useState<ISessionItem>(defaultUserInfo);
  const [publicUserProfile, setPublicUserProfile] = useState(
    defaultFullProfile
  );
  const [signedIn, setSignedIn] = useState(false);

  let did: string = props.match.params.did;
  useEffect(() => {
    (async () => {
      try {
        const pUser = await UserService.SearchUserWithDID(did);
        if (pUser && pUser.did !== '') {
          setPublicUser(pUser as ISessionItem);
        }
        let profile:
          | ProfileDTO
          | undefined = await ProfileService.getFullProfile(did);
        if (profile) {
          profile.basicDTO.isEnabled = true;
          profile.experienceDTO.isEnabled = true;
          profile.educationDTO.isEnabled = true;
          setPublicUserProfile(profile);
        }
        const sUser = UserService.GetUserSession();
        if (sUser && sUser.did !== '') {
          setSignedIn(true);
        }
      } catch (error) {
        console.log('======>error', error);
      }

      setLoading(false);
    })();
  }, []);

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
            {!signedIn && (
              <IonRow>
                <IonCol>
                  <DashboardSignInButton href="/create-profile">
                    Register new user
                  </DashboardSignInButton>
                </IonCol>
                <IonCol>
                  <DashboardSignInButton href="/sign-did">
                    Sign In
                  </DashboardSignInButton>
                </IonCol>
              </IonRow>
            )}
          </IonCol>
        </PublicNavbar>
        <ContentRow className="ion-justify-content-around">
          <IonCol size="9">
            {publicUser && publicUser.did !== '' ? (
              <ProfileComponent
                profile={publicUserProfile}
                sessionItem={publicUser as any}
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
