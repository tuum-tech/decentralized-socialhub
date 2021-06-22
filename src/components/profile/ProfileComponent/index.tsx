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
import FollowCards from 'src/components/follow/FollowCards';
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
  followerDids: string[];
  followingDids: string[];
  scrollToElement: (cardName: string) => void;
  viewAllClicked?: (isFollower: boolean) => void;
  publicFields?: string[];
  userSession: ISessionItem;
}

const ProfileComponent: React.FC<Props> = ({
  targetDid,
  aboutRef,
  experienceRef,
  educationRef,
  followerDids,
  followingDids,
  scrollToElement,
  viewAllClicked,
  publicFields = [
    'follower',
    'following',
    'about',
    'experience',
    'education',
    'social'
  ],
  userSession
}: Props) => {
  const [publicUser, setPublicUser] = useState(defaultUserInfo);
  const [publicUserProfile, setPublicUserProfile] = useState(
    defaultFullProfile
  );
  const [didDocument, setDidDocument] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (targetDid && targetDid !== '') {
        setLoading(true);
        let pUser = await UserService.SearchUserWithDID(targetDid);
        if (pUser && pUser.did) {
          setPublicUser(pUser as any);
          let profile = await ProfileService.getFullProfile(
            targetDid,
            userSession
          );
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
  }, [targetDid, userSession]);

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
        signedUser={userSession}
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
                          {publicFields.includes('about') && (
                            <AboutCard
                              aboutText={publicUserProfile.basicDTO.about}
                              mode="read"
                            />
                          )}
                        </div>
                        <div ref={experienceRef}>
                          {publicFields.includes('experience') && (
                            <ExperienceCard
                              experienceDTO={publicUserProfile.experienceDTO}
                              isEditable={false}
                              isPublicPage={true}
                            />
                          )}
                        </div>
                        <div ref={educationRef}>
                          {publicFields.includes('education') && (
                            <EducationCard
                              educationDTO={publicUserProfile.educationDTO}
                              isEditable={false}
                              isPublicPage={true}
                            />
                          )}
                        </div>
                      </LeftContent>
                      <RightContent>
                        {publicFields.includes('social') &&
                          didDocument &&
                          didDocument.id && (
                            <SocialProfilesCard
                              didDocument={didDocument}
                              // sessionItem={publicUser}
                              targetUser={publicUser}
                            />
                          )}
                        <FollowCards
                          showFollowerCard={publicFields.includes('follower')}
                          showFollowingCard={publicFields.includes('following')}
                          followerDids={followerDids}
                          followingDids={followingDids}
                          signed={userSession.did !== ''}
                          viewAll={(isFollower: boolean) => {
                            if (viewAllClicked) viewAllClicked(isFollower);
                          }}
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
