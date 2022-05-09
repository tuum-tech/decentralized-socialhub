import { IonItem, IonLabel } from '@ionic/react';
import React from 'react';
import styled from 'styled-components';
import { MenuType } from '../types';
import { MenuIcon } from './icons';
import styles from './style.module.scss';

const StyledIonItem = styled(IonItem)<{
  active: boolean;
  isChild: boolean | undefined;
}>`
  margin: 0 10px;
  ${props =>
    props.active && !props.isChild
      ? `
        --inner-border-width: 0;
        --background: transparent;
        background: linear-gradient(
          90deg,
          rgba(153, 90, 255, 0.1) 0%,
          rgba(220, 89, 191, 0.1) 100%
        );
        border-radius: 10px;
      `
      : `
        --inner-border-width: 0;
        --ion-item-background: transparent;
        cursor: pointer;
        color: var(--text-body-light);
      `}
`;

const StyledText = styled.h3<{ active: boolean }>`
  ${props =>
    props.active
      ? `background: ${styles['main-logo-gradient']};
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;`
      : `color: var(--color);`}
`;

const StyledBetween = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const MenuItem = ({
  name,
  title,
  tooltip = '',
  active = false,
  rightContent,
  isChild,
  handleClick
}: MenuType) => {
  return (
    <StyledIonItem active={active} isChild={isChild} onClick={handleClick}>
      <MenuIcon name={name} active={active} customStyle={{ marginRight: 20 }} />
      <StyledBetween>
        <IonLabel title={tooltip}>
          <StyledText active={active}>{title}</StyledText>
        </IonLabel>
        {rightContent}
      </StyledBetween>
    </StyledIonItem>
  );
};

export default MenuItem;
