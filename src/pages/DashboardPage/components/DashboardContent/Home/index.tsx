import React, { useEffect, useState } from 'react';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

import {
  containingVerifiableCredentialDetails,
  VCType
} from 'src/utils/credential';

import ManageProfile from './Left/ManageProfile';
import ExploreConnections from './Left/ExploreConnections';
import ManageLinks from './Left/ManageLinks';
import BeginnersTutorial from './Left/BeginnersTutorial';
import ConnectWithCommunity from './Right/ConnectWithCommunity';
import ProfileCompletion from './Right/ProfileCompletion';
import VerificationStatus from './Right/VerificationStatus';
import ProfileBriefCard from 'src/components/cards/ProfileBriefCard';
import { hasCredentials } from 'src/utils/socialprofile';
import { DIDDocument } from '@elastosfoundation/did-js-sdk/';

import NewVerificationContent, {
  NewVerificationModal
} from 'src/pages/ActivityPage/components/MyRequests/NewVerification';
import { VerificationService } from 'src/services/verification.service';
import SentModalContent, {
  SentModal
} from 'src/pages/ActivityPage/components/MyRequests/SentModal';
import Slides from 'src/elements-v2/Slides';
import { DIDDocumentAtom, FullProfileAtom } from 'src/Atoms/Atoms';
import useSession from 'src/hooks/useSession';
import useProfileFilled from 'src/hooks/useProfileFilled';
import WhatIsProfile from './Right/WhatIsProfile';

const LeftCardCol = styled(IonCol)`
  padding: 22px 16px;
`;

const RightCardCol = styled(IonCol)`
  padding: 22px 16px;
`;

interface Props {
  onTutorialStart: () => void;
  activeTab: (tab: string) => void;
  followerDids: string[];
  followingDids: string[];
  mutualDids: string[];
}

const DashboardHome: React.FC<Props> = ({
  followerDids,
  followingDids,
  mutualDids,
  onTutorialStart,
  activeTab
}: Props) => {
  const history = useHistory();
  const { session } = useSession();
  const { filledContent } = useProfileFilled();

  const [tutorialVisible, setTutorialVisible] = useState(true);
  const [hasFollowUsers, setFollowUsers] = useState(false);

  const [completionStats, setCompletionStats] = useState<any[]>([]);
  const [completionStatsDisplay, setCompletionStatsDisplay] = useState<any[]>(
    []
  );
  const [completionPercent, setCompletionPercent] = useState(0);
  const [verifiedStats, setVerifiedStats] = useState<any[]>([]); //overall verified stats
  const [verifiedPercent, setVerifiedPercent] = useState(0); //overall verified percent
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showSentModal, setShowSentModal] = useState(false);
  const profile = useRecoilValue(FullProfileAtom);

  let didDocumentString = useRecoilValue(DIDDocumentAtom);
  const [didDocument, setDidDocument] = useState<DIDDocument | null>(null);

  const sendRequest = async (
    dids: string[],
    credentials: VerificationData[],
    msg: string
  ) => {
    const vService = new VerificationService();
    await vService.sendRequest(session, dids, credentials, msg);
    setShowVerificationModal(false);
    setShowSentModal(true);
  };

  useEffect(() => {
    if (didDocumentString !== '')
      setDidDocument(DIDDocument._parseOnly(didDocumentString));
  }, [didDocumentString]);

  useEffect(() => {
    const profileCompletionStats = () => {
      const completionStatsDisplay = [
        {
          title: 'Setup Account',
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
          title: 'Profile Completion',
          targetList: ['Add About me', 'Add Experience', 'Add Education'],
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
    setCompletionStats(profileCompletionStats());
    setTutorialVisible(session.tutorialStep !== 4);
  }, [profile, session]);

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

  const hasSocialProfiles = hasCredentials(didDocument as DIDDocument);

  /* Verification starts */
  const isCredVerified = async (key: string, profileValue: string) => {
    let {
      isVerified,
      isValid
    }: VCType = await containingVerifiableCredentialDetails(
      key,
      didDocument as DIDDocument
    );

    return isVerified && isValid;
  };

  useEffect(() => {
    (async () => {
      const verified: any = {};
      verified['name'] =
        profile.name.verifiers && profile.name.verifiers.length > 0;

      if (session.loginCred?.email) {
        verified['email'] =
          profile.email.verifiers && profile.email.verifiers.length > 0;
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
        verified['education' + i] = x.verifiers && x.verifiers.length > 0;
      });
      /* Calculate verified education credentials ends */

      /* Calculate verified experience credentials starts */
      profile.experienceDTO.items.map(async (x, i) => {
        verified['experience' + i] = x.verifiers && x.verifiers.length > 0;
      });
      // /* Calculate verified experience credentials ends */

      setVerifiedStats(verified);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  useEffect(() => {
    // nameScore
    let nameScore = 0;
    if ((verifiedStats as any)['name']) {
      nameScore = 25;
    }

    // emailScore
    let emailScore = 0;
    if ((verifiedStats as any)['email']) {
      emailScore += 25;
    }

    // experienceScore
    let experienceScore = 0;
    if (profile.experienceDTO.items.length > 0) {
      for (let i = 0; i < profile.experienceDTO.items.length; i++) {
        if ((verifiedStats as any)['experience' + i]) {
          experienceScore++;
        }
      }
      experienceScore =
        (experienceScore / profile.experienceDTO.items.length) * 25;
    }

    //  educationScore
    let educationScore = 0;
    if (profile.educationDTO.items.length > 0) {
      for (let i = 0; i < profile.educationDTO.items.length; i++) {
        if ((verifiedStats as any)['education' + i]) {
          educationScore++;
        }
      }
      educationScore =
        (educationScore / profile.educationDTO.items.length) * 25;
    }

    setVerifiedPercent(
      nameScore + emailScore + experienceScore + educationScore
    );
  }, [
    profile.educationDTO.items.length,
    profile.experienceDTO.items.length,
    verifiedStats
  ]);
  /* Verification ends */

  return (
    <>
      <IonGrid className="ion-no-padding">
        <IonRow className="ion-no-padding">
          <LeftCardCol sizeMd="8" sizeSm="12">
            {tutorialVisible && (
              <BeginnersTutorial
                onTutorialStart={onTutorialStart}
                tutorialStep={session.tutorialStep}
              />
            )}
            {filledContent && <ManageProfile userSession={session} />}
            <Slides>
              {!filledContent && <ManageProfile userSession={session} />}
              {!hasFollowUsers && session.did && session.did !== '' && (
                <ExploreConnections session={session} did={session.did} />
              )}
              {!hasSocialProfiles && <ManageLinks />}
            </Slides>
          </LeftCardCol>
          <RightCardCol sizeMd="4" sizeSm="12">
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
                  history.push({
                    pathname: '/connections',
                    state: {
                      active: 'followers'
                    }
                  });
                }}
              />
            )}
            {followingDids.length > 0 && (
              <ProfileBriefCard
                category={'following'}
                title={'Following'}
                data={followingDids}
                exploreAll={() => {
                  history.push({
                    pathname: '/connections',
                    state: {
                      active: 'following'
                    }
                  });
                }}
              />
            )}
            {mutualDids.length > 0 && (
              <ProfileBriefCard
                category={'mutual'}
                title={'Mutual Follower'}
                data={mutualDids}
                exploreAll={() => {
                  history.push({
                    pathname: '/connections',
                    state: {
                      active: 'mutual'
                    }
                  });
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

            <ProfileBriefCard
              category={'request'}
              title={'Request Verification'}
              data={session.badges!}
              exploreAll={() => {
                setShowVerificationModal(true);
              }}
            />
          </RightCardCol>
        </IonRow>
      </IonGrid>

      <NewVerificationModal
        isOpen={showVerificationModal}
        cssClass="my-custom-class"
        backdropDismiss={false}
      >
        <NewVerificationContent
          session={session}
          onClose={() => {
            setShowVerificationModal(false);
          }}
          targetUser={session}
          sendRequest={sendRequest}
        />
      </NewVerificationModal>

      <SentModal
        isOpen={showSentModal}
        cssClass="my-custom-class"
        backdropDismiss={false}
      >
        <SentModalContent
          onClose={() => {
            setShowSentModal(false);
          }}
        />
      </SentModal>
    </>
  );
};

export default DashboardHome;
