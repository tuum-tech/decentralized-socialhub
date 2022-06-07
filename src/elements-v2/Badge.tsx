import React, { FC } from 'react';
import { IonBadge } from '@ionic/react';
import styled from 'styled-components';
import { ThemeGradient } from './common.types';
import styles from './style.module.scss';
import GradientText from './buttons/GradientText';
import ColorText from './buttons/ColorText';

const StyledBadge = styled(IonBadge)<
  BadgeProps & { bgColor?: string; background: string }
>`
  background: ${({ bgColor, background }) => bgColor || background};
  padding: 2px 10px;
  border-radius: 100px;
`;

export interface BadgeProps {
  bgColor?: string;
  gradient?: ThemeGradient;
  color?: string;
  textGradient?: ThemeGradient;
  children?: React.ReactNode;
  className?: string;
  handleClick?: () => void;
}

const Badge: FC<BadgeProps> = ({
  bgColor,
  gradient = 'main-logo-gradient',
  color = 'white',
  textGradient,
  children,
  className,
  handleClick
}: BadgeProps) => {
  return (
    <StyledBadge
      bgColor={bgColor}
      background={gradient ? styles[gradient] : ''}
      className={className}
      onClick={handleClick}
    >
      {textGradient ? (
        <GradientText gradient={textGradient}>{children}</GradientText>
      ) : (
        <ColorText color={color}>{children}</ColorText>
      )}
    </StyledBadge>
  );
};

export default Badge;
