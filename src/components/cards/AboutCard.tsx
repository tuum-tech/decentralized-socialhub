import React, { useState, useEffect } from 'react';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonRow
} from '@ionic/react';
import styled from 'styled-components';

import {
  LinkStyleSpan,
  MyModal,
  MyGrid,
  MyTextarea,
  ModalFooter
} from './common';
import styleWidget from './WidgetCards.module.scss';

const About = styled.span`
  white-space: break-spaces !important;
  margin: 9px 0 0 0;
  font-family: 'SF Pro Display';
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.6;
  letter-spacing: normal;
  text-align: left;
  color: #425466;
`;

interface IProps {
  mode?: string;
  update?: any;
  aboutText: string;
}

const AboutCard: React.FC<IProps> = ({
  aboutText,
  mode = 'read',
  update
}: IProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [about, setAbout] = useState(aboutText ? aboutText : '');

  useEffect(() => {
    setAbout(aboutText);
  }, [aboutText]);

  console.log('====>', mode, aboutText ? 'test' : 'no');

  if (mode !== 'edit' && (aboutText === '' || aboutText === undefined)) {
    return <></>;
  }

  return (
    <>
      <IonCard className={styleWidget['overview']}>
        <IonCardHeader>
          <IonGrid>
            <IonRow className="ion-justify-content-between">
              <IonCol>
                <IonCardTitle>About</IonCardTitle>
              </IonCol>
              {mode === 'edit' ? (
                <IonCol size="auto">
                  <LinkStyleSpan onClick={() => setIsEditing(true)}>
                    + Edit
                  </LinkStyleSpan>
                </IonCol>
              ) : (
                ''
              )}
            </IonRow>
          </IonGrid>
        </IonCardHeader>
        <IonCardContent>
          <IonGrid>
            <IonRow>
              <IonCol size="12">
                <About>{about}</About>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardContent>
      </IonCard>
      <MyModal isOpen={isEditing} cssClass="my-custom-class">
        <MyGrid>
          <IonRow>
            <IonCardTitle>Edit About</IonCardTitle>
          </IonRow>
          <IonRow>
            <IonCol>
              <MyTextarea
                rows={5}
                name="about"
                value={about}
                onIonChange={(evt: any) => setAbout(evt.target.value)}
              />
            </IonCol>
          </IonRow>
        </MyGrid>
        <ModalFooter className="ion-no-border">
          <IonRow className="ion-justify-content-around">
            <IonCol size="auto">
              <IonButton fill="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </IonButton>
              <IonButton
                onClick={async () => {
                  await update(about);
                  setIsEditing(false);
                }}
              >
                Save
              </IonButton>
            </IonCol>
          </IonRow>
        </ModalFooter>
      </MyModal>
    </>
  );
};

export default AboutCard;
