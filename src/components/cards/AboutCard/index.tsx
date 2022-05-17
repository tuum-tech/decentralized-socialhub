import React, { useState, useEffect, useRef } from 'react';
import { IonCol, IonText } from '@ionic/react';
import styled from 'styled-components';
import { LinkStyleSpan, MyTextarea } from '../common';
import Card from 'src/elements-v2/Card';
import Modal from 'src/elements-v2/Modal';

const StyledLabel = styled(IonText)`
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: #425466;
`;

interface IProps {
  mode?: string;
  update?: any;
  aboutText: string;
  template?: string;
  openModal?: boolean;
}

const AboutCard: React.FC<IProps> = ({
  aboutText,
  mode = 'read',
  update,
  template = 'default'
}: IProps) => {
  const modalRef = useRef(null);
  const [about, setAbout] = useState(aboutText ? aboutText : '');

  useEffect(() => {
    setAbout(aboutText);
  }, [aboutText]);

  const handleEdit = () => {
    (modalRef?.current as any).open();
  };

  if (mode !== 'edit' && (aboutText === '' || aboutText === undefined)) {
    return <></>;
  }

  return (
    <>
      <Card
        title="About"
        description={about}
        action={
          mode === 'edit' ? (
            <IonCol size="auto" className="ion-no-padding">
              <LinkStyleSpan onClick={handleEdit}>Edit</LinkStyleSpan>
            </IonCol>
          ) : (
            ''
          )
        }
      ></Card>
      <Modal
        ref={modalRef}
        title={`${aboutText ? 'Edit' : 'Add'} About`}
        okText={aboutText ? 'Update' : 'Save'}
        onOk={async () => {
          await update(about);
        }}
        contentStyle={{ marginTop: 27 }}
      >
        <StyledLabel>Description / Responsibilities</StyledLabel>
        <MyTextarea
          rows={5}
          name="about"
          value={about}
          onIonChange={(evt: any) => setAbout(evt.target.value)}
        />
      </Modal>
    </>
  );
};

export default AboutCard;
