import React, { useCallback, useState } from 'react';
import { IonRow } from '@ionic/react';
import styled from 'styled-components';
import { DefaultButton } from 'src/elements-v2/buttons';
import TextareaInput from 'src/elements/inputs/TextareaInput';
import { TuumTechScriptService } from 'src/services/script.service';
import useSession from 'src/hooks/useSession';
import { ModalTitle } from './common';
import { ErrorText } from 'src/elements/texts';
import ByeIcon from 'src/assets/icon/bye.svg';
import style from './style.module.scss';

const StyledButton = styled(DefaultButton)`
  margin: auto;
  width: 212px;
  height: 36px;
`;

const ButtonContainer = styled(IonRow)`
  justify-content: center;
  width: 480px;
  margin: auto;
  margin-top: 40px;
`;

interface Props {
  closeModal: () => void;
}

const FeedbackModalContent: React.FC<Props> = ({ closeModal }) => {
  const { session } = useSession();
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFeedbackChange = useCallback(v => {
    setFeedback(v);
  }, []);

  const handleSubmitFeedback = useCallback(async () => {
    setLoading(true);

    await TuumTechScriptService.addFeedback(session.did, feedback);
    setLoading(false);

    closeModal();
  }, [closeModal, feedback, session.did]);

  return (
    <>
      <IonRow className="ion-justify-content-center">
        <img src={ByeIcon} alt="bye-icon" />
      </IonRow>

      <ModalTitle>We’re sorry to see you go</ModalTitle>

      <TextareaInput
        label="Please let us know what made you deactivate your account. This will help us further improve our platform"
        cols={20}
        rows={3}
        value={feedback}
        onChange={handleFeedbackChange}
        placeholder="Write your response here..."
        className={style['modal-input']}
      />
      {error && <ErrorText align="center">{error}</ErrorText>}

      <ButtonContainer>
        <StyledButton
          variant="contained"
          btnColor="secondary-gradient"
          textType="gradient"
          onClick={closeModal}
        >
          Close
        </StyledButton>

        <StyledButton
          variant="contained"
          btnColor="primary-gradient"
          onClick={handleSubmitFeedback}
          loading={loading}
        >
          Submit & Close
        </StyledButton>
      </ButtonContainer>
    </>
  );
};

export default FeedbackModalContent;
