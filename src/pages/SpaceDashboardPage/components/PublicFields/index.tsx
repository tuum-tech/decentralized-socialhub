import React, { useState, useEffect, useRef } from 'react';
import { IonItem, IonLabel } from '@ionic/react';
import styled from 'styled-components';
import { startCase } from 'lodash';

import { SpaceService } from 'src/services/space.service';
import Card from 'src/elements-v2/Card';
import { DefaultButton } from 'src/elements-v2/buttons';
import Modal from 'src/elements-v2/Modal';
import Toggle from 'src/elements-v2/Toggle';

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
  const modalRef = useRef(null);
  const [fields, setFields] = useState<string[]>([]);
  const defaultFields = ['about', 'follower', 'social links'];

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

  const handleEdit = () => {
    (modalRef?.current as any).open();
  };

  const handleSave = () => {
    (async () => {
      await SpaceService.addSpace(sessionItem, {
        ...profile,
        publicFields: fields
      });
    })();
  };

  return (
    <>
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
            onClick={handleEdit}
          >
            Edit
          </DefaultButton>
        }
      ></Card>
      <Modal
        title="Privacy Settings"
        okText="Save Changes"
        onOk={handleSave}
        ref={modalRef}
      >
        <p style={{ color: '#425466', fontSize: 14, marginBottom: 24 }}>
          Set visibility of sections
        </p>
        {defaultFields.map(field => (
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
      </Modal>
    </>
  );
};

export default PublicFields;
