import React, { useState } from 'react';
import styled from 'styled-components';
import { IonModal } from '@ionic/react';
import { IonTextarea } from '@ionic/react';

import { TuumTechScriptService } from 'src/services/script.service';
import { ModalTitle, ModalIntro, ModalButton } from './DeleteModal';
import wavinghand from 'src/assets/icon/wavinghand.png';

export const FeedbackModal = styled(IonModal)`
  --border-radius: 16px;
  --width: 645px;
  --height: 485px;
  :host(.modal-card) ion-header ion-toolbar:first-of-type {
    padding: 0px;
  }
`;

const Conatiner = styled.div`
  padding: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;

  img {
    width: 38px;
    margin: 20px;
    display: block;
    margin: 0 auto;
  }

  textarea {
    box-shadow: 0px 1px 2px rgba(50, 50, 71, 0.08),
      0px 0px 1px rgba(50, 50, 71, 0.2);
    border-radius: 6px;
    background: #edf2f7 !important;
    padding: 13px 16px !important;
    max-width: 420px !important;
    min-height: 100px;

    font-weight: 500;
    font-size: 13px !important;
    line-height: 15px !important;
    color: #c7cdd2;

    margin: 21px auto 25px !important;
  }
`;

interface Props {
  session: ISessionItem;
  closeModal: () => void;
}

const FeedbackModalContent = ({ session, closeModal }: Props) => {
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  return (
    <Conatiner>
      <img src={wavinghand} alt="waving hand" />
      <ModalTitle>We are sorry to see you go</ModalTitle>
      <ModalIntro>
        please let us know what made you deactivate your account. This will help
        us improve ourselves.
      </ModalIntro>
      <IonTextarea
        value={feedback}
        cols={4}
        onIonChange={e => {
          e.preventDefault();
          setFeedback(e.detail.value!);
        }}
        placeholder="Write your response here..."
      />

      <ModalButton
        disabled={feedback === '' || loading}
        className="submitBtn"
        onClick={async () => {
          setLoading(true);

          await TuumTechScriptService.addFeedback(session.did, feedback);
          setLoading(false);

          closeModal();
        }}
      >
        {loading ? 'Submitting Now' : 'Submit and Close'}
      </ModalButton>
      <ModalButton
        disabled={loading}
        className="submitBtn"
        onClick={closeModal}
        style={{
          color: '#4C6FFF',
          backgroundColor: 'white'
        }}
      >
        Skip & close
      </ModalButton>
    </Conatiner>
  );
};

export default FeedbackModalContent;
