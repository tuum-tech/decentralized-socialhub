import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import logo from 'src/assets/new/logo.png';

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
  const history = useHistory();
  return (
    <Container
      onClick={() => {
        history.push('/profile');
      }}
    >
      <img alt="profile logo" src={logo} />
    </Container>
  );
};

export default Logo;
