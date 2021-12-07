import styled from 'styled-components';
import { IonRouterLink } from '@ionic/react';

interface ButtonProps {
  width?: string;
  height?: string;
  bgColor?: string;
  color?: string;
  borderRadius?: string;
  borderColor?: string;
  padding?: string;
  margin?: string;
}

const DefaultButton = styled.div<ButtonProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  font-family: 'SF Pro Display';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 12px;

  width: 100%;
  height: 100%;

  padding: ${props => (props.padding ? `${props.padding}` : '15px 25px')};
  max-width: ${props => (props.width ? `${props.width}` : '100%')};
  max-height: ${props => (props.height ? `${props.height}` : '100%')};
  background: ${props => (props.bgColor ? `${props.bgColor}` : '#4c6fff')};
  color: ${props => (props.color ? `${props.color}` : 'white')};
  border-radius: ${props =>
    props.borderRadius ? `${props.borderRadius}` : '9px'};
  border: ${props =>
    props.borderColor ? `1px solid ${props.borderColor}` : '1px solid #4c6fff'};
  margin: ${props => (props.margin ? props.margin : 'auto')};

  cursor: pointer;
`;

const StyledButton = styled.button<ButtonProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  font-family: 'SF Pro Display';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 12px;

  padding: ${props => (props.padding ? `${props.padding}` : '15px 25px')};
  width: ${props => (props.width ? `${props.width}` : '100%')};
  height: ${props => (props.height ? `${props.height}` : '100%')};
  background: ${props => (props.bgColor ? `${props.bgColor}` : '#4c6fff')};
  color: ${props => (props.color ? `${props.color}` : 'white')};
  border-radius: ${props =>
    props.borderRadius ? `${props.borderRadius}` : '9px'};

  cursor: pointer;
`;

const DefaultLinkButton = styled(IonRouterLink)<ButtonProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  font-family: 'SF Pro Display';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 12px;

  width: 100%;
  height: 100%;

  padding: ${props => (props.padding ? `${props.padding}` : '15px 25px')};
  max-width: ${props => (props.width ? `${props.width}` : '100%')};
  max-height: ${props => (props.height ? `${props.height}` : '100%')};
  background: ${props => (props.bgColor ? `${props.bgColor}` : '#4c6fff')};
  color: ${props => (props.color ? `${props.color}` : 'white')};
  border-radius: ${props =>
    props.borderRadius ? `${props.borderRadius}` : '9px'};

  cursor: pointer;
`;

export { DefaultButton, DefaultLinkButton, StyledButton };
