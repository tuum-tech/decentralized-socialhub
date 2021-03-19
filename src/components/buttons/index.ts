import { IonRouterLink } from '@ionic/react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import ArrowButton from './ArrowButton';
import ButtonWithLogo from './ButtonWithLogo';
import SocialButton from './SocialButton';

interface ButtonLinkProps {
  width?: number;
}
const ButtonLink = styled(Link)<ButtonLinkProps>`
  width: 100%;
  ${props => {
    if (props.width) {
      return `max-width: ${props.width}px;`;
    }
  }}
  display: block;
  margin: 0;
`;

const SigninLinkButton = styled.div`
  width: 100%;
  max-width: 100px
  display: block;
  margin: 0;
  text-decoration-line: underline;
  cursor: pointer;

  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 20px;

  margin-top: 9px;

  &:hover {
    color: white;
    ${props => {
      if (props.color) {
        return `color: ${props.color};`;
      }
    }}
  }
`;

const RegisterNewUserButton = styled(ButtonLink)`
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border-radius: 9px;
  background-color: #f3f9ff;
  font-family: 'SF Pro Display';
  font-size: 12px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: #4c6fff;
`;

const SignInButton = styled(IonRouterLink)`
  width: 140px;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border-radius: 9px;
  background-color: #4c6fff;
  flex-grow: 0;
  font-family: 'SF Pro Display';
  font-size: 12px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: #ffffff;
`;

export {
  ButtonLink,
  ArrowButton,
  SocialButton,
  ButtonWithLogo,
  SigninLinkButton,
  RegisterNewUserButton,
  SignInButton
};
