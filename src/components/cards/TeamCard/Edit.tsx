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

interface TeamItemProps {
  teamItem: TeamItem;
  handleChange: any;
  mode: MODE;
}

const Spacer = styled.div`
  margin-top: 40px;
  padding: 5px;
`;

const TeamCardEdit: React.FC<TeamItemProps> = ({
  teamItem,
  handleChange,
  mode
}: TeamItemProps) => {
  return (
    <MyGrid>
      <IonRow>
        <IonCardTitle>Team</IonCardTitle>
      </IonRow>
      <IonRow class="ion-justify-content-start">
        <IonCol size="5">
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
        <IonCol size="4.5">
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
        <IonCol size="4.5">
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
        <IonCol size="3">
          <Spacer>
            <IonCheckbox
              checked={teamItem.still}
              name="still"
              onIonChange={handleChange}
            />{' '}
            Still enrolling
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
            value={teamItem.description}
            onIonChange={handleChange}
          />
        </IonCol>
      </IonRow>
    </MyGrid>
  );
};

export default TeamCardEdit;
