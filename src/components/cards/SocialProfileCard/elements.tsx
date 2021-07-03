import {
  IonButton,
  IonCardTitle,
  IonFooter,
  IonGrid,
  IonImg,
  IonItem,
  IonModal
} from '@ionic/react';
import styled from 'styled-components';
import theme from 'src/data/theme';
import { CardOverview } from '../common';

export const SocialProfileCard = styled(CardOverview)<ThemeProps>`
  .card-content {
    font-family: 'SF Pro Display';
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.64;
    letter-spacing: normal;
    text-align: left;
    color: #425466;
  }

  & ion-grid {
    --ion-grid-width-xs: 100%;
    --ion-grid-width-sm: 540px;
    --ion-grid-width-md: 720px;
    --ion-grid-width-lg: 960px;
    --ion-grid-width-xl: 1340px !important;
  }

  .card-link {
    flex: auto;
    float: right;
    font-family: 'SF Pro Display';
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: -0.07px;
    text-align: left;
    color: #4c6fff;
    cursor: pointer;
    opacity: 1;

    &_hover {
      opacity: 0.5;
    }
  }
`;

export const ManagerModal = styled(IonModal)`
  --border-radius: 16px;
  --min-height: 200px;
  --height: 580px;
  --width: 560px;
  :host(.modal-card) ion-header ion-toolbar:first-of-type {
    padding: 0px;
  }
`;

export const ManagerModalTitle = styled(IonCardTitle)`
  font-family: 'SF Pro Display';
  font-size: 28px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.36;
  letter-spacing: normal;
  text-align: left;
  color: #27272e;
  padding: 15px;
`;

export const ManagerModalFooter = styled(IonFooter)`
  padding: 12px;
  border: 0px !important;
  border-bottom-color: transparent !important;
  background-image: none !important;
  border-bottom: none !important;
  &.footer-md::before {
    background-image: none;
  }
`;

export const MyGrid = styled(IonGrid)`
  margin: 5px 20px 0px 20px;
  height: 100 %;
`;

export const ManagerLogo = styled(IonImg)`
  position: relative;
  float: left;
  width: 42px;
`;

export const ProfileItem = styled(IonItem)<ThemeProps>`
  --inner-padding-bottom: 0;
  --inner-padding-end: 0;
  --inner-padding-start: 0;
  --inner-padding-top: 0;
  --background: transparent !important;

  display: flex;
  justify-content: flex-start;
  border: 0px;
  --inner-border-width: 0;
  padding: 0px !important;

  font-family: 'SF Pro Display';
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #7a7a9d;

  a {
    color: ${({ template }: ThemeProps) => (theme as any)[template].cardTitle1};
  }

  .left {
    position: relative;
    & > img {
      border-radius: 50%;
    }
  }

  .right {
    margin-left: 10px;
  }

  .social-profile-network {
    color: ${({ template }: ThemeProps) => (theme as any)[template].cardTitle2};
    font-size: 16px;
    font-weight: 600;
  }

  .social-profile-id {
    color: ${({ template }: ThemeProps) => (theme as any)[template].cardTitle3};
    font-size: 13px;
    font-weight: 400;
  }

  .social-profile-badge {
    position: absolute;
    top: 0px;
    right: 0px;
  }
`;

export const ManagerButton = styled(IonButton)`
  position: relative;
  --ion-color-primary: transparent !important;
  --ion-color-primary-tint: transparent;
  width: 90px;
  height: 26px;
  float: right;

  font-family: 'SF Pro Display';
  border-radius: 8px;
  border: solid 1px #4c6fff;
  font-size: 13px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.92;
  letter-spacing: normal;
  text-align: center;
  color: #4c6fff;
`;

export const CloseButton = styled(IonButton)`
  --ion-color-primary: #4c6fff !important;
  --ion-color-primary-tint: #4c7aff;
  width: 210px;
  height: 36px;
  float: right;
  border-radius: 6px;
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
