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
import { PageTitle, PageCategory, SpaceLs } from 'src/components/note';
import style from './style.module.scss';
import TextInput from 'src/components/inputs/TextInput';
import SelectInput from 'src/components/inputs/SelectInput';
import TextareaInput from 'src/components/inputs/TextareaInput';
import FileInput from 'src/components/inputs/FileInput';
import { Button } from 'src/components/buttons';
import { UserService } from 'src/services/user.service';
import { showNotify } from 'src/utils/notify';

const SettingsReport: React.FC = () => {
  const [comments, setComments] = useState('');
  const [subject, setSubject] = useState('');
  const [feedback, setFeedback] = useState('');

  let fileToSend: any = null;

  const toBase64 = (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

  const setFile = async (file: File) => {
    const fileBase64 = await toBase64(file);
    // using nodemailer attachments structure so no need to convert anything
    fileToSend = {
      fileName: file.name,
      path: fileBase64
    };
  };

  const send = async () => {
    const bodyContact = {
      subject: subject,
      feedback_type: feedback === '1' ? 'Suggestion' : 'Bug',
      comments: comments,
      email: UserService.GetUserSession()?.loginCred?.email,
      attachments: fileToSend
    };

    const emailResponse: Response = await fetch(
      `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/tuumtech/support`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`
        },
        body: JSON.stringify(bodyContact)
      }
    );

    if (emailResponse.status === 200) {
      showNotify('Email sent successfully', 'success');
      setComments('');
      setFeedback('');
      setSubject('');
    } else {
      showNotify('Error sending email. Please try again another time', 'error');
    }
  };

  return (
    <IonContent className={style['settingsreport']}>
      <IonGrid className={style['tab-grid']}>
        <IonRow>
          <IonCol>
            <IonCard className={style['tab-card']}>
              <IonCardHeader>
                <PageCategory>Help & Support</PageCategory>
                <PageTitle>Report a problem</PageTitle>
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
                  onChange={e => setFeedback(e)}
                  placeholder="Suggestion"
                ></SelectInput>
                <TextInput
                  label="Subject"
                  value={subject}
                  onChange={(e: any) => setSubject(e)}
                  placeholder="Give it a short name"
                ></TextInput>
                <TextareaInput
                  label="Comments"
                  cols={20}
                  rows={6}
                  value={comments}
                  onChange={(e: any) => setComments(e)}
                  placeholder="Write your message here..."
                ></TextareaInput>
                <FileInput
                  label="Attachment"
                  onChange={e => setFile(e)}
                ></FileInput>
                <SpaceLs></SpaceLs>
                <Button
                  type="primary"
                  text="Send Message"
                  onClick={send}
                ></Button>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  );
};

export default SettingsReport;
