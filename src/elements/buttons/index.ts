import { IonRouterLink, IonButton } from '@ionic/react';
import styled from 'styled-components';

import SignInButton from './SignInButton';
import ArrowButton from './ArrowButton';
import ButtonWithLogo from './ButtonWithLogo';
import SocialButton from './SocialButton';
import ButtonLink from './ButtonLink';
import FollowButton from './FollowButton';
import {
  DefaultButton,
  DefaultLinkButton,
  StyledButton
} from './DefaultButton';
import Button from './Button';

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

const PrimaryLinkButton = styled(IonButton)`
  width: 273px;
  height: 49px;

  background: #363291 0% 0% no-repeat padding-box;
  border-radius: 8px;
  opacity: 1;

  text-align: center;
  font: normal normal 600 18px/21px 'Open Sans';
  text-transform: none;
  letter-spacing: 0px;
  color: #ffffff;
`;

const ButtonLight = styled(IonButton)`
  width: 273px;
  height: 49px;

  border: 1px solid #000000;
  border-radius: 5px;
  opacity: 1;

  text-align: center;
  font: normal normal 600 18px/21px 'Open Sans';
  text-transform: none;
  letter-spacing: 0px;
  color: #000;
  --background: #fff 0% 0% no-repeat padding-box;
  --background-activated: #fff 0% 0% no-repeat padding-box;

  &:hover {
    --background-hover: #fff 0% 0% no-repeat padding-box;
  }
`;

const SmallLightButton = styled.button`
  height: 27px;
  display: inline;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 7px 13px;
  border-radius: 6px;
  background-color: #f3f9ff;
  font-family: 'SF Pro Display';
  font-size: 14px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: #4c6fff;
`;

// const ViewProfileButton = styled(IonButton)`
//   display: flex;
//   flex-direction: column;
//   justify-content: flex-start;
//   align-items: center;
//   gap: 10px;
//   --background: #4c6fff;
//   --border-radius: 9px;
//   height: 40px;
//   opacity: 1;
//   text-align: center;
//   text-transform: none;
//   letter-spacing: 0px;
//   color: #ffffff;
//   font-family: 'SF Pro Display';
//   font-size: 12px;
//   font-weight: 600;
//   font-stretch: normal;
//   font-style: normal;
//   width: 100%;
// `;

const ViewProfileButton = styled.button`
  background-color: #4c6fff;
  border-radius: 9px;
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

export {
  ButtonLink,
  ArrowButton,
  SocialButton,
  ButtonWithLogo,
  SignInButton,
  DashboardSignInButton,
  FollowButton,
  DefaultButton,
  DefaultLinkButton,
  PrimaryLinkButton,
  ButtonLight,
  Button,
  SmallLightButton,
  StyledButton,
  ViewProfileButton
};
