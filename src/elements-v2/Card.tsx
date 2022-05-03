import { IonCol, IonRow } from '@ionic/react';
import React from 'react';
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
  background: #ffffff;
  box-shadow: 0px 0px 1px rgba(12, 26, 75, 0.24),
    0px 3px 8px -1px rgba(50, 50, 71, 0.05);
  border-radius: 16px;
  margin-bottom: 15px;
`;

const CardBody = styled.div<React.CSSProperties>`
  flex: ${props => (props.flex ? props.flex : '1')};
  padding: 25px 20px;
`;

export const CardRight = styled.div<React.CSSProperties>`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex: ${props => props.flex};
  padding-right: 16px;
`;

interface IProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  right?: React.ReactNode;
  rightFlex?: number;
  background?: string;
  titleColor?: string;
  descriptionColor?: string;
  children?: React.ReactNode;
}

const Card: React.FC<IProps> = ({
  title,
  description,
  action = null,
  right = null,
  rightFlex = 0.5,
  background = 'white',
  titleColor = '#27272E',
  descriptionColor = '#425466',
  children
}: IProps) => {
  return (
    <CardContainer background={background}>
      <CardBody flex={1 - rightFlex}>
        <CardTitle color={titleColor}>
          <IonRow>
            <IonCol style={{ paddingLeft: 0 }}>{title}</IonCol>
            <IonCol size="auto">{action}</IonCol>
          </IonRow>
        </CardTitle>
        {description && (
          <CardDescription color={descriptionColor}>
            {description}
          </CardDescription>
        )}
        {children}
      </CardBody>
      <CardRight flex={rightFlex}>{right}</CardRight>
    </CardContainer>
  );
};

export default Card;
