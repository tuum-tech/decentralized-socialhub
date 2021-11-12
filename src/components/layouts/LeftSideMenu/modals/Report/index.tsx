import React, { useState } from 'react';
import styled from 'styled-components';

import { IonModal, IonText } from '@ionic/react';
import { SpaceLs } from 'src/elements/note';
import style from './style.module.scss';
import TextInput from 'src/elements/inputs/TextInput';
import SelectInput from 'src/elements/inputs/SelectInput';
import TextareaInput from 'src/elements/inputs/TextareaInput';
import FileInput from 'src/elements/inputs/FileInput';
import { Button } from 'src/elements/buttons';
import { showNotify } from 'src/utils/notify';
import CloseButton from '../CloseButton';

interface Props {
  session: ISessionItem;
  toggleReportProblem: () => void;
}

export const ReportModal = styled(IonModal)`
  --border-radius: 16px;
  --width: 513px;
  --height: 647px;

  :host(.modal-card) ion-header ion-toolbar:first-of-type {
    padding: 0px;
  }
`;

const Container = styled.div`
  padding: 20px 28px;
  .header {
    font-style: normal;
    font-weight: 600;
    font-size: 28px;
    line-height: 136.02%;
    color: #27272e;

    margin-bottom: 18px;
  }

  .item {
    display: flex;
    align-items: center;
    padding: 8px 0;
    cursor: pointer;

    .title {
      font-style: normal;
      font-weight: bold;
      font-size: 16px;
      line-height: 162.02%;
      color: #27272e;
      flex: none;
      order: 0;
      flex-grow: 0;
      margin: 0px 0px;
    }

    .img {
      margin-right: 20px;
      width: 28px;
      img {
        display: block;
        margin: 0 auto;
      }
    }

    .intro {
      font-style: normal;
      font-weight: normal;
      font-size: 13px;
      line-height: 162.02%;
      font-feature-settings: 'salt' on;
      color: #718096;
      flex: none;
      order: 1;
      flex-grow: 0;
      margin: 0px 0px;
    }
  }
`;

const ReportModalContent: React.FC<Props> = ({
  session,
  toggleReportProblem
}) => {
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [feedback, setFeedback] = useState('1');

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
    const userinfo = {
      name: session.name,
      did: session.did,
      email: session.loginCred?.email
    };
    const feedbackType = feedback === '1' ? 'Suggestion' : 'Bug';
    const bodyContact = {
      subject: `[${feedbackType}] - ${subject}`,
      userinfo: userinfo,
      description: description,
      attachments: fileToSend
    };

    const emailResponse: Response = await fetch(
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

    if (emailResponse.status === 200) {
      showNotify('Email sent successfully', 'success');
      setDescription('');
      setFeedback('1');
      setSubject('');
    } else {
      showNotify('Error sending email. Please try again another time', 'error');
    }

    toggleReportProblem();
  };

  return (
    <Container>
      <p className="header mb-0">Report a problem</p>
      <CloseButton onClick={toggleReportProblem} />
      <div className={style['settingsreport']}>
        <div>
          <IonText>
            <p className={style.description}>
              Facing any issues, problems or something not working right share
              it with us.
            </p>
          </IonText>
          <SelectInput
            label="Feedback type"
            values={[
              { value: 1, text: 'Suggestion' },
              { value: 2, text: 'Bug' }
            ]}
            onChange={e => setFeedback(e)}
            placeholder="Suggestion"
            className={style.margin30}
          ></SelectInput>
          <TextInput
            label="Subject"
            value={subject}
            onChange={(e: any) => setSubject(e)}
            placeholder="Give it a short name"
            className={style.margin30}
          ></TextInput>
          <TextareaInput
            label="Comments"
            cols={20}
            rows={2}
            value={description}
            onChange={(e: any) => setDescription(e)}
            placeholder="Write your message here..."
            className={style.margin30}
          ></TextareaInput>
          <FileInput
            label="Attachment a picture or a video"
            onChange={e => setFile(e)}
          ></FileInput>
          <SpaceLs></SpaceLs>
          <SpaceLs></SpaceLs>
          <SpaceLs></SpaceLs>
          <Button type="primary" text="Send Message" onClick={send}></Button>
        </div>
      </div>
    </Container>
  );
};

export default ReportModalContent;
