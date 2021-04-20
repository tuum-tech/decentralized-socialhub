import React from 'react';
import {
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonGrid,
  IonRow,
  IonContent,
  IonText
} from '@ionic/react';
import { PageTitle, PageCategory, SpaceMd, SpaceLs } from 'src/components/note';
import style from './style.module.scss';
import TextInput from 'src/components/inputs/TextInput';
import TextareaInput from 'src/components/inputs/TextareaInput';
import { Button } from 'src/components/buttons';

const SettingsContact: React.FC = () => {
  return (
    <IonContent className={style['settingscontact']}>
      <IonGrid className={style['tab-grid']}>
        <IonRow>
          <IonCol>
            <IonCard className={style['tab-card']}>
              <IonCardHeader>
                <PageCategory>Help & Support</PageCategory>
                <PageTitle>Contact Us[UNDER CONSTRUCTION]</PageTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonText>
                  <p>
                    Terms and conditions (also referred to as terms of use or
                    terms of service) are a form of legal agreement outlining
                    rules and restrictions for customers to follow when using
                    your site
                  </p>
                </IonText>
                <TextInput
                  label="Subject"
                  onChange={n => n}
                  placeholder="Enter your title"
                ></TextInput>
                <TextareaInput
                  label="Description"
                  cols={20}
                  rows={6}
                  onChange={n => n}
                  placeholder="Write your message..."
                ></TextareaInput>
                <SpaceLs></SpaceLs>
                <Button type="primary" text="Send Message"></Button>
                <SpaceMd></SpaceMd>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  );
};

export default SettingsContact;
