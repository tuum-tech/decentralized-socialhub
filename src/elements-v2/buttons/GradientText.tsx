import React, { FC } from 'react';
import styled from 'styled-components';
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
  fontSize?: number;
  fontWeight?: string;
  children?: React.ReactNode;
}

const GradientText: FC<GradientTextProps> = ({
  children,
  ...props
}: GradientTextProps) => {
  return (
    <StyledButtonText {...props} background={styles['primary-gradient']}>
      {children}
    </StyledButtonText>
  );
};

export default GradientText;
