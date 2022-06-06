import React, { useState, useEffect, useRef } from 'react';
import { IonItem, IonLabel } from '@ionic/react';
import { startCase } from 'lodash';
import styled from 'styled-components';

import { ProfileService } from 'src/services/profile.service';
import { DefaultButton } from 'src/elements-v2/buttons';
import Toggle from 'src/elements-v2/Toggle';
import Card from 'src/elements-v2/Card';
import Modal from 'src/elements-v2/Modal';

const StyledItem = styled(IonItem)`
  --background: #f5f8fa;
  --border-radius: 8px;
  --border-style: none;
  margin-bottom: 10px;
`;

interface IProps {
  sessionItem: ISessionItem;
}

const PublicFields: React.FC<IProps> = ({ sessionItem }: IProps) => {
  const modalRef = useRef(null);
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

  const handleSave = () => {
    (async () => {
      await ProfileService.updatePublicFields(fields, sessionItem);
    })();
  };

  const handleEdit = () => {
    (modalRef?.current as any).open();
  };

  return (
    <>
      <Card
        template="default"
        title="Privacy Settings"
        description="Set visibility of sections"
        action={
          <DefaultButton
            size="small"
            variant="outlined"
            btnColor="primary-gradient"
            textType="gradient"
            disabled={sessionItem.tutorialStep !== 4}
            onClick={handleEdit}
          >
            Edit
          </DefaultButton>
        }
      ></Card>
      <Modal
        title="Privacy Settings"
        subtitle="Set visibility of sections"
        okText="Save Changes"
        onOk={handleSave}
        ref={modalRef}
      >
        {defaultFields
          .concat(
            (extraFields as any)[
              sessionItem.pageTemplate ? sessionItem.pageTemplate : 'default'
            ]
          )
          .map(field => (
            <StyledItem key={field}>
              <IonLabel style={{ fontSize: 14, color: '#7A7A9D' }}>
                {startCase(field)}
              </IonLabel>
              <Toggle
                checked={fields.includes(field)}
                handleClick={e => {
                  toggleClicked(field);
                }}
              />
              <IonLabel
                style={{
                  width: 55,
                  marginLeft: 12,
                  color: '#27272E',
                  fontSize: 13
                }}
                slot="end"
              >
                {fields.includes(field) ? 'Visible' : 'Hidden'}
              </IonLabel>
            </StyledItem>
          ))}
      </Modal>
    </>
  );
};

export default PublicFields;
