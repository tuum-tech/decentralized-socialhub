import React, { useState, useEffect } from 'react';
import { IonItem, IonLabel } from '@ionic/react';
import { startCase } from 'lodash';

import { ProfileService } from 'src/services/profile.service';
import { DefaultButton } from 'src/elements-v2/buttons';
import Toggle from 'src/elements-v2/Toggle';
import Card from 'src/elements-v2/Card';

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
    <Card
      title="Privacy Settings"
      description="Set visibility of sections"
      action={
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
      }
    >
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
    </Card>
  );
};

export default PublicFields;
