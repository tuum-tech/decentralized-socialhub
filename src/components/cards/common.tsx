import {
  IonFooter,
  IonCard,
  IonCardHeader,
  IonGrid,
  IonModal,
  IonTextarea,
  IonCardContent
} from '@ionic/react';
import styled from 'styled-components';
import { getThemeData } from 'src/utils/template';

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
    getThemeData(template, 'card', 'cardShawdow')};

  border-radius: 16px;
  margin: 0px 0px 22px;

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
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.07px;
  text-align: left;
  color: #4c6fff;
  cursor: pointer;
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
  height: 100 %;
`;

export const MyTextarea = styled(IonTextarea)`
  width: 90 %;
  margin-top: 8px;
  background: #edf2f7;
  box-shadow: 0px 1px 2px rgba(50, 50, 71, 0.08),
    0px 0px 1px rgba(50, 50, 71, 0.2);
  border-radius: 6px;
  font-size: 13px;
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
  padding: 26px;
`;

export const CardContentContainer = styled(IonCardContent)`
  padding-left: 26px;
`;
