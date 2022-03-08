import React from 'react';
import { IonCol, IonGrid, IonRow } from '@ionic/react';

import SpaceCard from './SpaceCard';
import styled from 'styled-components';

import { getDIDString } from 'src/utils/did';

const Container = styled.div`
  margin: 0px 30px;
`;
interface Props {
  spaces: Space[];
  explore?: boolean;
}
const MySpaces: React.FC<Props> = ({ spaces, explore = false }: Props) => {
  const renderSpaceCol = (space: Space, index: number) => {
    return (
      <IonCol size="4" key={index}>
        <SpaceCard
          space={space}
          link={
            explore
              ? `/did/${getDIDString(space.owner!, true)}/spaces/${space.name}`
              : `/spaces/${space.name}`
          }
          newTab={explore}
        />
      </IonCol>
    );
  };
  return (
    <Container>
      <IonGrid>
        <IonRow>
          {spaces.map((space, index) => renderSpaceCol(space, index))}
        </IonRow>
      </IonGrid>
    </Container>
  );
};

export default MySpaces;
