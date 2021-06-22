import React, { useState, useEffect, useRef } from 'react';
import { IonPage, IonGrid, IonRow, IonCol, IonContent } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import styled from 'styled-components';

import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { makeSelectSession } from 'src/store/users/selectors';
import { SubState, InferMappedProps } from './types';
import { setSession } from 'src/store/users/actions';

import { ProfileService } from 'src/services/profile.service';
import { FollowService } from 'src/services/follow.service';
import Logo from 'src/components/Logo';
import LeftSideMenu from 'src/components/layouts/LeftSideMenu';

import ProfileComponent from 'src/components/profile/ProfileComponent';
import ViewAllFollowModal from 'src/components/follow/ViewAllFollowModal';
import SearchComponent from './components/SearchComponent';
import arrowLeft from '../../assets/icon/arrow-left-square.svg';

import style from './style.module.scss';

const Header = styled.div`
  width: 100%;
  // height: 83px;
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
interface PageProps
  extends InferMappedProps,
    RouteComponentProps<MatchParams> {}

const ExplorePage: React.FC<PageProps> = ({ eProps, ...props }: PageProps) => {
  const [publicFields, setPublicFields] = useState<string[]>([]);
  const [followerDids, setFollowerDids] = useState<string[]>([]);
  const [followingDids, setFollowingDids] = useState<string[]>([]);

  const [showAllFollow, setShowAllFollow] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

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

  useEffect(() => {
    (async () => {
      const pFields = await ProfileService.getPublicFields(
        props.match.params.did
      );
      setPublicFields(pFields);

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
    })();
  }, [props.session, props.match.params.did]);

  return (
    <IonPage className={style['explorepage']}>
      <IonGrid className={style['profilepagegrid']}>
        <IonRow className={style['profilecontent']}>
          <IonCol size="2" className={style['left-panel']}>
            <Logo />
            <LeftSideMenu />
          </IonCol>
          <IonCol size="10" className={style['right-panel']}>
            {props.match.params.did === undefined ? (
              <SearchComponent userSession={props.session} />
            ) : (
              <div className={style['exploreprofilecomponent']}>
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
                    height: 'calc(100% - 83px'
                  }}
                  ref={contentRef}
                  scrollEvents={true}
                  onIonScroll={(e: any) => {
                    setScrollTop(e.detail.scrollTop);
                  }}
                >
                  <ProfileComponent
                    publicFields={publicFields}
                    userSession={props.session}
                    targetDid={props.match.params.did}
                    scrollToElement={scrollToElement}
                    aboutRef={aboutRef}
                    experienceRef={experienceRef}
                    educationRef={educationRef}
                    viewAllClicked={(isFollower: boolean) => {
                      setShowAllFollow(isFollower ? 1 : 2);
                    }}
                    followerDids={followerDids}
                    followingDids={followingDids}
                  />
                </IonContent>
              </div>
            )}
          </IonCol>
        </IonRow>
      </IonGrid>
      {showAllFollow > 0 && (
        <ViewAllFollowModal
          userSession={props.session}
          showFollowerCard={publicFields.includes('follower')}
          showFollowingCard={publicFields.includes('following')}
          followerDids={followerDids}
          followingDids={followingDids}
          setFollowerDids={setFollowerDids}
          setFollowingDids={setFollowingDids}
          onClose={() => setShowAllFollow(0)}
          isFollower={showAllFollow === 1}
          editable={false}
        />
      )}
    </IonPage>
  );
};

// export default ExplorePage;
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

export default connect(mapStateToProps, mapDispatchToProps)(ExplorePage);
