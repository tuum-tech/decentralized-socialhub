import { IonCol, IonGrid, IonRow } from '@ionic/react';
import React from 'react';
import styled from 'styled-components';
import { FollowType } from 'src/services/user.service';
import AboutCard from 'src/components/cards/AboutCard';
import FollowCards from 'src/components/cards/FollowCards';
import { getThemeData } from 'src/utils/template';

import ProfileTabs from './ProfileTabs';
import ProfileHeader from './ProfileHeader';

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
  scrollToElement: (cardName: string) => void;
  publicUser?: ISessionItem;
  profile: any;
  loading: boolean;
}

const ProfileComponent: React.FC<Props> = ({
  aboutRef,
  scrollToElement,
  publicUser,
  profile,
  loading
}: Props) => {
  const template = publicUser?.pageTemplate || 'default';
  return (
    <>
      <ProfileHeader profile={profile} />

      {!loading && (
        <>
          <ProfileTabs template={template} scrollToPosition={scrollToElement} />
          <GridContent template={template}>
            <IonRow className="ion-justify-content-center">
              <IonCol size="12">
                <IonGrid>
                  <IonRow>
                    <LeftContent>
                      <div ref={aboutRef}>
                        {profile.publicFields.includes('about') && (
                          <AboutCard
                            aboutText={profile.description}
                            mode="read"
                          />
                        )}
                      </div>
                    </LeftContent>
                    <RightContent>
                      <FollowCards
                        showFollowerCard={profile.publicFields.includes(
                          'follower'
                        )}
                        followerDids={profile.followers || []}
                        followingDids={[]}
                        mutualDids={[]}
                        signed={true}
                        template={template}
                        viewAll={(ctype: FollowType) => {}}
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
