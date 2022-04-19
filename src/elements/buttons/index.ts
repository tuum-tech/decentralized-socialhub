import { IonRouterLink, IonButton } from '@ionic/react';
import styled from 'styled-components';

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
import ThemeTransparentButton from './ThemeTransparentButton';
import ThemeButton from './ThemeButton';
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

// const ThemeButton = styled.button`
//   background: linear-gradient(204.71deg, #9a5bff 15.76%, #dd5ac0 136.38%);
//   border-radius: 8px;
//   width: 100%;
//   height: 46px;

//   font-style: normal;
//   font-weight: 600;
//   font-size: 14px;
//   line-height: 14px;
//   color: #ffffff;
// `;

export {
  ButtonLink,
  ArrowButton,
  SocialButton,
  ButtonWithLogo,
  DashboardSignInButton,
  FollowButton,
  DefaultButton,
  DefaultLinkButton,
  PrimaryLinkButton,
  ButtonLight,
  Button,
  SmallLightButton,
  StyledButton,
  ThemeButton,
  ThemeTransparentButton
};
