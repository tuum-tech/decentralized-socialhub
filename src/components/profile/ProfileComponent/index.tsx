import { IonCol, IonGrid, IonRow } from '@ionic/react';
import React from 'react';
import styled from 'styled-components';

import { FollowType } from 'src/services/user.service';

import AboutCard from 'src/components/cards/AboutCard';
import EducationCard from 'src/components/cards/EducationCard';
import ExperienceCard from 'src/components/cards/ExperienceCard';
import SocialProfilesCard from 'src/components/cards/SocialProfileCard';
import FollowCards from 'src/components/follow/FollowCards';

import theme from 'src/data/theme';

import PublicProfileTabs from './PublicProfileTabs';
import ProfileHeader from './ProfileHeader';

const GridContent = styled(IonGrid)<ThemeProps>`
  width: 100%;
  z-index: 100;
  background-color: ${({ template }: ThemeProps) =>
    (theme as any)[template].pageBg};
`;

const LeftContent = styled.div`
  width: calc(100% - 300px);
  padding-right: 22px;
`;

const RightContent = styled.div`
  width: 300px;
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
  didDocument: any;
  publicUser: any;
  publicUserProfile: any;
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
    'social'
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
            <PublicProfileTabs
              template={publicUser.pageTemplate}
              scrollToPosition={scrollToElement}
            />
            <GridContent template={publicUser.pageTemplate || 'default'}>
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
                              template={publicUser.pageTemplate || 'default'}
                            />
                          )}
                        </div>
                        <div ref={educationRef}>
                          {publicFields.includes('education') && (
                            <EducationCard
                              educationDTO={publicUserProfile.educationDTO}
                              isEditable={false}
                              isPublicPage={true}
                              template={publicUser.pageTemplate || 'default'}
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
                          template={publicUser.pageTemplate || 'default'}
                          viewAll={(ctype: FollowType) => {
                            if (viewAllClicked) viewAllClicked(ctype);
                          }}
                        />
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
