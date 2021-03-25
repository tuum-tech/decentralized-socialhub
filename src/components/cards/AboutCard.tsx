import React, { useState, useEffect } from 'react';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonFooter,
  IonGrid,
  IonModal,
  IonRow,
  IonTextarea
} from '@ionic/react';
import styled from 'styled-components';

import styleWidget from './WidgetCards.module.scss';

const LinkStyleSpan = styled.span`
  font-family: 'SF Pro Display';
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: -0.07px;
  text-align: left;
  color: #4c6fff;
  cursor: default;
`;

const MyModal = styled(IonModal)`
  --border-radius: 16px;
  --min-height: 200px;
  --height: 280px;
  --width: 560px;
`;

const MyGrid = styled(IonGrid)`
  margin: 10px 20px 10px 20px;
  height: 100 %;
`;
const MyTextarea = styled(IonTextarea)`
  width: 90 %;
  margin-top: 15px;
  background: #edf2f7;
  box-shadow: 0px 1px 2px rgba(50, 50, 71, 0.08),
    0px 0px 1px rgba(50, 50, 71, 0.2);
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.15;
  font-family: 'SF Pro Display';
  letter-spacing: normal;
  text-align: left;
  color: #6b829a;
  --padding-bottom: 8px;
  --padding-top: 9px;
  --padding-end: 16px;
  --padding-start: 16px;
  --placeholder-color: var(--input - muted - placeholder);
`;
const About = styled.span`
  margin: 9px 0 0 10px;
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

const ModalFooter = styled(IonFooter)`
  padding: 12px;
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
          <About>{about}</About>
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
