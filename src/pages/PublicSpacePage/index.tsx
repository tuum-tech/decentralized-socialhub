import { IonGrid, IonContent, IonCol, IonRow } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { down } from 'styled-breakpoints';
import { useBreakpoint } from 'styled-breakpoints/react-styled';
import { Guid } from 'guid-typescript';

import { UserService } from 'src/services/user.service';
import { DidService } from 'src/services/did.service.new';
import { defaultSpace, SpaceService } from 'src/services/space.service';

import LoadingIndicator from 'src/elements/LoadingIndicator';
import Navbar from 'src/components/profile/ProfileComponent/PublicNavbar';
import Banner from 'src/components/profile/ProfileComponent/Banner';
import Highlight from './components/Highlight';
import MainBoard from './components/MainBoard';
import { ContentRow, Container, ProfileComponentContainer } from './layouts';
import defaultCoverPhoto from 'src/assets/default/default-cover.png';

import { getDIDString } from 'src/utils/did';
import useSession from 'src/hooks/useSession';

const Wrapper = styled(IonRow)`
  padding: 0px 80px;
  ${down('sm')} {
    padding: 0;
  }
`;
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
  const [space, setSpace] = useState(defaultSpace);
  const [renderSignal, setRenderSignal] = useState({ signNo: 0, tab: 'home' });
  const [scrollTop, setScrollTop] = useState(0);
  const [loading, setLoading] = useState(false);
  const isSmDown = useBreakpoint(down('sm'));

  const contentRef = useRef<HTMLIonContentElement | null>(null);

  const getCommunitySpace = async () => {
    const spaces = isGuid
      ? await SpaceService.getCommunitySpaceByIds([Guid.parse(spaceName)])
      : await SpaceService.getCommunitySpaceByNames([spaceName]);
    return spaces.length > 0 ? spaces[0] : null;
  };
  const getPrivateSpace = async () => {
    let userService = new UserService(await DidService.getInstance());
    let tuumUser = await userService.SearchUserWithDID(did);
    if (!tuumUser?.did) return null;
    const spaces = isGuid
      ? [await SpaceService.getSpaceById(tuumUser, Guid.parse(spaceName))]
      : await SpaceService.getSpaceByNames(tuumUser, [spaceName]);
    return spaces.length > 0 ? spaces[0] : null;
  };
  useEffect(() => {
    (async () => {
      setLoading(true);
      const space = did ? await getPrivateSpace() : await getCommunitySpace();
      if (space) setSpace(space);
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
            template={'default'}
          >
            <IonCol size={isSmDown ? '11' : '10'} className="ion-no-padding">
              <ProfileComponentContainer>
                <Banner bgImg={space.coverPhoto || defaultCoverPhoto} />
                <Wrapper>
                  <IonCol sizeXs="12" sizeSm="3">
                    <Highlight
                      space={space}
                      viewAllNFTCollectionAssets={() => {
                        setRenderSignal({
                          signNo: renderSignal.signNo + 1,
                          tab: 'collection'
                        });
                      }}
                    />
                  </IonCol>
                  <IonCol sizeXs="12" sizeSm="9">
                    <MainBoard
                      space={space}
                      session={session}
                      renderSignal={renderSignal}
                    />
                  </IonCol>
                </Wrapper>
              </ProfileComponentContainer>
            </IonCol>
          </ContentRow>
        </IonContent>
      </IonGrid>
    </Container>
  );
};

export default PublicSpacePage;
