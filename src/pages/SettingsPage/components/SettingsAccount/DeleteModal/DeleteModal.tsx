import React, { useCallback, useState } from 'react';
import Modal from 'src/elements-v2/Modal';
import DeleteModalContent from './DeleteModalContent';
import FeedbackModalContent from './FeedbackModalContent';

interface Props {
  isAlertOpen: boolean;
  setIsAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteModal: React.FC<Props> = ({ isAlertOpen, setIsAlertOpen }) => {
  const [step, setStep] = useState(0);

  const handleClose = useCallback(() => {
    setIsAlertOpen(false);
    setTimeout(() => {
      setStep(0);
    }, 500);
  }, [setIsAlertOpen]);

  return (
    <Modal
      title=""
      isOpen={isAlertOpen}
      onClose={handleClose}
      autoWidth
      noButton
    >
      {step === 0 ? (
        <DeleteModalContent nextStep={() => setStep(1)} />
      ) : (
        <FeedbackModalContent closeModal={handleClose} />
      )}
    </Modal>
  );
};

export default DeleteModal;
