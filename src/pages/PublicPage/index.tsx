import { IonPage, IonGrid, IonRow, IonContent, IonCol } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { DidDocumentService } from 'src/services/diddocument.service';
import PublicNavbar from './components/PublicNavbar';
import { UserService } from 'src/services/user.service';
import PageLoading from 'src/components/layouts/PageLoading';
import {
  ProfileService,
  defaultUserInfo,
  defaultFullProfile
} from 'src/services/profile.service';
import AboutCard from 'src/components/cards/AboutCard';
import EducationCard from 'src/components/cards/EducationCard';
import ExperienceCard from 'src/components/cards/ExperienceCard';
import SocialProfilesCard from 'src/components/cards/SocialProfileCard';

import FollowCards from './components/FollowCards';
import PublicProfileTabs from './components/PublicProfileTabs';
import ProfileHeader from './components/ProfileHeader';

import style from './style.module.scss';

const ContentRow = styled(IonRow)`
  background-color: #f7fafc !important;
  padding: 16px;
`;

const LeftContent = styled.div`
  width: calc(100% - 300px);
`;

const RightContent = styled.div`
  width: 300px;
`;

interface MatchParams {
  did: string;
}

const PublicPage: React.FC<RouteComponentProps<MatchParams>> = (
  props: RouteComponentProps<MatchParams>
) => {
  const [loading, setLoading] = useState(true);
  const [signedInUser, setSignedInUser] = useState(defaultUserInfo);
  const [publicUser, setPublicUser] = useState<ISessionItem>(defaultUserInfo);
  const [didDocument, setDidDocument] = useState<any>({});
  const [publicUserProfile, setPublicUserProfile] = useState(
    defaultFullProfile
  );

  let did: string = props.match.params.did;

  // const setTimer = () => {
  //   const timer = setTimeout(async () => {
  //     await refreshDidDocument();
  //     setTimer();
  //   }, 1000);
  //   return () => clearTimeout(timer);
  // };
  // const refreshDidDocument = async () => {
  //   let documentState = await DidDocumentService.getUserDocumentByDid(did);
  //   setDidDocument(documentState.diddocument);
  // };

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
          setSignedInUser(sUser);
        }
        let documentState = await DidDocumentService.getUserDocumentByDid(did);
        setDidDocument(documentState.diddocument);
        // setTimer();
      } catch (error) {
        // console.log('======>error', error);
      }

      setLoading(false);
    })();
  }, []);

  const [scrollTop, setScrollTop] = useState(0);

  const contentRef = useRef<HTMLIonContentElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const experienceRef = useRef<HTMLDivElement | null>(null);
  const educationRef = useRef<HTMLDivElement | null>(null);

  const scrollToElement = (cardName: string) => {
    let point: number = 0;
    let adjust = 0;
    if (scrollTop < 176) adjust = 292 - scrollTop;
    else {
      adjust = 260 - scrollTop;
    }

    if (cardName === 'about') {
      point = 0;
    }
    if (cardName === 'experience') {
      point = (experienceRef.current!.getBoundingClientRect().top -
        adjust) as number;
    }
    if (cardName === 'education') {
      point = (educationRef.current!.getBoundingClientRect().top -
        adjust) as number;
    }
    contentRef.current && contentRef.current.scrollToPoint(0, point, 200);
  };

  const handleScroll = (e: any) => {
    setScrollTop(e.detail.scrollTop);
  };

  if (loading) {
    return <PageLoading />;
  }

  return (
    <IonPage className={style['profilepage']}>
      <IonGrid className={style['profilepagegrid'] + ' ion-no-padding'}>
        <IonContent
          ref={contentRef}
          scrollEvents={true}
          onIonScroll={handleScroll}
        >
          <PublicNavbar signedIn={signedInUser && signedInUser.did !== ''} />
          {!publicUser || publicUser.did === '' ? (
            'User not found'
          ) : (
            <ContentRow className="ion-justify-content-around">
              <IonCol size="9" className="ion-no-padding">
                <div className={style['profilecomponent']}>
                  <ProfileHeader
                    user={publicUser as ISessionItem}
                    signedUserDid={signedInUser.did}
                  />

                  {publicUserProfile.basicDTO.isEnabled === true ? (
                    <>
                      <PublicProfileTabs scrollToPosition={scrollToElement} />
                      <IonGrid className={style['scroll']}>
                        <IonRow className="ion-justify-content-center">
                          <IonCol size="12">
                            <IonGrid>
                              <IonRow>
                                <LeftContent>
                                  <div ref={aboutRef}>
                                    <AboutCard
                                      aboutText={
                                        publicUserProfile.basicDTO.about
                                      }
                                      mode="read"
                                    />
                                  </div>
                                  <div ref={experienceRef}>
                                    <ExperienceCard
                                      experienceDTO={
                                        publicUserProfile.experienceDTO
                                      }
                                      isEditable={false}
                                    />
                                  </div>
                                  <div ref={educationRef}>
                                    <EducationCard
                                      educationDTO={
                                        publicUserProfile.educationDTO
                                      }
                                      isEditable={false}
                                    />
                                  </div>
                                </LeftContent>
                                <RightContent>
                                  {didDocument && didDocument.id && (
                                    <SocialProfilesCard
                                      didDocument={didDocument}
                                      sessionItem={publicUser}
                                    />
                                  )}

                                  <FollowCards
                                    did={publicUser.did}
                                    signed={signedInUser.did !== ''}
                                  />
                                </RightContent>
                              </IonRow>
                            </IonGrid>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </>
                  ) : (
                    <IonGrid>
                      <IonRow className="ion-justify-content-center">
                        <IonCol size="auto">
                          The content of this profile is not currently viewable
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  )}
                </div>
              </IonCol>
            </ContentRow>
          )}
        </IonContent>
      </IonGrid>
    </IonPage>
  );
};

export default PublicPage;
