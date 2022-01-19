import React from 'react';
import styled from 'styled-components';
import { IonCol, IonGrid, IonModal, IonRow } from '@ionic/react';

import airplane from 'src/assets/icon/airplane.png';

export const CancelRequestModal = styled(IonModal)`
  --border-radius: 16px;
  --width: 410px;
  --height: 260px;
  :host(.modal-card) ion-header ion-toolbar:first-of-type {
    padding: 0px;
  }
`;

export const Grid = styled(IonGrid)`
  --ion-grid-padding: 0px;
  width: 80%;
  margin-inline-end: 15px;
  margin-inline-start: 15px;
`;

export const BlueButton = styled.button`
  height: 40px;
  margin-top: 20px;
  padding: 12px 15px;
  border-radius: 9px;
  background-color: #4c6fff;

  font-family: 'SF Pro Display';
  font-size: 14px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  text-align: left;
  color: #ffffff;
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 15px;

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
  verification: VerificationRequest;
  onConfirm: (v: VerificationRequest) => Promise<void>;
  onAbort: () => void;
}

const CancelRequestModalContent: React.FC<Props> = ({
  verification,
  onConfirm,
  onAbort
}) => {
  return (
    <Container>
      <img src={airplane} alt="sent" />
      <p className="title">Cancel Request</p>
      <p className="text">
        Once you cancel, you will need to request the verification again.
      </p>

      <Grid>
        <IonRow class="ion-no-padding">
          <IonCol size="6">
            <BlueButton onClick={() => onConfirm(verification)}>
              Confirm
            </BlueButton>
          </IonCol>
          <IonCol size="6">
            <BlueButton onClick={() => onAbort()}>Do nothing</BlueButton>
          </IonCol>
        </IonRow>
      </Grid>
    </Container>
  );
};

export default CancelRequestModalContent;
