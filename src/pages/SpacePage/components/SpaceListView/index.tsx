import React from 'react';
import { IonCol, IonGrid, IonRow } from '@ionic/react';

import SpaceCard from '../SpaceCard';
import styled from 'styled-components';

import { getDIDString } from 'src/utils/did';

const Container = styled.div`
  margin: 0px 30px;
`;
interface Props {
  spaces: Space[];
  explore?: boolean;
}
const SpaceListView: React.FC<Props> = ({ spaces, explore = false }: Props) => {
  const renderSpaceCol = (space: any, index: number) => {
    const { isCommunitySpace } = space;
    return (
      <IonCol size="4" key={index}>
        <SpaceCard
          space={space}
          explore={explore}
          link={
            explore
              ? isCommunitySpace
                ? `/community-spaces/${space.name}`
                : `/did/${getDIDString(space.owner!, true)}/spaces/${
                    space.name
                  }`
              : `/spaces/edit/${space.name}?type=${
                  isCommunitySpace ? `community` : `private`
                }`
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

export default SpaceListView;
