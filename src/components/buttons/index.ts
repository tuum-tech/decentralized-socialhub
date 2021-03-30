import { IonRouterLink, IonButton } from '@ionic/react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import ArrowButton from './ArrowButton';
import ButtonWithLogo from './ButtonWithLogo';
import SocialButton from './SocialButton';
import Button from './Button';

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

// for buttons used in logic workflow
interface SignInButtonProps {
  width?: number;
  color?: string;
}
const SignInButton = styled(Link)<SignInButtonProps>`
  width: 100%;
  background: #3c5cde;
  border-radius: 10px;
  margin-top: 14px;
  padding: 10px;

  ${props => {
    if (props.width) {
      return `max-width: ${props.width}px;`;
    }
  }}

  ${props => {
    return `color: ${props.color ? props.color : 'white'};`;
  }}

  font-family: 'SF Pro Display';
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 23px;

  display: block;
  align-items: center;
  text-align: center;

  &:hover {
    ${props => {
      return `color: ${props.color ? props.color : 'white'};`;
    }}
    text-decoration: none;
  }
`;

// for buttons used in dashboard

const DashboardSignInButton = styled(IonRouterLink)`
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

const FollowButton = styled(IonButton)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  --background: #4c6fff;
  --border-radius: 9px;
  height: 40px;
  opacity: 1;
  text-align: center;
  text-transform: none;
  letter-spacing: 0px;
  color: #ffffff;
  font-family: 'SF Pro Display';
  font-size: 12px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  width: 100%;
`;

interface ButtonProps {
  width?: string;
}

const DefaultButton = styled.div<ButtonProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15px 25px;

  font-family: 'SF Pro Display';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 12px;

  width: 100%;
  max-width: ${props => (props.width ? `${props.width}` : '100%')};
  height: 42px;
  left: 25px;
  top: 329px;

  background: #4c6fff;
  border-radius: 9px;
  color: white;
`;

const WhiteButton = styled.div<ButtonProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 15px 25px;

  font-family: 'SF Pro Display';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 12px;

  width: 100%;
  max-width: ${props => (props.width ? `${props.width}` : '100%')};
  height: 42px;
  left: 25px;
  top: 329px;

  background: white;
  border-radius: 9px;
  color: #4c6fff;
`;

export {
  ButtonLink,
  ArrowButton,
  SocialButton,
  ButtonWithLogo,
  SignInButton,
  DashboardSignInButton,
  FollowButton,
  Button,
  // PrimaryButton,
  DefaultButton,
  WhiteButton
};
