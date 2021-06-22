import { IonPage, IonGrid, IonRow, IonContent, IonCol } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import { InferMappedProps, SubState } from './types';

import { ProfileService } from 'src/services/profile.service';
import { FollowService } from 'src/services/follow.service';
import ViewAllFollowModal from 'src/components/follow/ViewAllFollowModal';
import LoadingIndicator from 'src/components/LoadingIndicator';
import ProfileComponent from 'src/components/profile/ProfileComponent';
import PublicNavbar from 'src/components/profile/PublicNavbar';

import style from './style.module.scss';

const ContentRow = styled(IonRow)`
  background-color: #f7fafc !important;
  padding: 16px;
`;

interface MatchParams {
  did: string;
}
interface PageProps
  extends InferMappedProps,
    RouteComponentProps<MatchParams> {}

const PublicPage: React.FC<PageProps> = ({ eProps, ...props }: PageProps) => {
  let did: string = props.match.params.did;

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
      setLoading(false);
    })();
  }, [props.match.params.did, props.session]);

  if (loading) {
    return <LoadingIndicator loadingText="Loading data..." />;
  }

  return (
    <IonPage className={style['profilepage']}>
      <IonGrid className={style['profilepagegrid'] + ' ion-no-padding'}>
        <IonContent
          ref={contentRef}
          scrollEvents={true}
          onIonScroll={(e: any) => {
            setScrollTop(e.detail.scrollTop);
          }}
        >
          <PublicNavbar signedIn={props.session && props.session.did !== ''} />
          <ContentRow className="ion-justify-content-around">
            <IonCol size="9" className="ion-no-padding">
              <div className={style['profilecomponent']}>
                <ProfileComponent
                  publicFields={publicFields}
                  targetDid={did}
                  scrollToElement={scrollToElement}
                  aboutRef={aboutRef}
                  experienceRef={experienceRef}
                  educationRef={educationRef}
                  viewAllClicked={(isFollower: boolean) => {
                    setShowAllFollow(isFollower ? 1 : 2);
                  }}
                  followerDids={followerDids}
                  followingDids={followingDids}
                  userSession={props.session}
                />
              </div>
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
    </IonPage>
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
