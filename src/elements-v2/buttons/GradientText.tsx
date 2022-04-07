import React from 'react';
import styled from 'styled-components';
import { IonText } from '@ionic/react';
import style from './Button.module.scss';

const StyledText = styled(IonText)<Omit<GradientTextProps, 'text'>>`
  font-family: 'SF Pro Display';
  font-style: normal;
  font-weight: ${props => (props.fontWeight ? `${props.fontWeight}` : '500')};
  font-size: ${props => (props.fontSize ? `${props.fontSize}px` : '13px')};
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`;

interface GradientTextProps {
  text: string;
  fontSize?: number;
  fontWeight?: string;
}

const GradientText = ({ text, ...props }: GradientTextProps) => {
  return (
    <StyledText {...props} className={style['dark-pink-gradient']}>
      {text}
    </StyledText>
  );
};

export default GradientText;
