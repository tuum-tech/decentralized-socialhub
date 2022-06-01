import { IonItem } from '@ionic/react';
import styled from 'styled-components';
import styles from '../style.module.scss';

export const TabItem = styled(IonItem)<{ active: boolean }>`
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
