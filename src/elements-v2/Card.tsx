import { IonCol, IonRow } from '@ionic/react';
import React from 'react';
import styled from 'styled-components';
import { getThemeData } from 'src/utils/template';

export const CardTitle = styled.div<ThemeProps>`
  color: ${({ template }: ThemeProps) =>
    getThemeData(template, 'card', 'cardTitle')};
  font-size: 18px;
  font-weight: bold;
  line-height: normal;
  margin-bottom: 10px;
`;

export const CardDescription = styled.p<ThemeProps>`
  margin-top: 5px;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 23px;
  color: ${({ template }: ThemeProps) =>
    getThemeData(template, 'card', 'cardText')};
  margin-bottom: 15px;
`;

export const CardContainer = styled.div<ThemeProps>`
  background-color: ${({ template }: ThemeProps) =>
    getThemeData(template, 'card', 'backgroundColor')};
  box-shadow: ${({ template }: ThemeProps) =>
    getThemeData(template, 'card', 'cardShadow')};
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
  template: string;
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
  template,
  title,
  description,
  action = null,
  right = null,
  rightFlex = 0.5,
  children
}: IProps) => {
  return (
    <CardContainer template={template}>
      <CardBody flex={1 - rightFlex}>
        <CardTitle template={template}>
          <IonRow>
            <IonCol style={{ paddingLeft: 0 }}>{title}</IonCol>
            <IonCol size="auto">{action}</IonCol>
          </IonRow>
        </CardTitle>
        {description && (
          <CardDescription template={template}>{description}</CardDescription>
        )}
        {children}
      </CardBody>
      <CardRight flex={rightFlex}>{right}</CardRight>
    </CardContainer>
  );
};

export default Card;
