import React from 'react';
import {
  IonCardTitle,
  IonCheckbox,
  IonCol,
  IonGrid,
  IonLabel,
  IonRow
} from '@ionic/react';

import SmallTextInput from '../../inputs/SmallTextInput';
import styled from 'styled-components';
import { MODE, MyTextarea } from '../common';

interface Props {
  experienceItem: ExperienceItem;
  handleChange: any;
  mode: MODE;
}
export const MyGrid = styled(IonGrid)`
  margin: 10px 20px 10px 20px;
  height: 100 %;
`;
const Spacer = styled.div`
  margin-top: 40px;
  padding: 5px;
`;

const ExperienceCardEdit: React.FC<Props> = ({
  experienceItem,
  handleChange,
  mode
}: Props) => {
  return (
    <MyGrid>
      <IonRow>
        <IonCardTitle>
          {mode === MODE.EDIT ? 'Edit experience' : 'Add new experience'}
        </IonCardTitle>
      </IonRow>
      <IonRow class="ion-justify-content-start">
        <IonCol size="5">
          <SmallTextInput
            placeholder="e.g. Blockchain developer"
            label="Title"
            name="title"
            hasError={mode === MODE.ERROR && !experienceItem.title}
            value={experienceItem.title}
            onChange={handleChange}
          />
        </IonCol>
      </IonRow>
      <IonRow class="ion-justify-content-start">
        <IonCol size="8">
          <SmallTextInput
            placeholder="Google, Elastos Foundation, ..."
            label="Organization Name"
            name="institution"
            hasError={mode === MODE.ERROR && !experienceItem.institution}
            value={experienceItem.institution}
            onChange={handleChange}
          />
        </IonCol>
      </IonRow>
      <IonRow class="ion-justify-content-start">
        <IonCol size="4.5">
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
        <IonCol size="4.5">
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
              checked={experienceItem.still}
              name="still"
              onIonChange={handleChange}
            />{' '}
            Still working
          </Spacer>
        </IonCol>
      </IonRow>
      <IonRow class="ion-justify-content-start">
        <IonCol size="8">
          <IonLabel>Description</IonLabel>
          <MyTextarea
            placeholder="..."
            rows={3}
            name="description"
            value={experienceItem.description}
            onIonChange={handleChange}
          />
        </IonCol>
      </IonRow>
    </MyGrid>
  );
};

export default ExperienceCardEdit;
