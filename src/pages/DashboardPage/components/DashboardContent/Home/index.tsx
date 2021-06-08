import React, { useEffect, useState } from 'react';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import styled from 'styled-components';

import FollowCards from 'src/components/follow/FollowCards';
import SocialProfilesCard from 'src/components/cards/SocialProfileCard/SocialCard';
import { getVerifiedCredential } from 'src/utils/credential';

import ManageProfile from './Left/ManageProfile';
import ExploreConnnections from './Left/ExploreConnnections';
import ManageLinks from './Left/ManageLinks';
import BeginnersTutorial from './Left/BeginnersTutorial';
import WhatIsProfile from './Right/WhatIsProfile';
import ConnectWithCommunity from './Right/ConnectWithCommunity';
import ProfileCompletion from './Right/ProfileCompletion';
import VerificationStatus from './Right/VerificationStatus';
import Badges from './Right/Badges';
import { hasCredentials } from 'src/utils/socialprofile';

const LeftCardCol = styled(IonCol)`
  padding: 22px 16px;
`;

const RightCardCol = styled(IonCol)`
  padding: 22px 16px;
`;

interface Props {
  onTutorialStart: () => void;
  profile: ProfileDTO;
  sessionItem: ISessionItem;
  didDocument: any;
  activeTab: (tab: string) => void;
  viewAll: (isFollower: boolean) => void;
  followerDids: string[];
  followingDids: string[];
}

const DashboardHome: React.FC<Props> = ({
  profile,
  sessionItem,
  didDocument,
  followerDids,
  followingDids,
  onTutorialStart,
  activeTab,
  viewAll
}) => {
  const [tutorialVisible, setTutorialVisible] = useState(true);
  const [hasFollowUsers, setFollowUsers] = useState(false);

  const [completionStats, setCompletionStats] = useState<any[]>([]);
  const [completionStatsDisplay, setCompletionStatsDisplay] = useState<any[]>(
    []
  );
  const [completionPercent, setCompletionPercent] = useState(0);
  const [verifiedStats, setVerifiedStats] = useState<any[]>([]); //overall verified stats
  const [verifiedPercent, setVerifiedPercent] = useState(0); //overall verified percent

  useEffect(() => {
    setTutorialVisible(sessionItem.tutorialStep !== 4);
    setCompletionStats(profileCompletionStats());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionItem, profile]);

  useEffect(() => {
    let percentAggregated = '0';
    percentAggregated =
      completionStats.length &&
      completionStats
        .map(el => el.stats.percentCompleted)
        .reduce((accumulator: any, currentValue: any) => {
          return accumulator + currentValue;
        });

    setCompletionPercent(parseInt(percentAggregated) / completionStats.length);
  }, [completionStats]);

  useEffect(() => {
    setFollowUsers(followingDids.length + followerDids.length > 0);
  }, [followingDids, followerDids]);

  const hasSocialProfiles = hasCredentials(didDocument);

  const profileCompletionStats = () => {
    const completionStatsDisplay = [
      {
        title: 'Setup your account',
        targetList: ['Tutorial Completed', 'Social Media Authenticated'],
        accomplishedList: [
          sessionItem.tutorialStep === 4 ? 'Tutorial Completed' : '',
          sessionItem.loginCred &&
          (sessionItem.loginCred.linkedin ||
            sessionItem.loginCred.twitter ||
            sessionItem.loginCred.google ||
            sessionItem.loginCred.facebook ||
            sessionItem.loginCred.github ||
            sessionItem.loginCred.discord)
            ? 'Social Media Authenticated'
            : ''
        ].filter(a => a !== '')
      },
      {
        title: 'Add Content to Profile',
        targetList: ['Added About me', 'Added Experience', 'Added Education'],
        accomplishedList: [
          profile.basicDTO && profile.basicDTO.about ? 'Added About me' : '',
          profile.experienceDTO.items.length ? 'Added Experience' : '',
          profile.educationDTO.items.length ? 'Added Education' : ''
        ].filter(a => a !== '')
      }
    ];

    setCompletionStatsDisplay(completionStatsDisplay);

    const profileCompletion = [
      {
        name: 'Setup your account',
        code: 'accountSetup',
        items: [
          {
            name: 'Tutorial Completed',
            code: 'tutorialCompleted',
            value: sessionItem.tutorialStep === 4 ? true : false
          },
          {
            name: 'Social Media Authenticated',
            code: 'socialMediaAuthenticated',
            value:
              sessionItem.loginCred &&
              (sessionItem.loginCred.linkedin ||
                sessionItem.loginCred.twitter ||
                sessionItem.loginCred.google ||
                sessionItem.loginCred.facebook ||
                sessionItem.loginCred.github ||
                sessionItem.loginCred.discord)
                ? true
                : false
          }
        ],
        stats: {}
      },
      {
        name: 'Add Content to Profile',
        code: 'profileContent',
        items: [
          {
            name: 'Added About Me',
            code: 'about',
            value: profile.basicDTO && profile.basicDTO.about ? true : false
          },
          {
            name: 'Added Education',
            code: 'education',
            value: profile.educationDTO.items.length ? true : false
          },
          {
            name: 'Added Experience',
            code: 'experience',
            value: profile.experienceDTO.items.length ? true : false
          }
        ],
        stats: {}
      }
    ];

    let itemsCount: any = [];

    profileCompletion.map((catTree, index) => {
      let totalItems = 0;
      let completedItems = 0;

      catTree.items.map(item => {
        totalItems++;
        if (item.value) {
          completedItems++;
        }
        return null;
      });

      itemsCount.push({
        completedItems: completedItems,
        totalItems: totalItems
      });
      return null;
    });

    for (let i = 0; i < itemsCount.length; i++) {
      profileCompletion[i].stats = {
        completedItems: itemsCount[i].completedItems,
        totalItems: itemsCount[i].totalItems,
        percentCompleted:
          (itemsCount[i].completedItems * 100) / itemsCount[i].totalItems
      };
    }

    return profileCompletion;
  };

  /* Verification starts */
  const isCredVerified = async (key: string, profileValue: string) => {
    let vc = getVerifiedCredential(key, didDocument);
    if (!vc) return false;

    return vc.value === profileValue && vc.isVerified;
  };

  useEffect(() => {
    (async () => {
      const verified: any = {};

      verified['name'] = await isCredVerified('name', sessionItem.name);

      if (sessionItem.loginCred?.email) {
        verified['email'] = await isCredVerified(
          'email',
          sessionItem.loginCred.email
        );
      } else {
        verified['email'] = false;
      }

      if (sessionItem.loginCred?.twitter) {
        verified['twitter'] = await isCredVerified(
          'twitter',
          sessionItem.loginCred.twitter
        );
      } else {
        verified['twitter'] = false;
      }

      if (sessionItem.loginCred?.google) {
        verified['google'] = await isCredVerified(
          'google',
          sessionItem.loginCred.google
        );
      } else {
        verified['google'] = false;
      }

      if (sessionItem.loginCred?.facebook) {
        verified['facebook'] = await isCredVerified(
          'facebook',
          sessionItem.loginCred.facebook
        );
      } else {
        verified['facebook'] = false;
      }

      if (sessionItem.loginCred?.linkedin) {
        verified['linkedin'] = await isCredVerified(
          'linkedin',
          sessionItem.loginCred.linkedin
        );
      } else {
        verified['linkedin'] = false;
      }

      if (sessionItem.loginCred?.github) {
        verified['github'] = await isCredVerified(
          'github',
          sessionItem.loginCred.github
        );
      } else {
        verified['github'] = false;
      }

      if (sessionItem.loginCred?.discord) {
        verified['discord'] = await isCredVerified(
          'discord',
          sessionItem.loginCred.discord
        );
      } else {
        verified['discord'] = false;
      }
      /* Calculate verified education credentials starts */
      profile.educationDTO.items.map(async (x, i) => {
        verified['education' + i] = x.isVerified;
      });
      /* Calculate verified education credentials ends */

      /* Calculate verified experience credentials starts */

      profile.experienceDTO.items.map(async (x, i) => {
        verified['experience' + i] = x.isVerified;
      });
      /* Calculate verified experience credentials ends */

      setVerifiedStats(verified);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  useEffect(() => {
    let verifiedCred = 0;
    let totalCred = 0;

    Object.keys(verifiedStats).forEach((key: any) => {
      if (verifiedStats[key]) verifiedCred++;
      totalCred++;
    });

    setVerifiedPercent((verifiedCred * 100) / totalCred);
  }, [verifiedStats]);
  /* Verification ends */

  return (
    <IonGrid className="ion-no-padding">
      <IonRow className="ion-no-padding">
        <LeftCardCol size="8">
          {tutorialVisible && (
            <BeginnersTutorial
              onTutorialStart={onTutorialStart}
              tutorialStep={sessionItem.tutorialStep}
            />
          )}
          <ManageProfile profile={profile} />
          {!hasFollowUsers && sessionItem.did && sessionItem.did !== '' && (
            <ExploreConnnections session={sessionItem} did={sessionItem.did} />
          )}
          {!hasSocialProfiles && <ManageLinks />}
        </LeftCardCol>
        <RightCardCol size="4">
          <VerificationStatus progress={verifiedPercent} />
          <ProfileCompletion
            progress={completionPercent}
            completionStats={completionStatsDisplay}
          />
          <WhatIsProfile />
          <ConnectWithCommunity />
          {hasSocialProfiles && (
            <SocialProfilesCard
              diddocument={didDocument}
              sessionItem={sessionItem}
              showManageButton={false}
            />
          )}
          <Badges
            badges={sessionItem.badges!}
            exploreAll={() => {
              activeTab('badges');
            }}
          />
          {sessionItem.tutorialStep === 4 && (
            <FollowCards
              followerDids={followerDids}
              followingDids={followingDids}
              signed={true}
              viewAll={viewAll}
            />
          )}
        </RightCardCol>
      </IonRow>
    </IonGrid>
  );
};

export default DashboardHome;
