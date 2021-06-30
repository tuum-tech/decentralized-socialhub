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
import { UserService } from 'src/services/user.service';
import { DidDocumentService } from 'src/services/diddocument.service';

import ViewAllFollowModal from 'src/components/follow/ViewAllFollowModal';
import LoadingIndicator from 'src/elements/LoadingIndicator';
import ProfileComponent from 'src/components/profile/ProfileComponent';
import PublicNavbar from 'src/components/profile/ProfileComponent/PublicNavbar';

import { ContentRow, Container, ProfileComponentContainer } from './layouts';

interface MatchParams {
  did: string;
}
interface PageProps
  extends InferMappedProps,
    RouteComponentProps<MatchParams> {}

const PublicPage: React.FC<PageProps> = ({ eProps, ...props }: PageProps) => {
  let did: string = props.match.params.did;

  const [publicUser, setPublicUser] = useState(defaultUserInfo);
  const [publicUserProfile, setPublicUserProfile] = useState(
    defaultFullProfile
  );
  const [didDocument, setDidDocument] = useState<any>({});

  const [publicFields, setPublicFields] = useState<string[]>([]);
  const [showAllFollow, setShowAllFollow] = useState(0);
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

  useEffect(() => {
    (async () => {
      if (!props.session || props.session.did === '') return;

      setLoading(true);
      const followerDids = await FollowService.getFollowerDids(
        props.match.params.did,
        props.session
      );
      setFollowerDids(followerDids);

      const followingdids = await FollowService.getFollowingDids(
        props.match.params.did,
        props.session
      );
      setFollowingDids(followingdids);

      const pFields = await ProfileService.getPublicFields(
        props.match.params.did
      );
      setPublicFields(pFields);

      let pUser = await UserService.SearchUserWithDID(props.match.params.did);
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
        let documentState = await DidDocumentService.getUserDocumentByDid(
          props.match.params.did
        );
        setDidDocument(documentState.diddocument);
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
                  viewAllClicked={(isFollower: boolean) => {
                    setShowAllFollow(isFollower ? 1 : 2);
                  }}
                  followerDids={followerDids}
                  followingDids={followingDids}
                  publicUser={publicUser}
                  publicUserProfile={publicUserProfile}
                  didDocument={didDocument}
                  loading={loading}
                />
              </ProfileComponentContainer>
            </IonCol>
          </ContentRow>
        </IonContent>
      </IonGrid>
      {showAllFollow > 0 && (
        <ViewAllFollowModal
          showFollowerCard={publicFields.includes('follower')}
          showFollowingCard={publicFields.includes('following')}
          followerDids={followerDids}
          followingDids={followingDids}
          setFollowerDids={setFollowerDids}
          setFollowingDids={setFollowingDids}
          onClose={() => setShowAllFollow(0)}
          isFollower={showAllFollow === 1}
          editable={did === props.session.did}
          userSession={props.session}
        />
      )}
    </Container>
  );
};

// export default PublicPage;

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
