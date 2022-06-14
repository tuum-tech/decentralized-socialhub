import React, { useCallback, useState } from 'react';
import { IonCardTitle, IonRow } from '@ionic/react';
import styled from 'styled-components';
import Modal from 'src/elements-v2/Modal';
import TextInput from 'src/elements/inputs/TextInput';
import { DefaultButton } from 'src/elements-v2/buttons';
import CutIcon from 'src/assets/icon/cut.svg';
import ByeIcon from 'src/assets/icon/bye.svg';
import style from './style.module.scss';
import TextareaInput from 'src/elements/inputs/TextareaInput';

const ModalTitle = styled(IonCardTitle)`
  color: #27272e;
  width: 100%;
  text-align: center;
  padding-top: 10px;
  font-weight: 700;
  font-size: 36px;
`;

interface Props {
  onClick: () => void;
  isAlertOpen: boolean;
  setIsAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeactivateModal: React.FC<Props> = ({
  onClick,
  isAlertOpen,
  setIsAlertOpen
}) => {
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState('');
  const [step, setStep] = useState(0);

  const handlePasswordChange = useCallback(v => {
    setPassword(v);
  }, []);

  const handleFeedbackChange = useCallback(v => {
    setFeedback(v);
  }, []);

  const handleClose = useCallback(() => {
    setIsAlertOpen(false);
    setFeedback('');
    setPassword('');
    setTimeout(() => {
      setStep(0);
    }, 500);
  }, [setIsAlertOpen]);

  const handleSubmit = useCallback(() => {
    (async () => {
      await onClick();
      setStep(1);
    })();
  }, [onClick]);

  const handleSubmitFeedback = useCallback(() => {
    console.log('handleSubmitFeedback feedback = ', feedback);
    setIsAlertOpen(false);
  }, [feedback, setIsAlertOpen]);

  return (
    <Modal
      title=""
      okText="Deactivate Account"
      isOpen={isAlertOpen}
      onClose={handleClose}
      autoWidth
      noButton
    >
      <IonRow className="ion-justify-content-center">
        <img src={step === 0 ? CutIcon : ByeIcon} alt="cut-icon" />
      </IonRow>

      <ModalTitle>
        {step === 0 ? 'Deactivate your account' : 'We’re sorry to see you go'}
      </ModalTitle>

      {step === 0 ? (
        <TextInput
          label="Please enter your account password before deactivation."
          value={password}
          onChange={handlePasswordChange}
          placeholder="Enter password here"
          className={style['modal-input']}
        />
      ) : (
        <TextareaInput
          label="Please let us know what made you deactivate your account. This will help us further improve our platform"
          cols={20}
          rows={3}
          value={feedback}
          onChange={handleFeedbackChange}
          placeholder="Write your response here..."
          className={style['modal-input']}
        />
      )}

      {step === 0 ? (
        <DefaultButton
          variant="contained"
          bgColor="#FF5A5A"
          style={{ margin: 'auto', marginTop: 40, width: 296, height: 36 }}
          onClick={handleSubmit}
        >
          Deactivate Account
        </DefaultButton>
      ) : (
        <IonRow style={{ marginTop: 40 }}>
          <DefaultButton
            variant="contained"
            btnColor="secondary-gradient"
            textType="gradient"
            style={{ margin: 'auto', width: 212, height: 36 }}
            onClick={handleClose}
          >
            Close
          </DefaultButton>

          <DefaultButton
            variant="contained"
            btnColor="primary-gradient"
            style={{ margin: 'auto', width: 212, height: 36 }}
            onClick={handleSubmitFeedback}
          >
            Submit & Close
          </DefaultButton>
        </IonRow>
      )}
    </Modal>
  );
};

export default DeactivateModal;
