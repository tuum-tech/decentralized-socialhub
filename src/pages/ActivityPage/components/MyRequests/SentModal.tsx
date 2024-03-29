import React from 'react';
import styled from 'styled-components';
import { IonModal } from '@ionic/react';

import { DefaultButton } from 'src/elements-v2/buttons';
import airplane from 'src/assets/icon/airplane.png';

export const SentModal = styled(IonModal)`
  --border-radius: 16px;
  --width: 327px;
  --height: 248px;
  :host(.modal-card) ion-header ion-toolbar:first-of-type {
    padding: 0px;
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 20px;

  img {
    width: 33px;
    height: 30px;
  }

  .title {
    font-weight: 600;
    font-size: 28px;
    line-height: 136.02%;
    text-align: center;
    color: #101225;
    margin-top: 30px;
  }

  .text {
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 160%;
    text-align: center;
    font-feature-settings: 'salt' on;
    color: #1a202c;
  }
`;

interface Props {
  onClose: () => void;
}

const SentModalContent: React.FC<Props> = ({ onClose }) => {
  return (
    <Container>
      <img src={airplane} alt="sent" />
      <p className="title">Request Sent</p>
      <p className="text">
        You can track your requests from the activities panel.
      </p>
      <DefaultButton
        variant="contained"
        btnColor="primary-gradient"
        style={{ width: 212, marginTop: 28 }}
        onClick={onClose}
      >
        Done
      </DefaultButton>
    </Container>
  );
};

export default SentModalContent;
