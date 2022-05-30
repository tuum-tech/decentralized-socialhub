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

interface TeamItemProps {
  teamItem: TeamItem;
  handleChange: any;
  mode: MODE;
}

const TeamCardEdit: React.FC<TeamItemProps> = ({
  teamItem,
  handleChange,
  mode
}: TeamItemProps) => {
  return (
    <IonGrid>
      <IonRow class="ion-justify-content-start">
        <IonCol sizeXs="12" sizeSm="8">
          <SmallTextInput
            label="Name"
            placeholder="e.g. Pari S.G"
            name="name"
            hasError={mode === MODE.ERROR && !teamItem.name}
            value={teamItem.name}
            onChange={handleChange}
          />
        </IonCol>
      </IonRow>
      <IonRow class="ion-justify-content-start">
        <IonCol sizeXs="5" sizeSm="3.5" className="mr-3">
          <SmallTextInput
            label="Duration"
            placeholder="Start"
            type="date"
            name="start"
            hasError={mode === MODE.ERROR && !teamItem.start}
            value={teamItem.start}
            onChange={handleChange}
          />
        </IonCol>
        <IonCol sizeXs="5" sizeSm="3.5" className="mr-3">
          <SmallTextInput
            label="&nbsp;"
            type="date"
            placeholder="End"
            name="end"
            hasError={mode === MODE.ERROR && !teamItem.end}
            value={teamItem.end}
            onChange={handleChange}
          />
        </IonCol>
        <IonCol sizeXs="8" sizeSm="4">
          <Spacer>
            <IonCheckbox
              checked={teamItem.still}
              name="still"
              onIonChange={handleChange}
            />
            <CheckboxLabel>Still enrolling</CheckboxLabel>
          </Spacer>
        </IonCol>
      </IonRow>
      <IonRow class="ion-justify-content-start mt-3">
        <IonCol sizeXs="12" sizeSm="8">
          <StyledLabel>Description</StyledLabel>
          <MyTextarea
            rows={3}
            name="description"
            placeholder="..."
            value={teamItem.description}
            onIonChange={handleChange}
          />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default TeamCardEdit;
