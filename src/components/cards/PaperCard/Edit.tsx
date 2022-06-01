import React from 'react';
import { IonCheckbox, IonCol, IonGrid, IonRow } from '@ionic/react';

import SmallTextInput from '../../../elements/inputs/SmallTextInput';
import {
  CheckboxLabel,
  MODE,
  MyTextarea,
  Spacer,
  StyledLabel
} from '../common';

export const pattern = new RegExp('^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$');

interface PaperItemProps {
  paperItem: PaperItem;
  handleChange: any;
  mode: MODE;
}

const PaperCardEdit: React.FC<PaperItemProps> = ({
  paperItem,
  handleChange,
  mode
}: PaperItemProps) => {
  return (
    <IonGrid>
      <IonRow class="ion-justify-content-start">
        <IonCol size="8">
          <SmallTextInput
            label="Title"
            placeholder="e.g. The Problem and it's background"
            name="title"
            hasError={mode === MODE.ERROR && !paperItem.title}
            value={paperItem.title}
            onChange={handleChange}
          />
        </IonCol>
      </IonRow>
      <IonRow class="ion-justify-content-start">
        <IonCol size="7" className="mr-3">
          <SmallTextInput
            label="Publish date"
            placeholder="Publish date"
            type="date"
            name="publish"
            hasError={mode === MODE.ERROR && !paperItem.publish}
            value={paperItem.publish}
            onChange={handleChange}
          />
        </IonCol>
        <IonCol size="4">
          <Spacer noWrap>
            <IonCheckbox
              mode="md"
              checked={paperItem.still}
              name="still"
              onIonChange={handleChange}
            />
            <CheckboxLabel>Still writing</CheckboxLabel>
          </Spacer>
        </IonCol>
      </IonRow>
      <IonRow class="ion-justify-content-start mt-3">
        <IonCol size="12">
          <StyledLabel>Description</StyledLabel>
          <MyTextarea
            rows={3}
            name="description"
            placeholder="..."
            value={paperItem.description}
            onIonChange={handleChange}
          />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default PaperCardEdit;
