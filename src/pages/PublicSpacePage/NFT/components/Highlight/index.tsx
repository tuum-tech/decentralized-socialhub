import React from 'react';
import styled from 'styled-components';
import AboutSpace from './About';
import Category from './Category';
import Collection from './Collection';

const Container = styled.div`
  position: relative;
  top: -120px;
`;
interface IProps {
  space: any;
}

const Highlight: React.FC<IProps> = ({ space }: IProps) => {
  return (
    <Container>
      <AboutSpace space={space} />
      <Collection />
      <Category />
    </Container>
  );
};

export default Highlight;
