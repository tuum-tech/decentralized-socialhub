import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface SignInButtonProps {
  width?: number;
  color?: string;
  disabled?: boolean;
}
const SignInButton = styled(Link)<SignInButtonProps>`
  width: 100%;
  background: #3c5cde;
  border-radius: 10px;
  margin-top: 14px;
  padding: 10px;

  ${props => {
    if (props.width) {
      return `max-width: ${props.width}px;`;
    }
  }}

  ${props => {
    return `color: ${props.color ? props.color : 'white'};`;
  }}

  ${props => {
    return `disabled: ${props.disabled ? props.disabled : false};`;
  }}

  font-family: 'SF Pro Display';
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 23px;

  display: block;
  align-items: center;
  text-align: center;

  &:hover {
    ${props => {
      return `color: ${props.color ? props.color : 'white'};`;
    }}
    text-decoration: none;
  }
`;

export default SignInButton;
