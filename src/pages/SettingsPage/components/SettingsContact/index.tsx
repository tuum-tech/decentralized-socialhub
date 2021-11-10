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
import { PageTitle, PageCategory, SpaceMd, SpaceLs } from 'src/elements/note';
import style from './style.module.scss';
import TextInput from 'src/elements/inputs/TextInput';
import TextareaInput from 'src/elements/inputs/TextareaInput';
import { Button } from 'src/elements/buttons';
import { showNotify } from 'src/utils/notify';

interface Props {
  useSession: ISessionItem;
}

const SettingsContact: React.FC<Props> = ({ useSession }: Props) => {
  const formRef: any = React.createRef();

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const send = async () => {
    const userinfo = {
      name: useSession.name,
      did: useSession.did,
      email: useSession.loginCred?.email
    };
    const bodyContact = {
      subject: `[Contact Us] - ${subject}`,
      userinfo: userinfo,
      description: description
    };

    const emailresponse: Response = await fetch(
      `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/support_router/send_email`,
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
      setDescription('');
      setSubject('');
    } else {
      showNotify('Error sending email. Please try again another time', 'error');
    }
  };

  return (
    <IonContent className={style['settingscontact']}>
      <IonGrid className={style['tab-grid']}>
        <IonRow>
          <IonCol>
            <IonCard className={style['tab-card']}>
              <IonCardHeader>
                <PageCategory>Help &amp; Support</PageCategory>
                <PageTitle>Contact Us</PageTitle>
              </IonCardHeader>
              <IonCardContent>
                <form
                  ref={formRef}
                  action={`process.env.REACT_APP_PROFILE_API_SERVICE_URL/v1/support_router/send_email`}
                >
                  <IonText>
                    <p>
                      If you would like to contact us regarding any
                      collaboration opportunities, please use this form to get
                      in touch with us. Ensure that you have linked at least one
                      social media account or an email address linked to your
                      Profile so we can get back to you.
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
