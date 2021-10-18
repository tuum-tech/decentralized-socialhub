import React, { useState } from 'react';
import styled from 'styled-components';
import { IonTextarea, IonCol, IonRow } from '@ionic/react';

import arrowLeft from 'src/assets/icon/arrow-left-square.svg';
import Avatar from 'src/components/Avatar';
import Expander from 'src/elements/Expander';
import { getCategoryTitle } from 'src/utils/credential';

import { Container, NextButton } from './step1';

const InfoTxt = styled.p`
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;
  color: #425466;
`;

interface Props {
  selectedDids: string[];
  credentials: VerificationData[];
  onPrev: () => void;
  sendRequest: (msg: string) => void;
  session: ISessionItem;
}

const ReviewPage = ({
  selectedDids,
  credentials,
  session,
  onPrev,
  sendRequest
}: Props) => {
  const [msg, setMsg] = useState('');

  return (
    <Container>
      <img
        onClick={() => onPrev()}
        src={arrowLeft}
        alt="arrow-left"
        className="mb-1"
        width="20px"
      />
      <div className="title mb-2">Review request</div>
      <div className="intro mb-2" style={{ color: 'black' }}>
        Please review the details from confirming the request
      </div>
      <div>
        {credentials.map(c => (
          <Expander
            title={getCategoryTitle(c)}
            cateogiries={c.records}
            key={c.idKey}
          />
        ))}
      </div>

      <IonRow>
        <IonCol size="5">
          <InfoTxt>Seleceted Verifiers</InfoTxt>
          <div style={{ display: 'flex' }}>
            {selectedDids.map(did => (
              <div className="mr-2" key={did}>
                <Avatar did={did} width="40px" />
              </div>
            ))}
          </div>
        </IonCol>

        <IonCol size="7">
          <InfoTxt>Message (Optional)</InfoTxt>
          <IonTextarea
            placeholder="Enter a message for the verifiers"
            value={msg}
            style={{
              background: '#EDF2F7',
              borderRadius: '8px'
            }}
            onIonChange={n => setMsg(n.detail.value!)}
          />
        </IonCol>
      </IonRow>
      <div className="intro mb-2" style={{ color: 'black' }}>
        By continuing, you agree to the terms and community guidelines
      </div>
      <NextButton onClick={() => sendRequest(msg)}>Send Request</NextButton>
    </Container>
  );
};

export default ReviewPage;
