import React, { useState, useEffect } from 'react';
import { IonButton, IonCardTitle, IonCol, IonRow } from '@ionic/react';
import {
  LinkStyleSpan,
  MyModal,
  MyGrid,
  MyTextarea,
  ModalFooter
} from '../common';
import Card from 'src/elements-v2/Card';

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
  template = 'default',
  openModal = false
}: IProps) => {
  const [isEditing, setIsEditing] = useState(openModal);
  const [about, setAbout] = useState(aboutText ? aboutText : '');

  useEffect(() => {
    setAbout(aboutText);
  }, [aboutText]);

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
              <LinkStyleSpan onClick={() => setIsEditing(true)}>
                Edit
              </LinkStyleSpan>
            </IonCol>
          ) : (
            ''
          )
        }
      ></Card>
      <MyModal
        isOpen={isEditing}
        onDidDismiss={() => setIsEditing(false)}
        cssClass="my-custom-class"
      >
        <MyGrid className="ion-no-padding">
          <IonRow className="ion-no-padding">
            <IonCardTitle>Edit About</IonCardTitle>
          </IonRow>
          <IonRow className="ion-no-padding">
            <IonCol className="ion-no-padding">
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
          <IonRow className="ion-justify-content-around ion-no-padding">
            <IonCol size="auto" className="ion-no-padding">
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
