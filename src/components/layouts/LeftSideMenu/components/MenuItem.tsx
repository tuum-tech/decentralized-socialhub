import { IonItem, IonLabel } from '@ionic/react';
import React from 'react';
import styled from 'styled-components';
import { MenuType } from '../types';
import { MenuIcon } from './icons';
import styles from './style.module.scss';

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
  active = false,
  rightContent,
  handleClick
}: MenuType) => {
  return (
    <IonItem
      className={active ? styles['item-active'] : styles['item-link']}
      onClick={handleClick}
    >
      <MenuIcon name={name} active={active} />
      <StyledBetween>
        <IonLabel>
          <StyledText active={active}>{title}</StyledText>
        </IonLabel>
        {rightContent}
      </StyledBetween>
    </IonItem>
  );
};

export default MenuItem;
