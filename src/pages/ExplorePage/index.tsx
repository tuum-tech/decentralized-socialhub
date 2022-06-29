import { DidService } from 'src/services/did.service.new';
import { DIDDocument } from '@elastosfoundation/did-js-sdk/';
import React, { useState, useEffect, useRef } from 'react';
import { IonContent } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import styled from 'styled-components';

import {
  ProfileService,
  defaultUserInfo,
  defaultFullProfile
} from 'src/services/profile.service';
import { FollowService } from 'src/services/follow.service';
import { FollowType, UserService } from 'src/services/user.service';
import { DidDocumentService } from 'src/services/diddocument.service';

import ProfileComponent from 'src/components/profile/ProfileComponent';
import ViewAllFollowModal from 'src/components/ViewAllFollowModal';
import SearchComponent from './components/SearchComponent';
import arrowLeft from '../../assets/icon/arrow-left-square.svg';

import style from './style.module.scss';
import { getDIDString } from 'src/utils/did';
import useSession from 'src/hooks/useSession';
import MainLayout from 'src/components/layouts/MainLayout';

const Header = styled.div`
  width: 100%;
  background: #fff;
  padding: 13px 15px 10px 22px;
  border-bottom: 1px solid #edf2f7;s
`;

const PageTitle = styled.h2`
  font-family: 'SF Pro Display';
  font-size: 28px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.36;
  letter-spacing: normal;
  text-align: left;
  color: #27272e;
  display: inline;
  margin-left: 10px;
`;

const ArrowImage = styled.img`
  margin-bottom: 5px;
`;

interface MatchParams {
  did: string;
}
interface PageProps extends RouteComponentProps<MatchParams> {}

const ExplorePage: React.FC<PageProps> = ({ match }: PageProps) => {
  const { session } = useSession();
  let did = getDIDString(match.params.did, false);
  const [publicFields, setPublicFields] = useState<string[]>([]);
  const [followerDids, setFollowerDids] = useState<string[]>([]);
  const [followingDids, setFollowingDids] = useState<string[]>([]);
  const [mutualDids, setMutualDids] = useState<string[]>([]);

  const [publicUser, setPublicUser] = useState(defaultUserInfo);
  const [publicUserProfile, setPublicUserProfile] = useState<ProfileDTO>(
    defaultFullProfile
  );
  const [didDocument, setDidDocument] = useState<DIDDocument | null>(null);

  const [loading, setLoading] = useState(true);

  const [followType, setFollowType] = useState<FollowType>(FollowType.Follower);
  const [showAllFollow, setShowAllFollow] = useState<boolean>(false);
  const [scrollTop, setScrollTop] = useState(0);

  const contentRef = useRef<HTMLIonContentElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const experienceRef = useRef<HTMLDivElement | null>(null);
  const educationRef = useRef<HTMLDivElement | null>(null);
  const walletRef = useRef<HTMLDivElement | null>(null);
  const teamRef = useRef<HTMLDivElement | null>(null);
  const thesisRef = useRef<HTMLDivElement | null>(null);
  const paperRef = useRef<HTMLDivElement | null>(null);
  const gameExpRef = useRef<HTMLDivElement | null>(null);
  const licenseRef = useRef<HTMLDivElement | null>(null);
  const certificationRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    const mutualDids = followingDids.filter(
      (did: any) => followerDids.indexOf(did) !== -1
    );
    setMutualDids(mutualDids);
  }, [followerDids, followingDids]);

  useEffect(() => {
    (async () => {
      setLoading(true);

      if (session.onBoardingCompleted) {
        const pFields = await ProfileService.getPublicFields(did);
        setPublicFields(pFields);

        const followerDids = await FollowService.getFollowerDids(did);
        setFollowerDids(followerDids);

        const followingdids = await FollowService.getFollowingDids(did);
        setFollowingDids(followingdids);
      }

      if (did && did !== '') {
        let userService = new UserService(await DidService.getInstance());
        let pUser = await userService.SearchUserWithDID(did);
        if (pUser && pUser.did) {
          setPublicUser(pUser as any);

          let profile = await ProfileService.getFullProfile(did, session);
          if (profile) {
            profile.basicDTO.isEnabled = true;
            profile.experienceDTO.isEnabled = true;
            profile.educationDTO.isEnabled = true;
            setPublicUserProfile(profile);
          }
          let document = await DidDocumentService.getUserDocumentByDid(did);

          setDidDocument(document);
        }
      }

      setLoading(false);
    })();
  }, [session, did]);

  return (
    <MainLayout>
      {did === undefined ? (
        <SearchComponent userSession={session} />
      ) : (
        <div className={style['explore-profile-container']}>
          <Header>
            <ArrowImage
              onClick={() => (window.location.href = '/explore')}
              src={arrowLeft}
              alt="arrow-left"
            />
            <PageTitle>Explore</PageTitle>
          </Header>
          <IonContent
            style={{
              height: 'calc(100% - 83px)'
            }}
            ref={contentRef}
            scrollEvents={true}
            onIonScroll={(e: any) => {
              setScrollTop(e.detail.scrollTop);
            }}
          >
            <ProfileComponent
              publicFields={publicFields}
              userSession={session}
              scrollToElement={scrollToElement}
              aboutRef={aboutRef}
              experienceRef={experienceRef}
              educationRef={educationRef}
              walletRef={walletRef}
              teamRef={teamRef}
              thesisRef={thesisRef}
              paperRef={paperRef}
              gameExpRef={gameExpRef}
              licenseRef={licenseRef}
              certificationRef={certificationRef}
              viewAllClicked={(ctype: FollowType) => {
                setShowAllFollow(true);
                setFollowType(ctype);
              }}
              followerDids={followerDids}
              followingDids={followingDids}
              mutualDids={mutualDids}
              publicUser={publicUser}
              publicUserProfile={publicUserProfile}
              didDocument={didDocument as DIDDocument}
              loading={loading}
            />
          </IonContent>
        </div>
      )}
      {showAllFollow && (
        <ViewAllFollowModal
          userSession={session}
          followerDids={followerDids}
          followingDids={followingDids}
          mutualDids={mutualDids}
          setFollowerDids={setFollowerDids}
          setFollowingDids={setFollowingDids}
          onClose={() => setShowAllFollow(false)}
          followType={followType}
          editable={false}
        />
      )}
    </MainLayout>
  );
};

export default ExplorePage;
