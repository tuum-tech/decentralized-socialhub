import {
  IonFooter,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonImg,
  IonButton,
  IonModal,
  IonItem,
  IonTextarea,
  IonCardContent,
  IonLabel
} from '@ionic/react';
import styled from 'styled-components';
import { getThemeData } from 'src/utils/template';
import styles from 'src/elements-v2/style.module.scss';
import { DefaultButton } from 'src/elements-v2/buttons';
import { down } from 'styled-breakpoints';

export enum MODE {
  NONE,
  ADD,
  EDIT,
  ERROR
}

export const CardOverview = styled(IonCard)<ThemeProps>`
  background-color: ${({ template }: ThemeProps) =>
    getThemeData(template, 'card', 'backgroundColor')};

  box-shadow: ${({ template }: ThemeProps) =>
    getThemeData(template, 'card', 'cardShadow')};

  border-radius: 16px;
  padding: 26px 20px 30px 20px;
  margin: 0px 0px 22px;
  overflow: visible;
  ion-card-title {
    font-family: 'SF Pro Display';
    font-size: 18px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: -0.09px;
    text-align: left;
    color: ${({ template }: ThemeProps) =>
      getThemeData(template, 'card', 'cardTitle')};
  }
`;

export const Institution = styled.span<ThemeProps>`
  font-family: 'SF Pro Display';
  font-size: 16px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.56;
  letter-spacing: normal;
  text-align: left;
  color: ${({ template }: ThemeProps) =>
    getThemeData(template, 'card', 'cardTitle1')};
`;

export const Program = styled.span<ThemeProps>`
  font-family: 'SF Pro Display';
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.79;
  letter-spacing: normal;
  text-align: left;
  color: ${({ template }: ThemeProps) =>
    getThemeData(template, 'card', 'cardTitle2')};
`;

export const Period = styled.span<ThemeProps>`
  font-family: 'SF Pro Display';
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
  letter-spacing: normal;
  text-align: left;

  color: ${({ template }: ThemeProps) =>
    getThemeData(template, 'card', 'cardTitle3')};
`;

export const Divider = styled.hr`
  width: 100%;
  height: 1px;
  text-align: center;
  margin-top: 1.5em;
  margin-bottom: 1.5em;
  background-color: #f7fafc;
`;

export const LinkStyleSpan = styled.span`
  font-family: 'SF Pro Display';
  font-size: 14px;
  font-weight: 600;
  font-style: normal;
  line-height: 17px;
  text-align: right;
  letter-spacing: -0.005em;
  cursor: pointer;

  background: ${styles['main-logo-gradient']};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`;

export const Description = styled.span<ThemeProps>`
  white-space: break-spaces !important;
  font-family: 'SF Pro Display';
  font-size: 13px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.62;
  letter-spacing: normal;
  text-align: left;
  color: ${({ template }: ThemeProps) =>
    getThemeData(template, 'card', 'cardText')};
`;

export const MyModal = styled(IonModal)`
  --border-radius: 16px;
  --min-height: 200px;
  --height: 480px;
  --width: 560px;
`;

export const TreeDotsButton = styled.div`
  writing-mode: vertical-rl;
  text-orientation: mixed;
  line-height: 0.5;
  margin: 1px 3px 2px 7px;
  padding: 5px 3px 5px 10px;
  border-radius: 22px;
  font-weight: bold;
  background-color: rgba(221, 221, 221, 0.24);
  color: #000;
  cursor: pointer;
`;

export const PopoverMenuItem = styled.div`
  display: block;
  font-family: 'SF Pro Display';
  padding: 10px 10px 10px 20px;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.07px;
  text-align: left;
  color: #000;
  cursor: pointer;
`;

export const MyGrid = styled(IonGrid)`
  margin: 10px 20px 10px 20px;
  height: 100%;
`;

export const MyTextarea = styled(IonTextarea)`
  width: 90 %;
  margin-top: 8px;
  background: #edf2f7;
  box-shadow: 0px 1px 2px rgba(50, 50, 71, 0.08),
    0px 0px 1px rgba(50, 50, 71, 0.2);
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.15;
  font-family: 'SF Pro Display';
  letter-spacing: normal;
  text-align: left;
  color: #6b829a;
  --padding-bottom: 8px;
  --padding-top: 9px;
  --padding-end: 16px;
  --padding-start: 16px;
  --placeholder-color: var(--input - muted - placeholder);
`;

export const ModalFooter = styled(IonFooter)`
  padding: 12px;
`;

export const CardHeaderContent = styled(IonCardHeader)`
  padding: 0px;
  padding-bottom: 24px;
`;

export const CardContentContainer = styled(IonCardContent)`
  padding-left: 0px;
  padding-right: 0px;
`;

export const CardHeader = styled(IonCardHeader)`
  padding: 18px;
  margin-bottom: 12px;
`;
export const CardContent = styled(IonCardContent)`
  padding: 18px;
`;

export const ManagerModal = styled(IonModal)`
  --border-radius: 16px;
  --min-height: 200px;
  --height: 600px;
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

export const ManagerLogo = styled.img`
  position: relative;
  float: left;
  width: 42px;

  outline: 1px solid #cc2a8b;
  outline-offset: 2px;
  border-radius: 50%;
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
export const ManagerButton = styled(DefaultButton)`
  width: 90px;
  float: right;
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
    color: ${({ template }: ThemeProps) =>
      getThemeData(template, 'card', 'cardTitle1')};
  }

  .left {
    min-width: 50px;
    position: relative;
    & > img {
      border-radius: 50%;
    }
    & canvas {
      border-radius: 50%;
    }
  }

  .right {
    margin-left: 10px;
    .copy-to-clipboard {
      margin-left: 5px;
      cursor: pointer;
    }
    overflow: auto;
  }

  .social-profile-network {
    color: ${({ template }: ThemeProps) =>
      getThemeData(template, 'card', 'cardTitle2')};
    font-size: 16px;
    font-weight: 600;
  }

  .social-profile-id {
    color: ${({ template }: ThemeProps) =>
      getThemeData(template, 'card', 'cardTitle3')};
    font-size: 13px;
    font-weight: 400;
  }

  .social-profile-badge {
    position: absolute;
    top: 0px;
    right: 0px;
  }
`;

export const Spacer = styled.div<{ noWrap?: boolean }>`
  margin-top: 38px;
  padding: 5px;
  display: flex;
  align-items: center;

  ${down('sm')} {
    margin-top: ${props => (props.noWrap ? 38 : 10)}px;
  }
`;

export const StyledLabel = styled(IonLabel)`
  font-family: 'SF Pro Display';
  font-size: 14px;
  font-weight: 500;
  color: var(--text-body-light);
`;

export const CheckboxLabel = styled(IonLabel)`
  font-size: 14px;
  font-weight: 500;
  padding-left: 10px;
  color: #0a1f44;
`;
