import React, { FC } from 'react';
import styled from 'styled-components';
import { ThemeGradient } from '../common.types';
import styles from './Button.module.scss';
import ButtonText from './ButtonText';

const StyledButtonText = styled(ButtonText)<{ background: string }>`
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  background: ${props => props.background};
`;

interface GradientTextProps {
  gradient?: ThemeGradient;
  fontSize?: number;
  fontWeight?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const GradientText: FC<GradientTextProps> = ({
  gradient = 'primary-gradient',
  children,
  className,
  style,
  ...props
}: GradientTextProps) => {
  return (
    <StyledButtonText
      {...props}
      background={styles[gradient]}
      className={className}
      style={style}
    >
      {children}
    </StyledButtonText>
  );
};

export default GradientText;
