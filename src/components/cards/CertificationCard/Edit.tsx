import React from 'react';
import { IonCol, IonGrid, IonRow } from '@ionic/react';

import SmallTextInput from '../../../elements/inputs/SmallTextInput';
import { MODE, MyTextarea, StyledLabel } from '../common';

export const pattern = new RegExp('^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$');

interface CertificationItemProps {
  certificationItem: CertificationItem;
  handleChange: any;
  mode: MODE;
}

const CertificationEditCard: React.FC<CertificationItemProps> = ({
  certificationItem,
  handleChange,
  mode
}: CertificationItemProps) => {
  return (
    <IonGrid>
      <IonRow class="ion-justify-content-start">
        <IonCol sizeXs="12" sizeSm="8">
          <SmallTextInput
            label="Title"
            placeholder="e.g. Pari S.G"
            name="title"
            hasError={mode === MODE.ERROR && !certificationItem.title}
            value={certificationItem.title}
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
            hasError={mode === MODE.ERROR && !certificationItem.acknowledger}
            value={certificationItem.acknowledger}
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
            hasError={mode === MODE.ERROR && !certificationItem.awardDate}
            value={certificationItem.awardDate}
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
            value={certificationItem.description}
            onIonChange={handleChange}
          />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default CertificationEditCard;
