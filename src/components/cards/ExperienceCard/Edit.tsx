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
interface Props {
  experienceItem: ExperienceItem;
  handleChange: any;
  mode: MODE;
}

const ExperienceCardEdit: React.FC<Props> = ({
  experienceItem,
  handleChange,
  mode
}: Props) => {
  return (
    <IonGrid>
      <IonRow class="ion-justify-content-start">
        <IonCol sizeXs="12" sizeSm="8">
          <SmallTextInput
            placeholder="e.g. Blockchain developer"
            label="Title"
            name="title"
            hasError={
              (mode === MODE.ERROR && !experienceItem.title) ||
              !pattern.test(experienceItem.title)
            }
            value={experienceItem.title}
            onChange={handleChange}
          />
        </IonCol>
      </IonRow>
      <IonRow class="ion-justify-content-start">
        <IonCol sizeXs="12" sizeSm="8">
          <SmallTextInput
            placeholder="Google, Elastos Foundation, ..."
            label="Organization Name"
            name="institution"
            hasError={
              (mode === MODE.ERROR && !experienceItem.institution) ||
              !pattern.test(experienceItem.institution)
            }
            value={experienceItem.institution}
            onChange={handleChange}
          />
        </IonCol>
      </IonRow>
      <IonRow class="ion-justify-content-start">
        <IonCol sizeXs="5" sizeSm="3.5" className="mr-3">
          <SmallTextInput
            placeholder="start"
            label="Duration"
            name="start"
            type="date"
            hasError={mode === MODE.ERROR && !experienceItem.start}
            value={experienceItem.start}
            onChange={handleChange}
          />
        </IonCol>
        <IonCol sizeXs="5" sizeSm="3.5" className="mr-3">
          <SmallTextInput
            placeholder="end"
            label="&nbsp;"
            name="end"
            type="date"
            hasError={mode === MODE.ERROR && !experienceItem.end}
            value={experienceItem.end}
            onChange={handleChange}
          />
        </IonCol>
        <IonCol size="auto" class="ion-align-self-end">
          <Spacer>
            <IonCheckbox
              mode="md"
              checked={experienceItem.still}
              name="still"
              onIonChange={handleChange}
            />
            <CheckboxLabel>Currently Working</CheckboxLabel>
          </Spacer>
        </IonCol>
      </IonRow>
      <IonRow class="ion-justify-content-start mt-3">
        <IonCol sizeXs="12" sizeSm="8">
          <StyledLabel>Description</StyledLabel>
          <MyTextarea
            placeholder="..."
            rows={3}
            name="description"
            value={experienceItem.description}
            onIonChange={handleChange}
          />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default ExperienceCardEdit;
