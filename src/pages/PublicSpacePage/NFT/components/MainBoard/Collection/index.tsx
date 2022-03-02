import React from 'react';
import {
  IonRow,
  IonCol,
} from '@ionic/react';
import { Wrapper } from '../common';
import Item from './Item';

interface IProps {}

const Collection: React.FC<IProps> = ({}: IProps) => {
  return (
    <Wrapper>
      <IonRow>
        <IonCol size="4">
          <Item />
        </IonCol>
        <IonCol size="4">
          <Item />
        </IonCol>
        <IonCol size="4">
          <Item />
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size="4">
          <Item />
        </IonCol>
        <IonCol size="4">
          <Item />
        </IonCol>
        <IonCol size="4">
          <Item />
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size="4">
          <Item />
        </IonCol>
        <IonCol size="4">
          <Item />
        </IonCol>
        <IonCol size="4">
          <Item />
        </IonCol>
      </IonRow>
    </Wrapper>
  );
};

export default Collection;
