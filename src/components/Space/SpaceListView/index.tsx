import React from 'react';
import { down } from 'styled-breakpoints';
import styled from 'styled-components';

import SpaceCard from '../SpaceCard';
import { getDIDString } from 'src/utils/did';

const Container = styled.div`
  --repeat: 3;
  display: grid;
  grid-template-columns: repeat(var(--repeat, auto-fit), minmax(240px, 1fr));
  row-gap: 22px;
  column-gap: 22px;
  margin: 22px 30px;

  ${down('sm')} {
    row-gap: 20px;
    margin: 22px 16px;
  }
  ${down('lg')} {
    --repeat: auto-fit;
  }
`;

interface Props {
  spaces: Space[];
  explore?: boolean;
}
const SpaceListView: React.FC<Props> = ({ spaces, explore = false }: Props) => (
  <Container>
    {spaces.map((space: any) => (
      <SpaceCard
        key={JSON.stringify(space)}
        space={space}
        explore={explore}
        link={
          explore
            ? space.isCommunitySpace
              ? `/community-spaces/${space.name}`
              : `/did/${getDIDString(space.owner!, true)}/spaces/${space.name}`
            : `/spaces/edit/${space.name}?type=${
                space.isCommunitySpace ? `community` : `private`
              }`
        }
        newTab={explore}
      />
    ))}
  </Container>
);

export default SpaceListView;
