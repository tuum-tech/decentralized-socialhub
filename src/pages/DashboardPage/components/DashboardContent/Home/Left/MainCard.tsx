import React, { useMemo } from 'react';
import { down } from 'styled-breakpoints';
import { useBreakpoint } from 'styled-breakpoints/react-styled';
import styled from 'styled-components';

export const CardTitle = styled.p<{ color: string }>`
  color: ${props => props.color};
  font-size: 18px;
  font-weight: bold;
  line-height: normal;
  margin-bottom: 10px;
`;

export const CardDescription = styled.p<{ color: string }>`
  margin-top: 5px;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 23px;
  color: ${props => props.color};
  margin-bottom: 15px;
`;

export const CardContainer = styled.div<{ background: string }>`
  display: flex;
  flex-direction: row;
  box-shadow: 0px 0px 1px rgba(12, 26, 75, 0.24),
    0px 3px 8px -1px rgba(50, 50, 71, 0.05);
  border-radius: 16px;

  font-family: 'SF Pro Display';
  background-size: auto 100% !important;
  min-height: 248px;
  background: ${props => props.background};
  position: relative;
  margin-bottom: 22px;

  ${down('sm')} {
    min-height: 218px;
  }
`;

const CardBody = styled.div<React.CSSProperties>`
  flex: ${props => (props.flex ? props.flex : '1')};
  padding: 56px 55px;
  ${down('sm')} {
    padding: 25px 20px;
  }
`;

export const CardRight = styled.div<React.CSSProperties>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: ${props => props.flex};
  padding-right: 16px;
  ${down('sm')} {
    display: none;
  }
`;

interface IProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
  rightFlex?: number;
  background?: string;
  titleColor?: string;
  descriptionColor?: string;
  children: React.ReactNode;
}

const MainCard: React.FC<IProps> = ({
  title,
  description,
  action = null,
  left = null,
  right = null,
  rightFlex = 0.5,
  background = 'white',
  titleColor = 'black',
  descriptionColor = '#425466',
  children
}: IProps) => {
  const isSmDown = useBreakpoint(down('sm'));
  const flex = useMemo(() => (isSmDown ? 0 : rightFlex), [isSmDown, rightFlex]);

  return (
    <CardContainer background={background}>
      {left}
      <CardBody flex={1 - flex}>
        <CardTitle color={titleColor}>{title}</CardTitle>
        {description && (
          <CardDescription color={descriptionColor}>
            {description}
          </CardDescription>
        )}
        {children}
      </CardBody>
      <CardRight flex={flex}>{right}</CardRight>
    </CardContainer>
  );
};

export default MainCard;
