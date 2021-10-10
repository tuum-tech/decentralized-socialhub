import { IonGrid, IonContent, IonCol } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import React, { useEffect, useRef, useState } from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import { InferMappedProps, SubState } from './types';

import {
  ProfileService,
  defaultUserInfo,
  defaultFullProfile
} from 'src/services/profile.service';
import { FollowService } from 'src/services/follow.service';
import { FollowType, UserService } from 'src/services/user.service';
import { DidDocumentService } from 'src/services/diddocument.service';

import ViewAllFollowModal from 'src/components/ViewAllFollowModal';
import LoadingIndicator from 'src/elements/LoadingIndicator';
import ProfileComponent from 'src/components/profile/ProfileComponent';
import PublicNavbar from 'src/components/profile/ProfileComponent/PublicNavbar';

import { ContentRow, Container, ProfileComponentContainer } from './layouts';
import { DidService } from 'src/services/did.service.new';
import { DIDDocument } from '@elastosfoundation/did-js-sdk/';

interface MatchParams {
  did: string;
}
interface PageProps
  extends InferMappedProps,
    RouteComponentProps<MatchParams> {}

const PublicPage: React.FC<PageProps> = ({ eProps, ...props }: PageProps) => {
  let did: string = props.match.params.did;

  const [publicUser, setPublicUser] = useState(defaultUserInfo);
  const [publicUserProfile, setPublicUserProfile] = useState<ProfileDTO>(
    defaultFullProfile
  );
  const [didDocument, setDidDocument] = useState<DIDDocument | null>(null);

  const [publicFields, setPublicFields] = useState<string[]>([]);
  const [showAllFollow, setShowAllFollow] = useState<boolean>(false);
  const [followType, setFollowType] = useState<FollowType>(FollowType.Follower);
  const [scrollTop, setScrollTop] = useState(0);
  const [loading, setLoading] = useState(false);

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

  const [followerDids, setFollowerDids] = useState<string[]>([]);
  const [followingDids, setFollowingDids] = useState<string[]>([]);
  const [mutualDids, setMutualDids] = useState<string[]>([]);

  useEffect(() => {
    const mutualDids = followingDids.filter(
      (did: any) => followerDids.indexOf(did) !== -1
    );
    setMutualDids(mutualDids);
  }, [followerDids, followingDids]);

  useEffect(() => {
    (async () => {
      let userService = new UserService(await DidService.getInstance());

      setLoading(true);

      if (props.session.tutorialStep === 4) {
        const followerDids = await FollowService.getFollowerDids(
          props.match.params.did
        );
        setFollowerDids(followerDids);

        const followingdids = await FollowService.getFollowingDids(
          props.match.params.did
        );
        setFollowingDids(followingdids);

        const pFields = await ProfileService.getPublicFields(
          props.match.params.did
        );
        setPublicFields(pFields);
      }

      let pUser = await userService.SearchUserWithDID(props.match.params.did);
      if (pUser && pUser.did) {
        setPublicUser(pUser as any);
        let profile = await ProfileService.getFullProfile(
          props.match.params.did,
          props.session
        );
        if (profile) {
          profile.basicDTO.isEnabled = true;
          profile.experienceDTO.isEnabled = true;
          profile.educationDTO.isEnabled = true;
          setPublicUserProfile(profile);
        }
        let document = await DidDocumentService.getUserDocumentByDid(
          props.match.params.did
        );
        setDidDocument(document);
      }

      setLoading(false);
    })();
  }, [props.match.params.did, props.session]);

  if (loading) {
    return <LoadingIndicator loadingText="Loading data..." />;
  }

  return (
    <Container>
      <IonGrid className="profilepagegrid ion-no-padding">
        <IonContent
          ref={contentRef}
          scrollEvents={true}
          onIonScroll={(e: any) => {
            setScrollTop(e.detail.scrollTop);
          }}
        >
          <PublicNavbar signedIn={props.session && props.session.did !== ''} />
          <ContentRow
            className="ion-justify-content-around"
            template={publicUser.pageTemplate || 'default'}
          >
            <IonCol size="9" className="ion-no-padding">
              <ProfileComponentContainer>
                <ProfileComponent
                  publicFields={publicFields}
                  userSession={props.session}
                  scrollToElement={scrollToElement}
                  aboutRef={aboutRef}
                  experienceRef={experienceRef}
                  educationRef={educationRef}
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
              </ProfileComponentContainer>
            </IonCol>
          </ContentRow>
        </IonContent>
      </IonGrid>
      {showAllFollow && (
        <ViewAllFollowModal
          followerDids={followerDids}
          followingDids={followingDids}
          mutualDids={mutualDids}
          setFollowerDids={setFollowerDids}
          setFollowingDids={setFollowingDids}
          onClose={() => setShowAllFollow(false)}
          followType={followType}
          editable={did === props.session.did}
          userSession={props.session}
        />
      )}
    </Container>
  );
};

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

export default connect(mapStateToProps, mapDispatchToProps)(PublicPage);
