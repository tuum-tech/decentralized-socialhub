import { IonBadge, IonItem, IonLabel } from '@ionic/react';
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

export const MenuItem = ({
  name,
  title,
  active = false,
  badge,
  handleClick
}: MenuType) => {
  return (
    <IonItem
      className={active ? styles['item-active'] : styles['item-link']}
      onClick={handleClick}
    >
      <MenuIcon name={name} active={active} />
      <IonLabel>
        <StyledText active={active}>{title}</StyledText>
      </IonLabel>
    </IonItem>
  );
};

export default MenuItem;
