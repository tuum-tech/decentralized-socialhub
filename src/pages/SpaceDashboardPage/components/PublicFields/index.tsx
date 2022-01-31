import React, { useState, useEffect } from 'react';
import {
  IonCardTitle,
  IonCardHeader,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonToggle,
  IonItem,
  IonLabel
} from '@ionic/react';
import styled from 'styled-components';

import { ProfileService } from 'src/services/profile.service';
import styleWidget from 'src/components/cards/WidgetCards.module.scss';
import { SmallLightButton } from 'src/elements/buttons';
import { SpaceService } from 'src/services/space.service';

export const Divider = styled.hr`
  width: 100%;
  height: 1px;
  text-align: center;
  margin-top: 1.5em;
  margin-bottom: 1.5em;

  background-color: #f7fafc;
`;

interface IProps {
  sessionItem: ISessionItem;
  profile: any;
}

const PublicFields: React.FC<IProps> = ({ sessionItem, profile }: IProps) => {
  const [fields, setFields] = useState<string[]>([]);
  const defaultFields = ['about'];
  useEffect(() => {
    (async () => {
      const orgFields = profile.publicFields || [];
      setFields(orgFields);
    })();
  }, [profile]);

  const toggleClicked = (field: string) => {
    if (fields.includes(field)) {
      setFields(fields.filter(f => f !== field));
    } else {
      setFields([...fields, field]);
    }
  };

  return (
    <IonCard className={styleWidget['overview']}>
      <IonCardHeader>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonCardTitle>Privacy Settings</IonCardTitle>
            </IonCol>
            <IonCol size="auto">
              <SmallLightButton
                disabled={sessionItem.tutorialStep !== 4}
                onClick={async () => {
                  await SpaceService.addSpace(sessionItem, {
                    ...profile,
                    publicFields: fields
                  });
                }}
              >
                Save
              </SmallLightButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardHeader>
      <IonCardContent>
        <IonText>Set visibility of sections</IonText>
        <Divider />
        {defaultFields.map(field => (
          <IonItem key={field}>
            <IonLabel>{field}</IonLabel>
            <IonToggle
              checked={fields.includes(field)}
              onClick={e => {
                toggleClicked(field);
              }}
            />
          </IonItem>
        ))}
      </IonCardContent>
    </IonCard>
  );
};

export default PublicFields;
