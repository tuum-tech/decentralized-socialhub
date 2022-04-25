import React, { FC } from 'react';
import { IonBadge } from '@ionic/react';
import styled from 'styled-components';
import { ThemeColor, ThemeGradient } from '../common.types';
import styles from './Badge.module.scss';

const StyledBadge = styled(IonBadge)<BadgeProps & { background: string }>`
  background: ${props => props.background};
  padding: 2px 10px;
  border-radius: 100px;
`;

export interface BadgeProps {
  color?: ThemeColor;
  gradient?: ThemeGradient;
  children?: React.ReactNode;
  handleClick?: () => void;
}

const Badge: FC<BadgeProps> = ({
  color,
  gradient = 'main-logo-gradient',
  children,
  handleClick
}: BadgeProps) => {
  return (
    <StyledBadge
      color={color}
      background={gradient ? styles[gradient] : ''}
      onClick={handleClick}
    >
      {children}
    </StyledBadge>
  );
};

export default Badge;
