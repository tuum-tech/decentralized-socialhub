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
    {spaces.map((space: Space) => {
      const slug = space.guid.value;

      return (
        <SpaceCard
          key={JSON.stringify(space)}
          space={space}
          explore={explore}
          link={
            explore
              ? space.isCommunitySpace
                ? `/community-spaces/${slug}`
                : `/did/${getDIDString(
                    space.owner as string,
                    true
                  )}/spaces/${slug}`
              : `/spaces/edit/${slug}?type=${
                  space.isCommunitySpace ? `community` : `private`
                }`
          }
          newTab={explore}
        />
      );
    })}
  </Container>
);

export default SpaceListView;
