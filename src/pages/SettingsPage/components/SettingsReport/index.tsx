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
import { PageTitle, PageCategory } from 'src/components/note';
import style from './style.module.scss';
import TextInput from 'src/components/inputs/TextInput';
import SelectInput from 'src/components/inputs/SelectInput';
import TextareaInput from 'src/components/inputs/TextareaInput';
import FileInput from 'src/components/inputs/FileInput';
import { PrimaryButton } from 'src/components/buttons';

const SettingsReport: React.FC = () => {
  return (
    <IonContent className={style['settingsreport']}>
      <IonGrid className={style['tab-grid']}>
        <IonRow>
          <IonCol>
            <IonCard className={style['tab-card']}>
              <IonCardHeader>
                <PageCategory>Help & Support</PageCategory>
                <PageTitle>Report a problem[UNDER CONSTRUCTION]</PageTitle>
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
                <SelectInput
                  label="Feedback type"
                  values={[
                    { value: 1, text: 'suggestion' },
                    { value: 2, text: 'bug' }
                  ]}
                  onChange={() => {}}
                  placeholder="Suggestion"
                ></SelectInput>
                <TextInput
                  label="Subject"
                  onChange={n => n}
                  placeholder="Give it a short name"
                ></TextInput>
                <TextareaInput
                  label="Comments"
                  cols={20}
                  rows={6}
                  onChange={n => n}
                  placeholder="Write your message here..."
                ></TextareaInput>
                <FileInput label="Attachment" onChange={n => n}></FileInput>
                <PrimaryButton text="Send Message"></PrimaryButton>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  );
};

export default SettingsReport;
