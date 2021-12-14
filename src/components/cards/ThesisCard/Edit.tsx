import React from 'react';
import {
  IonCardTitle,
  IonCheckbox,
  IonCol,
  IonLabel,
  IonRow
} from '@ionic/react';
import styled from 'styled-components';

import SmallTextInput from '../../../elements/inputs/SmallTextInput';
import { MODE, MyGrid, MyTextarea } from '../common';

export const pattern = new RegExp('^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$');

interface ThesisItemProps {
  thesisItem: ThesisItem;
  handleChange: any;
  mode: MODE;
}

const Spacer = styled.div`
  margin-top: 40px;
  padding: 5px;
`;

const ThesisCardEdit: React.FC<ThesisItemProps> = ({
  thesisItem,
  handleChange,
  mode
}: ThesisItemProps) => {
  return (
    <MyGrid>
      <IonRow>
        <IonCardTitle>Thesis</IonCardTitle>
      </IonRow>
      <IonRow class="ion-justify-content-start">
        <IonCol size="8">
          <SmallTextInput
            label="Title"
            placeholder="e.g. The Problem and it's background"
            name="title"
            hasError={mode === MODE.ERROR && !thesisItem.title}
            value={thesisItem.title}
            onChange={handleChange}
          />
        </IonCol>
      </IonRow>
      <IonRow class="ion-justify-content-start">
        <IonCol size="4.5">
          <SmallTextInput
            label="Publish date"
            placeholder="Publish date"
            type="date"
            name="publish"
            hasError={mode === MODE.ERROR && !thesisItem.publish}
            value={thesisItem.publish}
            onChange={handleChange}
          />
        </IonCol>
        <IonCol size="3">
          <Spacer>
            <IonCheckbox
              checked={thesisItem.still}
              name="still"
              onIonChange={handleChange}
            />{' '}
            Still writing
          </Spacer>
        </IonCol>
      </IonRow>
      <IonRow class="ion-justify-content-start">
        <IonCol size="8">
          <IonLabel>Description</IonLabel>
          <MyTextarea
            rows={3}
            name="description"
            placeholder="..."
            value={thesisItem.description}
            onIonChange={handleChange}
          />
        </IonCol>
      </IonRow>
    </MyGrid>
  );
};

export default ThesisCardEdit;
