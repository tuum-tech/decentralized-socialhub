import React from 'react';
import { IonCol, IonGrid, IonRow } from '@ionic/react';

import SmallTextInput from '../../../elements/inputs/SmallTextInput';
import { MODE, MyTextarea, StyledLabel } from '../common';

export const pattern = new RegExp('^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$');

interface LicenseItemProps {
  licenseItem: LicenseItem;
  handleChange: any;
  mode: MODE;
}

const TeamCardEdit: React.FC<LicenseItemProps> = ({
  licenseItem,
  handleChange,
  mode
}: LicenseItemProps) => {
  return (
    <IonGrid>
      <IonRow class="ion-justify-content-start">
        <IonCol sizeXs="12" sizeSm="8">
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
        <IonCol sizeXs="12" sizeSm="8">
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
        <IonCol sizeXs="8" sizeSm="5">
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
      <IonRow class="ion-justify-content-start mt-3">
        <IonCol size="12">
          <StyledLabel>Description</StyledLabel>
          <MyTextarea
            rows={3}
            name="description"
            placeholder="..."
            value={licenseItem.description}
            onIonChange={handleChange}
          />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default TeamCardEdit;
