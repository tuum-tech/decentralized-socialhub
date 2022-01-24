import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import essentials from 'src/assets/new/auth/essentials.png';

interface Props {
  to: string;
  width?: string;
  text?: string;
  disabled?: boolean;
  style?: string;
}

const Container = styled.div`
  border-radius: 10px;
  padding: 13px 28px;

  height: 43px;
  margin-top: 14px;

  color: white;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;

  text-align: cneter;

  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;

  img {
    width: 19px;
    height: 17px;
    margin-right: 10px;
  }
`;

const SignInButton: React.FC<Props> = ({
  to,
  text = 'Sign in with Essentials',
  disabled = false,
  style = 'theme',
  width = '100%'
}) => (
  <Link
    to={to}
    style={{
      maxWidth: width,
      width: '100%',
      display: 'block',
      textDecoration: 'none'
    }}
  >
    <Container
      style={{
        background:
          style === 'theme'
            ? 'linear-gradient(204.71deg, #9a5bff 15.76%, #dd5ac0 136.38%)'
            : '#313049'
      }}
    >
      <img src={essentials} alt="eseentials" />
      {text}
    </Container>
  </Link>
);

export default SignInButton;
