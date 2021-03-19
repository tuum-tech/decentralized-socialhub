import {
  IonContent,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonRouterLink
} from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import ProfileComponent from 'src/components/profile/ProfileComponent';
import { AccountType, UserService } from 'src/services/user.service';
import PageLoading from 'src/components/layouts/PageLoading';

import style from './style.module.scss';
import { EducationItem, ExperienceItem, ProfileDTO } from './types';
import { requestFullProfile } from './fetchapi';

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
  position: fixed;
  top: 0px;
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
  const [userInfo, setUserInfo] = useState({
    accountType: AccountType.DID,
    did: '',
    name: '',
    hiveHost: '',
    email: '',
    userToken: '',
    isDIDPublished: false
  });

  const [full_profile, setfull_profile] = useState({
    basicDTO: {
      isEnabled: false,
      name: '',
      did: '',
      title: '',
      email: '',
      hiveHost: '',
      about: '',
      address: {
        number: '',
        street_name: '',
        postal_code: '',
        state: '',
        country: ''
      }
    },
    educationDTO: {
      isEnabled: false,
      items: [] as EducationItem[]
    },
    experienceDTO: {
      isEnabled: false,
      items: [] as ExperienceItem[]
    }
  });

  const getFullProfile = async (did: string): Promise<any> => {
    return await requestFullProfile(did);
  };

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
        if (!error) {
          let profile: ProfileDTO = await getFullProfile(did);
          profile.basicDTO.isEnabled = true;
          profile.experienceDTO.isEnabled = true;
          profile.educationDTO.isEnabled = true;
          setfull_profile(profile);
        }
      } catch (e) {}
      // setLoaded(true);
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
      <IonContent className={style['content-scroll']}>
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

          <IonRow className="ion-justify-content-around">
            <IonCol size="12">
              {userInfo && userInfo.did !== '' ? (
                <ProfileComponent
                  scrollToPosition={scrollToPosition}
                  profile={full_profile}
                  sessionItem={userInfo as any}
                  error={error}
                />
              ) : (
                '404 user not found'
              )}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default PublicPage;
