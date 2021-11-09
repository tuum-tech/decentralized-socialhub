import { IonCol, IonGrid, IonRow } from '@ionic/react';
import React from 'react';
import styled from 'styled-components';

import { FollowType } from 'src/services/user.service';

import AboutCard from 'src/components/cards/AboutCard';
import EducationCard from 'src/components/cards/EducationCard';
import ExperienceCard from 'src/components/cards/ExperienceCard';
import SocialProfilesCard from 'src/components/cards/SocialProfileCard';
import BadgeCard from 'src/components/cards/BadgeCard';
import FollowCards from 'src/components/cards/FollowCards';
import { getThemeData } from 'src/utils/template';

import PublicProfileTabs from './PublicProfileTabs';
import ProfileHeader from './ProfileHeader';
import { DIDDocument } from '@elastosfoundation/did-js-sdk/';

const GridContent = styled(IonGrid)<ThemeProps>`
  width: 100%;
  min-height: 600px;
  z-index: 100;
  background-color: ${({ template }: ThemeProps) =>
    getThemeData(template, 'gridContent', 'backgroundColor')};
`;

const LeftContent = styled.div`
  width: calc(100% - 360px);
  padding-right: 22px;
`;

const RightContent = styled.div`
  width: 360px;
`;

interface Props {
  aboutRef: any;
  experienceRef: any;
  educationRef: any;
  followerDids: string[];
  followingDids: string[];
  mutualDids: string[];
  scrollToElement: (cardName: string) => void;
  viewAllClicked?: (ctype: FollowType) => void;
  publicFields?: string[];
  userSession: ISessionItem;
  didDocument: DIDDocument;
  publicUser: ISessionItem;
  publicUserProfile: ProfileDTO;
  loading: boolean;
}

const ProfileComponent: React.FC<Props> = ({
  aboutRef,
  experienceRef,
  educationRef,
  followerDids,
  followingDids,
  mutualDids,
  scrollToElement,
  viewAllClicked,
  publicFields = [
    'follower',
    'following',
    'about',
    'experience',
    'education',
    'social',
    'badge'
  ],
  userSession,
  didDocument,
  publicUser,
  publicUserProfile,
  loading
}: Props) => {
  const displayText = loading
    ? 'Loading User Data ...'
    : publicUser.did === ''
    ? 'User Not found'
    : !publicUserProfile.basicDTO.isEnabled
    ? 'This profile is not visible'
    : '';
  const template = publicUser.pageTemplate || 'default';

  return (
    <>
      <ProfileHeader
        onlyText={displayText}
        publicUser={publicUser}
        publicUserProfile={publicUserProfile}
        signedUser={userSession}
      />

      {!loading &&
        publicUser.did !== '' &&
        publicUserProfile.basicDTO.isEnabled === true && (
          <>
            {template === 'default' && (
              <PublicProfileTabs
                template={template}
                scrollToPosition={scrollToElement}
              />
            )}
            <GridContent template={template}>
              <IonRow className="ion-justify-content-center">
                <IonCol size="12">
                  <IonGrid>
                    <IonRow>
                      <LeftContent>
                        <div ref={aboutRef}>
                          {publicFields.includes('about') && (
                            <AboutCard
                              template={publicUser.pageTemplate}
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
                              template={template}
                              userSession={publicUser}
                            />
                          )}
                        </div>
                        <div ref={educationRef}>
                          {publicFields.includes('education') && (
                            <EducationCard
                              educationDTO={publicUserProfile.educationDTO}
                              isEditable={false}
                              isPublicPage={true}
                              template={template}
                              userSession={publicUser}
                            />
                          )}
                        </div>
                      </LeftContent>
                      <RightContent>
                        {publicFields.includes('social') && didDocument && (
                          <SocialProfilesCard
                            setSession={() => {}}
                            didDocument={didDocument}
                            targetUser={publicUser}
                          />
                        )}
                        <FollowCards
                          showFollowerCard={publicFields.includes('follower')}
                          showFollowingCard={publicFields.includes('following')}
                          showMutualFollowerCard={publicFields.includes(
                            'mutual'
                          )}
                          followerDids={followerDids}
                          followingDids={followingDids}
                          mutualDids={mutualDids}
                          signed={userSession.did !== ''}
                          template={template}
                          viewAll={(ctype: FollowType) => {
                            if (viewAllClicked) viewAllClicked(ctype);
                          }}
                        />
                        {publicFields.includes('badge') &&
                          publicUser.badges && (
                            <BadgeCard
                              badges={publicUser.badges}
                              template={template}
                            />
                          )}
                      </RightContent>
                    </IonRow>
                  </IonGrid>
                </IonCol>
              </IonRow>
            </GridContent>
          </>
        )}
    </>
  );
};

export default ProfileComponent;
