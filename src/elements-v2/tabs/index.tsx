import React from 'react';
import { IonItem } from '@ionic/react';
import styled from 'styled-components';
import Badge from '../Badge';
import styles from '../style.module.scss';

const StyledIonItem = styled(IonItem)<{ active: boolean }>`
  cursor: pointer;
  display: inline-block;
  --background: #f7fafc;
  --inner-padding-bottom: 2px;
  --inner-padding-end: 0px;
  --inner-border-width: 0;
  --padding-start: 0;
  --padding-end: 30px;
  color: #718096;

  ${props =>
    props.active
      ? `
          --inner-padding-bottom: 0;
          --inner-border-width: 0 0 2px 0;
          --border-color: var(--ion-color-primary) !important;
          color: #1a202c;
        `
      : ``}

  ion-label {
    font-family: 'SF Pro Display' !important;
    font-style: normal;
    font-size: 14px !important;
    font-weight: 600;

    ${props =>
      props.active
        ? `
        -webkit-background-clip: text !important;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
        background: ${styles['primary-gradient']};
          `
        : ``}
  }
`;

interface TabItemProps {
  children: React.ReactNode;
  active: boolean;
  badgeCount?: number;
  onClick: () => void;
}

export const TabItem = ({ badgeCount, children, ...props }: TabItemProps) => {
  return (
    <StyledIonItem {...props}>
      {children}
      {props.active && badgeCount !== undefined ? (
        <Badge
          textGradient="primary-gradient"
          gradient="secondary-gradient"
          className="ml-2"
        >
          {badgeCount}
        </Badge>
      ) : (
        badgeCount !== undefined && (
          <Badge color="#425466" bgColor="#EDF2F7" className="ml-2">
            {badgeCount}
          </Badge>
        )
      )}
    </StyledIonItem>
  );
};
