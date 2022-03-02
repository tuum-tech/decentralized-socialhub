import React from 'react';
import {
  IonRow,
  IonCardTitle,
  IonCol,
} from '@ionic/react';
import styled from 'styled-components';
import { CardOverview, CardHeader, CardContent } from 'src/components/cards/common';
import { LinkStyleSpan } from '../MainBoard/common';
import space_cat1 from 'src/assets/icon/space_category1.svg';
import space_cat2 from 'src/assets/icon/space_category2.svg';
import space_cat3 from 'src/assets/icon/space_category3.svg';
import space_cat4 from 'src/assets/icon/space_category4.svg';
import space_cat5 from 'src/assets/icon/space_category5.svg';
import space_cat6 from 'src/assets/icon/space_category6.svg';

const ItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 15px;
  margin-right: 14px;
  margin-bottom: 14px;
  border-radius: 10px;
  border: 1px solid #cbd5e0;
  span {
    margin-left: 10px;
    font-size: 13px;
    font-weight: 500;
    color: #718096;
  }
`;
interface IProps {
  template?: string;
}

const Category: React.FC<IProps> = ({ template = 'default' }: IProps) => {
  return (
    <CardOverview template={template}>
      <CardHeader>
        <IonRow className="ion-justify-content-between ion-no-padding">
          <IonCol className="ion-no-padding">
            <IonCardTitle>Category</IonCardTitle>
          </IonCol>
          <IonCol size="auto" className="ion-no-padding">
            <LinkStyleSpan>Explore all</LinkStyleSpan>
          </IonCol>
        </IonRow>
      </CardHeader>
      <CardContent>
        <IonRow>
          <ItemWrapper>
            <img src={space_cat1} />
            <span>Music</span>
          </ItemWrapper>
          <ItemWrapper>
            <img src={space_cat2} />
            <span>Identity</span>
          </ItemWrapper>
        </IonRow>
        <IonRow>
          <ItemWrapper>
            <img src={space_cat3} />
            <span>Elastos</span>
          </ItemWrapper>
          <ItemWrapper>
            <img src={space_cat4} />
            <span>GameFi</span>
          </ItemWrapper>
        </IonRow>
        <IonRow>
          <ItemWrapper>
            <img src={space_cat5} />
            <span>Metaverse</span>
          </ItemWrapper>
          <ItemWrapper>
            <img src={space_cat6} />
            <span>Tourism</span>
          </ItemWrapper>
        </IonRow>
      </CardContent>
    </CardOverview>
  );
};

export default Category;
