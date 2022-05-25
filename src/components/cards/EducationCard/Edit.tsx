import React from 'react';
import { IonCheckbox, IonGrid, IonCol, IonLabel, IonRow } from '@ionic/react';
import styled from 'styled-components';

import SmallTextInput from '../../../elements/inputs/SmallTextInput';
import { MODE, MyTextarea } from '../common';

export const pattern = new RegExp('^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$');

interface EducationItemProps {
  educationItem: EducationItem;
  handleChange: any;
  mode: MODE;
}

const Spacer = styled.div`
  margin-top: 38px;
  padding: 5px;
  display: flex;
  align-items: center;
`;

const EducationCardEdit: React.FC<EducationItemProps> = ({
  educationItem,
  handleChange,
  mode
}: EducationItemProps) => {
  return (
    <IonGrid>
      <IonRow class="ion-justify-content-start">
        <IonCol size="8">
          <SmallTextInput
            label="Program / Degree"
            placeholder="e.g. Blockchain developer"
            name="program"
            hasError={
              (mode === MODE.ERROR && !educationItem.program) ||
              !pattern.test(educationItem.program)
            }
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
            hasError={
              (mode === MODE.ERROR && !educationItem.institution) ||
              !pattern.test(educationItem.institution)
            }
            value={educationItem.institution}
            onChange={handleChange}
          />
        </IonCol>
      </IonRow>
      <IonRow class="ion-justify-content-start">
        <IonCol size="3.5" className="mr-3">
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
        <IonCol size="3.5" className="mr-3">
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
        <IonCol size="4">
          <Spacer>
            <IonCheckbox
              checked={educationItem.still}
              name="still"
              onIonChange={handleChange}
            />
            <IonLabel className="pl-2">Currently Studying</IonLabel>
          </Spacer>
        </IonCol>
      </IonRow>
      <IonRow class="ion-justify-content-start">
        <IonCol size="8">
          <IonLabel>Description / Responsibilities</IonLabel>
          <MyTextarea
            rows={3}
            name="description"
            placeholder="..."
            value={educationItem.description}
            onIonChange={handleChange}
          />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default EducationCardEdit;
