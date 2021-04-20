import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  height: 5em;
  padding: 16px;
  background: white;
  display: flex;
  align-items: center;
  img {
    width: 100%;
    max-width: 9em;
  }
`;

const Logo: React.FC = () => {
  return (
    <Container>
      <img src="../../assets/logo_profile_black.svg" />
    </Container>
  );
};

export default Logo;
