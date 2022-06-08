import { IonText } from '@ionic/react';
import styled from 'styled-components';

interface ColorTextProps {
  fontSize?: number;
  fontWeight?: string;
  color?: string;
}

const ColorText = styled(IonText)<ColorTextProps>`
  font-family: 'SF Pro Display';
  font-style: normal;
  font-weight: ${props => (props.fontWeight ? `${props.fontWeight}` : '500')};
  font-size: ${props => (props.fontSize ? `${props.fontSize}px` : '13px')};
  color: ${props => (props.color ? `${props.color}` : 'black')};
`;

export default ColorText;
