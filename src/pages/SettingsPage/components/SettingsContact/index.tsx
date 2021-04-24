import React, { useState } from 'react';
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
import { UserService } from 'src/services/user.service';
import { showNotify } from 'src/utils/notify';

const SettingsContact: React.FC = () => {
  const formRef: any = React.createRef();

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const send = async () => {
    const bodyContact = {
      subject: subject,
      description: description,
      email: UserService.GetUserSession()?.loginCred?.email
    };

    const emailresponse: Response = await fetch(
      `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/tuumtech/contact`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`
        },
        body: JSON.stringify(bodyContact)
      }
    );

    if (emailresponse.status === 200) {
      showNotify('Email sent successfully', 'success');
    }
  };

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
                <form
                  ref={formRef}
                  action={`process.env.REACT_APP_PROFILE_API_SERVICE_URL/v1/tuumtech/support`}
                >
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
                    value={subject}
                    onChange={(e: any) => setSubject(e)}
                    placeholder="Enter your title"
                  ></TextInput>
                  <TextareaInput
                    label="Description"
                    cols={20}
                    rows={6}
                    value={description}
                    onChange={(e: any) => setDescription(e)}
                    placeholder="Write your message..."
                  ></TextareaInput>
                  <SpaceLs></SpaceLs>
                  <Button
                    type="primary"
                    text="Send Message"
                    onClick={send}
                  ></Button>
                  <SpaceMd></SpaceMd>
                </form>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  );
};

export default SettingsContact;
