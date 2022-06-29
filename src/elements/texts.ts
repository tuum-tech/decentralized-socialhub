import { IonText } from '@ionic/react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Text12 = styled.p`
  font-weight: 400;
  font-size: 12px !important;
  line-height: 20px;
`;

export const Text14 = styled.p`
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
`;

export const Text16 = styled.p`
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 26px;
`;

export const Text18 = styled.p`
  font-weight: 400;
  font-size: 18px;
  line-height: 30px;
`;

export const Text28 = styled.p`
  font-style: normal;
  font-weight: 600;
  font-size: 28px;
  line-height: 38px;
`;

export const Title40 = styled.p`
  font-weight: 700;
  font-size: 40px;
  line-height: 48px;
`;

export const ErrorTxt = styled(Text12)`
  color: red;
  text-align: center;
  margin-top: 5px;
`;

export const ErrorText = styled.p<{
  align?: 'left' | 'center';
  position?: 'absolute' | 'relative';
}>`
  font-size: 13px;
  line-height: 15px;
  text-align: ${props => props.align ?? 'left'};
  padding-left: ${props =>
    !props.align || props.align === 'left' ? '8px' : '0'};
  color: red;
  margin-top: 10px;
  position: ${props => props.position ?? 'absolute'};
  width: 100%;
`;

interface TextLinkProps {
  width?: number;
  color?: string;
}
export const TextLink = styled(Link)<TextLinkProps>`
  width: 100%;
  ${props => {
    if (props.width) {
      return `max-width: ${props.width}px;`;
    }
  }}
  display: block;
  color: white;
  ${props => {
    if (props.color) {
      return `color: ${props.color};`;
    }
  }}
  margin-top: 9px;

  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 20px;

  text-decoration-line: underline;

  &:hover {
    color: white;
    ${props => {
      if (props.color) {
        return `color: ${props.color};`;
      }
    }}
  }
`;

export const ProfileName = styled(IonText)`
  font-family: 'SF Pro Display';
  font-size: 28px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.36;
  letter-spacing: normal;
  text-align: left;
  color: #27272e;
`;
