import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import AboutSpace from './About';
import Category from './Category';
import Collection from './Collection';
import { getNFTCollectionAssets } from '../../fetchapi';

const Container = styled.div`
  position: relative;
  top: -120px;
`;
interface IProps {
  space: any;
  viewAllNFTCollectionAssets: () => void;
}

const Highlight: React.FC<IProps> = ({
  space,
  viewAllNFTCollectionAssets
}: IProps) => {
  const [assets, setAssets] = useState([]);
  useEffect(() => {
    (async () => {
      if (space && space.guid) {
        const { data }: any = await getNFTCollectionAssets(space.guid, 0, 9);
        setAssets(data.assets);
      }
    })();
  }, [space]);
  return (
    <Container>
      {space.publicFields.includes('about') && <AboutSpace space={space} />}
      <Collection assets={assets} viewAll={viewAllNFTCollectionAssets} />
      <Category space={space} />
    </Container>
  );
};

export default Highlight;
