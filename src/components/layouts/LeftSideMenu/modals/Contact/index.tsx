import React, { useState } from 'react';
import styled from 'styled-components';

import { IonModal, IonText } from '@ionic/react';
import { SpaceLs } from 'src/elements/note';
import style from './style.module.scss';
import TextInput from 'src/elements/inputs/TextInput';
// import SelectInput from 'src/elements/inputs/SelectInput';
import TextareaInput from 'src/elements/inputs/TextareaInput';
// import FileInput from 'src/elements/inputs/FileInput';
import { Button } from 'src/elements/buttons';
import { showNotify } from 'src/utils/notify';
import CloseButton from '../CloseButton';

interface Props {
  session: ISessionItem;
  toggleContactUs: () => void;
}

export const ContactModal = styled(IonModal)`
  --border-radius: 16px;
  --width: 513px;
  --height: 519px;

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

const ContactModalContent: React.FC<Props> = ({ session, toggleContactUs }) => {
  const formRef: any = React.createRef();

  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const send = async () => {
    const userinfo = {
      name: session.name,
      did: session.did,
      email: session.loginCred?.email
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
    <Container>
      <p className="header mb-0">Contact us</p>
      <CloseButton onClick={toggleContactUs} />
      <div className={style['settingsContact']}>
        <div>
          <form
            ref={formRef}
            action={`process.env.REACT_APP_PROFILE_API_SERVICE_URL/v1/support_router/send_email`}
          >
            <IonText>
              <p className={style.description}>
                Facing any issues, problems or something not working right share
                it with us.
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
            <SpaceLs></SpaceLs>
            <SpaceLs></SpaceLs>
            <Button type="primary" text="Send Message" onClick={send}></Button>
          </form>
        </div>
      </div>
    </Container>
  );
};

export default ContactModalContent;
