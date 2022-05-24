import { IonGrid, IonContent, IonCol } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import React, { useEffect, useRef, useState } from 'react';
import { down } from 'styled-breakpoints';
import { useBreakpoint } from 'styled-breakpoints/react-styled';
import { Guid } from 'guid-typescript';

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
import useSession from 'src/hooks/useSession';

interface MatchParams {
  did?: string;
  name: string;
}
interface PageProps extends RouteComponentProps<MatchParams> {}

const PublicSpacePage: React.FC<PageProps> = (props: PageProps) => {
  const { session } = useSession();
  let did: string = getDIDString(props.match.params.did || '', false);
  let spaceName: string = props.match.params.name.toLowerCase();
  const isGuid = Guid.isGuid(spaceName);
  const [publicUser, setPublicUser] = useState(defaultUserInfo);
  const [spaceProfile, setSpaceProfile] = useState(defaultSpace);
  const [scrollTop, setScrollTop] = useState(0);
  const [loading, setLoading] = useState(false);
  const isSmDown = useBreakpoint(down('sm'));

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
  }, [did, spaceName, session]);

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
          <Navbar signedIn={session && session.did !== ''} />
          <ContentRow
            className="ion-justify-content-around"
            template={publicUser.pageTemplate || 'default'}
          >
            <IonCol size={isSmDown ? '11' : '10'} className="ion-no-padding">
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

export default PublicSpacePage;
