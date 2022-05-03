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
  IonItem,
  IonLabel
} from '@ionic/react';
import { startCase } from 'lodash';

import { ProfileService } from 'src/services/profile.service';
import styleWidget from 'src/components/cards/WidgetCards.module.scss';
import { DefaultButton } from 'src/elements-v2/buttons';
import Toggle from 'src/elements-v2/Toggle';
import { Divider } from '../TemplateManagerCard';

interface IProps {
  sessionItem: ISessionItem;
}

const PublicFields: React.FC<IProps> = ({ sessionItem }: IProps) => {
  const [fields, setFields] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const defaultFields = [
    'about',
    'education',
    'experience',
    'follower',
    'following',
    'mutual',
    'social',
    'badge'
  ];
  const extraFields = {
    default: [],
    crypto: ['wallet'],
    gamer: ['played games', 'gamer tags', 'gamer profile'],
    soccer: ['sports', 'teams'],
    education: ['developer', 'thesis', 'paper', 'license', 'certification']
  };

  useEffect(() => {
    (async () => {
      if (
        !sessionItem ||
        sessionItem.did === '' ||
        loaded ||
        sessionItem.tutorialStep !== 4
      )
        return;
      const orgFields = await ProfileService.getPublicFields(sessionItem.did);
      setFields(orgFields);
      setLoaded(true);
    })();
  }, [sessionItem, sessionItem.did, loaded]);

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
              <DefaultButton
                size="small"
                variant="outlined"
                btnColor="primary-gradient"
                textType="gradient"
                disabled={sessionItem.tutorialStep !== 4}
                onClick={async () => {
                  await ProfileService.updatePublicFields(fields, sessionItem);
                }}
              >
                Save
              </DefaultButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardHeader>
      <IonCardContent>
        <IonText>Set visibility of sections</IonText>
        <Divider />
        {defaultFields
          .concat(
            (extraFields as any)[
              sessionItem.pageTemplate ? sessionItem.pageTemplate : 'default'
            ]
          )
          .map(field => (
            <IonItem key={field}>
              <IonLabel>{startCase(field)}</IonLabel>
              <Toggle
                checked={fields.includes(field)}
                handleClick={e => {
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
