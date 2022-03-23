import React from 'react';
import { IonRow, IonCol } from '@ionic/react';
import { Banner } from 'src/components/profile/ProfileComponent/ProfileHeader/Default';
import Highlight from './components/Highlight';
import MainBoard from './components/MainBoard';
import defaultCoverPhoto from 'src/assets/default/default-cover.png';
import styled from 'styled-components';

interface IProps {
  space: any;
}

const Wrapper = styled(IonRow)`
  padding: 0px 80px;
`;
const NFTSpace: React.FC<IProps> = ({ space }: IProps) => {
  return (
    <>
      <Banner bgImg={space.coverPhoto || defaultCoverPhoto} />
      <Wrapper>
        <IonCol size="3">
          <Highlight space={space} />
        </IonCol>
        <IonCol size="9">
          <MainBoard space={space} />
        </IonCol>
      </Wrapper>
    </>
  );
};

export default NFTSpace;
