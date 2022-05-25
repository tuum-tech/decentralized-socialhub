import React, { useState } from 'react';
import { IonRow, IonCol } from '@ionic/react';
import styled from 'styled-components';
import { down } from 'styled-breakpoints';
import Banner from 'src/components/profile/ProfileComponent/Banner';
import Highlight from './components/Highlight';
import MainBoard from './components/MainBoard';
import defaultCoverPhoto from 'src/assets/default/default-cover.png';

interface IProps {
  space: any;
  session: ISessionItem;
}

const Wrapper = styled(IonRow)`
  padding: 0px 80px;
  ${down('sm')} {
    padding: 0;
  }
`;

const NFTSpace: React.FC<IProps> = ({ space, session }: IProps) => {
  const [renderSignal, setRenderSignal] = useState({ signNo: 0, tab: 'home' });

  return (
    <>
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
    </>
  );
};

export default NFTSpace;
