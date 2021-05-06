import { IonCol, IonGrid, IonRow } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import {
  ProfileService,
  defaultUserInfo,
  defaultFullProfile
} from 'src/services/profile.service';
import { DidDocumentService } from 'src/services/diddocument.service';
import { UserService } from 'src/services/user.service';

import AboutCard from 'src/components/cards/AboutCard';
import EducationCard from 'src/components/cards/EducationCard';
import ExperienceCard from 'src/components/cards/ExperienceCard';
import SocialProfilesCard from 'src/components/cards/SocialProfileCard';
import FollowCards from 'src/components/FollowCards';
import PublicProfileTabs from '../PublicProfileTabs';
import ProfileHeader from '../ProfileHeader';

import style from './style.module.scss';

const LeftContent = styled.div`
  width: calc(100% - 300px);
  padding-right: 22px;
`;

const RightContent = styled.div`
  width: 300px;
`;

interface Props {
  targetDid: string;
  aboutRef: any;
  experienceRef: any;
  educationRef: any;
  scrollToElement: (cardName: string) => void;
  hasBanner?: boolean;
}

const ProfileComponent: React.FC<Props> = ({
  targetDid,
  aboutRef,
  experienceRef,
  educationRef,
  scrollToElement,
  hasBanner = false
}: Props) => {
  const [publicUser, setPublicUser] = useState(defaultUserInfo);
  const [signedUser, setSignedUser] = useState(defaultUserInfo);
  const [publicUserProfile, setPublicUserProfile] = useState(
    defaultFullProfile
  );
  const [didDocument, setDidDocument] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (targetDid && targetDid !== '') {
        setLoading(true);
        let sUser = await UserService.GetUserSession();
        if (sUser && sUser.did) setSignedUser(sUser);
        let pUser = await UserService.SearchUserWithDID(targetDid);
        if (pUser && pUser.did) {
          setPublicUser(pUser as any);
          let profile = await ProfileService.getFullProfile(targetDid);
          if (profile) {
            profile.basicDTO.isEnabled = true;
            profile.experienceDTO.isEnabled = true;
            profile.educationDTO.isEnabled = true;
            setPublicUserProfile(profile);
          }
          let documentState = await DidDocumentService.getUserDocumentByDid(
            targetDid
          );
          setDidDocument(documentState.diddocument);
        }
      }
      setLoading(false);
    })();
  }, [targetDid]);

  const displayText = loading
    ? 'Loading User Data ...'
    : publicUser.did === ''
    ? 'User Not found'
    : !publicUserProfile.basicDTO.isEnabled
    ? 'This profile is not visible'
    : '';

  return (
    <>
      <ProfileHeader
        onlyText={displayText}
        user={publicUser}
        signedUserDid={signedUser.did}
        hasBanner={hasBanner}
      />
      {!loading &&
        publicUser.did !== '' &&
        publicUserProfile.basicDTO.isEnabled === true && (
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
                            aboutText={publicUserProfile.basicDTO.about}
                            mode="read"
                          />
                        </div>
                        <div ref={experienceRef}>
                          <ExperienceCard
                            experienceDTO={publicUserProfile.experienceDTO}
                            isEditable={false}
                            isPublicPage={true}
                          />
                        </div>
                        <div ref={educationRef}>
                          <EducationCard
                            educationDTO={publicUserProfile.educationDTO}
                            isEditable={false}
                            isPublicPage={true}
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
                          signed={signedUser.did !== ''}
                        />
                      </RightContent>
                    </IonRow>
                  </IonGrid>
                </IonCol>
              </IonRow>
            </IonGrid>
          </>
        )}
    </>
  );
};

export default ProfileComponent;
