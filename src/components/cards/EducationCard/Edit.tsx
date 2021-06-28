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

interface EducationItemProps {
  educationItem: EducationItem;
  handleChange: any;
  mode: MODE;
}

const Spacer = styled.div`
  margin-top: 40px;
  padding: 5px;
`;

const EducationCardEdit: React.FC<EducationItemProps> = ({
  educationItem,
  handleChange,
  mode
}: EducationItemProps) => {
  return (
    <MyGrid>
      <IonRow>
        <IonCardTitle>
          {mode === MODE.EDIT ? 'Edit education' : 'Add new education'}
        </IonCardTitle>
      </IonRow>
      <IonRow class="ion-justify-content-start">
        <IonCol size="5">
          <SmallTextInput
            label="Program / Degree"
            placeholder="e.g. Blockchain developer"
            name="program"
            hasError={mode === MODE.ERROR && !educationItem.program}
            value={educationItem.program}
            onChange={handleChange}
          />
        </IonCol>
      </IonRow>
      <IonRow class="ion-justify-content-start">
        <IonCol size="8">
          <SmallTextInput
            label="University / Institution name"
            placeholder="e.g. Harvard, MIT, ..."
            name="institution"
            hasError={mode === MODE.ERROR && !educationItem.institution}
            value={educationItem.institution}
            onChange={handleChange}
          />
        </IonCol>
      </IonRow>
      <IonRow class="ion-justify-content-start">
        <IonCol size="4.5">
          <SmallTextInput
            label="Duration"
            placeholder="Start"
            type="date"
            name="start"
            hasError={mode === MODE.ERROR && !educationItem.start}
            value={educationItem.start}
            onChange={handleChange}
          />
        </IonCol>
        <IonCol size="4.5">
          <SmallTextInput
            label="&nbsp;"
            type="date"
            placeholder="End"
            name="end"
            hasError={mode === MODE.ERROR && !educationItem.end}
            value={educationItem.end}
            onChange={handleChange}
          />
        </IonCol>
        <IonCol size="3">
          <Spacer>
            <IonCheckbox
              checked={educationItem.still}
              name="still"
              onIonChange={handleChange}
            />{' '}
            Still studying
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
            value={educationItem.description}
            onIonChange={handleChange}
          />
        </IonCol>
      </IonRow>
    </MyGrid>
  );
};

export default EducationCardEdit;
