import React from 'react';
import styled from 'styled-components';
import { down } from 'styled-breakpoints';
import AboutSpace from './About';
import Category from './Category';
import Collection from './Collection';
import { SpaceCategory } from 'src/services/space.service';

const Container = styled.div`
  position: relative;
  top: -120px;
  ${down('sm')} {
    top: -16px;
  }
`;
interface IProps {
  space: any;
  viewAllNFTCollectionAssets: () => void;
}

const Highlight: React.FC<IProps> = ({
  space,
  viewAllNFTCollectionAssets
}: IProps) => {
  const isNFTSpace = space?.category === SpaceCategory.NFT;
  return (
    <Container>
      {space.publicFields.includes('about') && <AboutSpace space={space} />}
      {isNFTSpace && (
        <Collection space={space} viewAll={viewAllNFTCollectionAssets} />
      )}
      <Category space={space} />
    </Container>
  );
};

export default Highlight;
