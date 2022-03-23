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
}

const Highlight: React.FC<IProps> = ({ space }: IProps) => {
  const [assets, setAssets] = useState([]);
  useEffect(() => {
    (async () => {
      if (space && space.guid) {
        const { data }: any = await getNFTCollectionAssets(
          space.guid,
          0,
          9
        );
        setAssets(data.assets);
      }
    })();
  }, [space]);
  return (
    <Container>
      <AboutSpace space={space} />
      <Collection assets={assets} />
      <Category />
    </Container>
  );
};

export default Highlight;
