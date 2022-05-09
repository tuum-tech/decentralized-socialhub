import { IonText } from '@ionic/react';
import styled from 'styled-components';

interface ButtonTextProps {
  fontSize?: number;
  fontWeight?: string;
}

const ButtonText = styled(IonText)<ButtonTextProps>`
  font-family: 'SF Pro Display';
  font-style: normal;
  font-weight: ${props => (props.fontWeight ? `${props.fontWeight}` : '500')};
  font-size: ${props => (props.fontSize ? `${props.fontSize}px` : '13px')};
  color: ${props => (props.color ? `${props.color}` : 'black')};
`;

export default ButtonText;
