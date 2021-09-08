import React, { useEffect, useState } from 'react';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import styled from 'styled-components';

import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import { InferMappedProps, SubState } from './types';

import { getVerifiedCredential } from 'src/utils/credential';

import ManageProfile from './Left/ManageProfile';
import ExploreConnnections from './Left/ExploreConnnections';
import ManageLinks from './Left/ManageLinks';
import BeginnersTutorial from './Left/BeginnersTutorial';
import WhatIsProfile from './Right/WhatIsProfile';
import ConnectWithCommunity from './Right/ConnectWithCommunity';
import ProfileCompletion from './Right/ProfileCompletion';
import VerificationStatus from './Right/VerificationStatus';
import ProfileBriefCard from 'src/components/cards/ProfileBriefCard';
import { hasCredentials } from 'src/utils/socialprofile';
import { DIDDocument } from '@elastosfoundation/did-js-sdk/';

const LeftCardCol = styled(IonCol)`
  padding: 22px 16px;
`;

const RightCardCol = styled(IonCol)`
  padding: 22px 16px;
`;

interface Props extends InferMappedProps {
  onTutorialStart: () => void;
  profile: ProfileDTO;
  didDocument: DIDDocument;
  activeTab: (tab: string) => void;
  followerDids: string[];
  followingDids: string[];
  mutualDids: string[];
}

const DashboardHome: React.FC<Props> = ({ eProps, ...props }: Props) => {
  const {
    profile,
    didDocument,
    followerDids,
    followingDids,
    mutualDids,
    session,
    onTutorialStart,
    activeTab
  } = props;

  const history = useHistory();

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
    setTutorialVisible(session.tutorialStep !== 4);
    setCompletionStats(profileCompletionStats());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, profile]);

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
          session.tutorialStep === 4 ? 'Tutorial Completed' : '',
          session.loginCred &&
          (session.loginCred.linkedin ||
            session.loginCred.twitter ||
            session.loginCred.google ||
            session.loginCred.facebook ||
            session.loginCred.github ||
            session.loginCred.discord)
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
            value: session.tutorialStep === 4 ? true : false
          },
          {
            name: 'Social Media Authenticated',
            code: 'socialMediaAuthenticated',
            value:
              session.loginCred &&
              (session.loginCred.linkedin ||
                session.loginCred.twitter ||
                session.loginCred.google ||
                session.loginCred.facebook ||
                session.loginCred.github ||
                session.loginCred.discord)
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

      verified['name'] = await isCredVerified('name', session.name);

      if (session.loginCred?.email) {
        verified['email'] = await isCredVerified(
          'email',
          session.loginCred.email
        );
      } else {
        verified['email'] = false;
      }

      if (session.loginCred?.twitter) {
        verified['twitter'] = await isCredVerified(
          'twitter',
          session.loginCred.twitter
        );
      } else {
        verified['twitter'] = false;
      }

      if (session.loginCred?.google) {
        verified['google'] = await isCredVerified(
          'google',
          session.loginCred.google
        );
      } else {
        verified['google'] = false;
      }

      if (session.loginCred?.facebook) {
        verified['facebook'] = await isCredVerified(
          'facebook',
          session.loginCred.facebook
        );
      } else {
        verified['facebook'] = false;
      }

      if (session.loginCred?.linkedin) {
        verified['linkedin'] = await isCredVerified(
          'linkedin',
          session.loginCred.linkedin
        );
      } else {
        verified['linkedin'] = false;
      }

      if (session.loginCred?.github) {
        verified['github'] = await isCredVerified(
          'github',
          session.loginCred.github
        );
      } else {
        verified['github'] = false;
      }

      if (session.loginCred?.discord) {
        verified['discord'] = await isCredVerified(
          'discord',
          session.loginCred.discord
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
              tutorialStep={session.tutorialStep}
            />
          )}
          <ManageProfile profile={profile} />
          {!hasFollowUsers && session.did && session.did !== '' && (
            <ExploreConnnections session={session} did={session.did} />
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
            <ProfileBriefCard
              category={'social'}
              title={'Profiles Linked'}
              data={didDocument}
              exploreAll={() => {}}
            />
          )}
          {followerDids.length > 0 && (
            <ProfileBriefCard
              category={'follower'}
              title={'Followers'}
              data={followerDids}
              exploreAll={() => {
                history.push('/connections/followers');
              }}
            />
          )}
          {followingDids.length > 0 && (
            <ProfileBriefCard
              category={'following'}
              title={'Following'}
              data={followingDids}
              exploreAll={() => {
                history.push('/connections/followings');
              }}
            />
          )}
          {mutualDids.length > 0 && (
            <ProfileBriefCard
              category={'mutual'}
              title={'Mutual Follower'}
              data={mutualDids}
              exploreAll={() => {
                history.push('/connections/mutual-followers');
              }}
            />
          )}
          <ProfileBriefCard
            category={'badge'}
            title={'Badges'}
            data={session.badges!}
            exploreAll={() => {
              activeTab('badges');
            }}
          />
        </RightCardCol>
      </IonRow>
    </IonGrid>
  );
};

// export default DashboardHome;
export const mapStateToProps = createStructuredSelector<SubState, SubState>({
  session: makeSelectSession()
});

export function mapDispatchToProps(dispatch: any) {
  return {
    eProps: {
      setSession: (props: { session: ISessionItem }) =>
        dispatch(setSession(props))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardHome);
