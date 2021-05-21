import { IonPage, IonGrid, IonRow, IonContent, IonCol } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import LoadingIndicator from 'src/components/LoadingIndicator';
import ProfileComponent from 'src/components/profile/ProfileComponent';
import PublicNavbar from 'src/components/profile/PublicNavbar';
import { UserService } from 'src/services/user.service';
import { defaultUserInfo } from 'src/services/profile.service';

import ViewAllModal from 'src/components/follow/ViewAllModal';

import style from './style.module.scss';

const ContentRow = styled(IonRow)`
  background-color: #f7fafc !important;
  padding: 16px;
`;

interface MatchParams {
  did: string;
}

const PublicPage: React.FC<RouteComponentProps<MatchParams>> = (
  props: RouteComponentProps<MatchParams>
) => {
  let did: string = props.match.params.did;
  const [showAllFollow, setShowAllFollow] = useState(0);
  const [signedUser, setSignedUser] = useState(defaultUserInfo);
  const [loading, setLoading] = useState(true);
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
      let did: string = props.match.params.did;
      if (did && did !== '') {
        setLoading(true);
        let sUser = await UserService.GetUserSession();
        if (sUser && sUser.did) setSignedUser(sUser);
      }
      setLoading(false);
    })();
  }, [props.match.params.did]);

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
          <PublicNavbar signedIn={signedUser && signedUser.did !== ''} />
          <ContentRow className="ion-justify-content-around">
            <IonCol size="9" className="ion-no-padding">
              <div className={style['profilecomponent']}>
                <ProfileComponent
                  hasBanner={true}
                  targetDid={did}
                  scrollToElement={scrollToElement}
                  aboutRef={aboutRef}
                  experienceRef={experienceRef}
                  educationRef={educationRef}
                  viewAllClicked={(isFollower: boolean) => {
                    setShowAllFollow(isFollower ? 1 : 2);
                  }}
                />
              </div>
            </IonCol>
          </ContentRow>
        </IonContent>
      </IonGrid>
      {showAllFollow > 0 && (
        <ViewAllModal
          isFollower={showAllFollow === 1}
          targetDid={props.match.params.did}
          onClose={() => setShowAllFollow(0)}
        />
      )}
    </IonPage>
  );
};

export default PublicPage;
