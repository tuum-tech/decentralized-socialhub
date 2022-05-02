import React from 'react';
import { IonGrid, IonRow, IonCardTitle, IonCol } from '@ionic/react';
import styled from 'styled-components';
import {
  CardOverview,
  CardHeaderContent,
  CardContentContainer
} from 'src/components/cards/common';
import { LinkStyleSpan } from '../MainBoard/common';

const ItemWrapper = styled(IonCol)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 15px;
  margin-right: 14px;
  margin-bottom: 14px;
  border-radius: 10px;
  border: 1px solid #cbd5e0;
  span {
    margin: 0px 10px;
    font-size: 13px;
    font-weight: 500;
    color: #718096;
  }
`;
interface IProps {
  template?: string;
  space: any;
}

const Category: React.FC<IProps> = ({
  template = 'default',
  space
}: IProps) => {
  return (
    <CardOverview template={template}>
      <CardHeaderContent>
        <IonRow className="ion-justify-content-between ion-no-padding">
          <IonCol className="ion-no-padding">
            <IonCardTitle>Category</IonCardTitle>
          </IonCol>
          <IonCol size="auto" className="ion-no-padding">
            <LinkStyleSpan style={{ opacity: 0.5 }}>Explore all</LinkStyleSpan>
          </IonCol>
        </IonRow>
      </CardHeaderContent>
      <CardContentContainer>
        <IonGrid>
          <IonRow>
            {space.tags &&
              space.tags.map((tag: string) => (
                <ItemWrapper key={tag}>
                  <span>{tag}</span>
                </ItemWrapper>
              ))}
          </IonRow>
        </IonGrid>
      </CardContentContainer>
    </CardOverview>
  );
};

export default Category;
