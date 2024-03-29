import React from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import logo from 'src/assets/new/logo.svg';

const Container = styled.div`
  height: 5em;
  padding: 16px;
  display: flex;
  align-items: center;

  img {
    width: 77px;
    margin-left: 15px;
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
