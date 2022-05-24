import { IonGrid, IonContent, IonCol } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import React, { useEffect, useRef, useState } from 'react';

import { Guid } from 'guid-typescript';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import { InferMappedProps, SubState } from './types';

import { defaultUserInfo } from 'src/services/profile.service';
import { UserService } from 'src/services/user.service';
import { DidService } from 'src/services/did.service.new';

import LoadingIndicator from 'src/elements/LoadingIndicator';
import ProfileComponent from './Personal/components/ProfileComponent';
import Navbar from 'src/components/profile/ProfileComponent/PublicNavbar';

import { getDIDString } from 'src/utils/did';

import { ContentRow, Container, ProfileComponentContainer } from './layouts';
import {
  defaultSpace,
  SpaceCategory,
  SpaceService
} from 'src/services/space.service';
import NFTSpace from './NFT';
interface MatchParams {
  did?: string;
  name: string;
}
interface PageProps
  extends InferMappedProps,
    RouteComponentProps<MatchParams> {}

const PublicSpacePage: React.FC<PageProps> = ({
  eProps,
  ...props
}: PageProps) => {
  let did: string = getDIDString(props.match.params.did || '', false);
  let spaceName: string = props.match.params.name.toLowerCase();
  const isGuid = Guid.isGuid(spaceName);
  const [publicUser, setPublicUser] = useState(defaultUserInfo);
  const [spaceProfile, setSpaceProfile] = useState(defaultSpace);
  const [scrollTop, setScrollTop] = useState(0);
  const [loading, setLoading] = useState(false);

  const contentRef = useRef<HTMLIonContentElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);

  const scrollToElement = (cardName: string) => {
    let point: number = 0;
    /*     let adjust = 0;
    if (scrollTop < 176) adjust = 292 - scrollTop;
    else {
      adjust = 260 - scrollTop;
    }
 */
    if (cardName === 'about') {
      point = 0;
    }
    contentRef.current && contentRef.current.scrollToPoint(0, point, 200);
  };

  useEffect(() => {
    (async () => {
      let userService = new UserService(await DidService.getInstance());

      setLoading(true);

      if (!did) {
        const spaces = isGuid
          ? await SpaceService.getCommunitySpaceByIds([Guid.parse(spaceName)])
          : await SpaceService.getCommunitySpaceByNames([spaceName]);
        if (spaces.length > 0) {
          setSpaceProfile(spaces[0]);
        }
      } else {
        let pUser = await userService.SearchUserWithDID(did);
        if (pUser && pUser.did) {
          setPublicUser(pUser as any);
          const spaces = isGuid
            ? [await SpaceService.getSpaceById(pUser, Guid.parse(spaceName))]
            : await SpaceService.getSpaceByNames(pUser, [spaceName]);
          if (spaces.length > 0 && spaces[0]) setSpaceProfile(spaces[0]);
        }
      }

      setLoading(false);
    })();
  }, [did, spaceName, props.session]);

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
          <Navbar signedIn={props.session && props.session.did !== ''} />
          <ContentRow
            className="ion-justify-content-around"
            template={publicUser.pageTemplate || 'default'}
          >
            <IonCol size="10" className="ion-no-padding">
              <ProfileComponentContainer>
                {spaceProfile.category === SpaceCategory.Personal && (
                  <ProfileComponent
                    scrollToElement={scrollToElement}
                    aboutRef={aboutRef}
                    publicUser={publicUser}
                    profile={spaceProfile}
                    loading={loading}
                  />
                )}
                {(spaceProfile.category === SpaceCategory.NFT ||
                  spaceProfile.category === SpaceCategory.WTP) && (
                  <NFTSpace space={spaceProfile} session={props.session} />
                )}
              </ProfileComponentContainer>
            </IonCol>
          </ContentRow>
        </IonContent>
      </IonGrid>
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

export default connect(mapStateToProps, mapDispatchToProps)(PublicSpacePage);
