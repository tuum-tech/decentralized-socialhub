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

interface LicenseItemProps {
  licenseItem: LicenseItem;
  handleChange: any;
  mode: MODE;
}

const Spacer = styled.div`
  margin-top: 40px;
  padding: 5px;
`;

const TeamCardEdit: React.FC<LicenseItemProps> = ({
  licenseItem,
  handleChange,
  mode
}: LicenseItemProps) => {
  return (
    <MyGrid>
      <IonRow>
        <IonCardTitle>License</IonCardTitle>
      </IonRow>
      <IonRow class="ion-justify-content-start">
        <IonCol size="5">
          <SmallTextInput
            label="Title"
            placeholder="e.g. Pari S.G"
            name="title"
            hasError={mode === MODE.ERROR && !licenseItem.title}
            value={licenseItem.title}
            onChange={handleChange}
          />
        </IonCol>
      </IonRow>
      <IonRow class="ion-justify-content-start">
        <IonCol size="5">
          <SmallTextInput
            label="Acknowledger"
            placeholder="e.g. Pari S.G"
            name="acknowledger"
            hasError={mode === MODE.ERROR && !licenseItem.acknowledger}
            value={licenseItem.acknowledger}
            onChange={handleChange}
          />
        </IonCol>
      </IonRow>
      <IonRow class="ion-justify-content-start">
        <IonCol size="4.5">
          <SmallTextInput
            label="Award Date"
            placeholder="Start"
            type="date"
            name="awardDate"
            hasError={mode === MODE.ERROR && !licenseItem.awardDate}
            value={licenseItem.awardDate}
            onChange={handleChange}
          />
        </IonCol>
      </IonRow>
      <IonRow class="ion-justify-content-start">
        <IonCol size="8">
          <IonLabel>Description</IonLabel>
          <MyTextarea
            rows={3}
            name="description"
            placeholder="..."
            value={licenseItem.description}
            onIonChange={handleChange}
          />
        </IonCol>
      </IonRow>
    </MyGrid>
  );
};

export default TeamCardEdit;
