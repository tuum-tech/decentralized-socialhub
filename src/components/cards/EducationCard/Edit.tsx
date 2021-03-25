import React from 'react';
import {
  IonCardTitle,
  IonCheckbox,
  IonCol,
  IonLabel,
  IonRow
} from '@ionic/react';
import styled from 'styled-components';

import SmallTextInput from '../../inputs/SmallTextInput';
import { MyTextarea, MyGrid } from '../ExperienceCard/Item';

interface EducationItemProps {
  educationItem: EducationItem;
  handleChange: any;
  index: number;
  mode: string;
}

const Spacer = styled.div`
  margin-top: 40px;
  padding: 5px;
`;

const EducationCardEdit: React.FC<EducationItemProps> = ({
  educationItem,
  handleChange,
  index,
  mode
}: EducationItemProps) => {
  const handleChangeIndex = (evt: any) => {
    handleChange(evt, index);
  };

  return (
    <MyGrid>
      <IonRow>
        <IonCardTitle>Save</IonCardTitle>
      </IonRow>
      <IonRow class="ion-justify-content-start">
        <IonCol size="5">
          <SmallTextInput
            label="Program / Degree"
            placeholder="e.g. Blockchain developer"
            name="program"
            value={educationItem.program}
            onChange={handleChangeIndex}
          />
        </IonCol>
      </IonRow>
      <IonRow class="ion-justify-content-start">
        <IonCol size="8">
          <SmallTextInput
            label="University / Institution name"
            placeholder="e.g. Harvard, MIT, ..."
            name="institution"
            value={educationItem.institution}
            onChange={handleChangeIndex}
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
            value={educationItem.start}
            onChange={handleChangeIndex}
          />
        </IonCol>
        <IonCol size="4.5">
          <SmallTextInput
            label="&nbsp;"
            type="date"
            placeholder="End"
            name="end"
            value={educationItem.end}
            onChange={handleChangeIndex}
          />
        </IonCol>
        <IonCol size="3">
          <Spacer>
            <IonCheckbox
              checked={educationItem.still}
              name="still"
              onIonChange={handleChangeIndex}
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
            onIonChange={handleChangeIndex}
          />
        </IonCol>
      </IonRow>
    </MyGrid>
  );
};

export default EducationCardEdit;
