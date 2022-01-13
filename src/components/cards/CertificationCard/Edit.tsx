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

interface CertificationItemProps {
  certificationItem: CertificationItem;
  handleChange: any;
  mode: MODE;
}

const Spacer = styled.div`
  margin-top: 40px;
  padding: 5px;
`;

const TeamCardEdit: React.FC<CertificationItemProps> = ({
  certificationItem,
  handleChange,
  mode
}: CertificationItemProps) => {
  return (
    <MyGrid>
      <IonRow>
        <IonCardTitle>Certification</IonCardTitle>
      </IonRow>
      <IonRow class="ion-justify-content-start">
        <IonCol size="5">
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
        <IonCol size="5">
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
        <IonCol size="4.5">
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
      <IonRow class="ion-justify-content-start">
        <IonCol size="8">
          <IonLabel>Description</IonLabel>
          <MyTextarea
            rows={3}
            name="description"
            placeholder="..."
            value={certificationItem.description}
            onIonChange={handleChange}
          />
        </IonCol>
      </IonRow>
    </MyGrid>
  );
};

export default TeamCardEdit;
