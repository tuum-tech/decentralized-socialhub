import React, { useState } from 'react';
import styled from 'styled-components';
import { IonModal, IonInput } from '@ionic/react';

import { UserService } from 'src/services/user.service';
import { DidService } from 'src/services/did.service.new';
import CloseIcon from 'src/elements/svg/Close';

export const DeleteAccountModal = styled(IonModal)`
  --border-radius: 16px;
  --width: 645px;
  --height: 400px;
  :host(.modal-card) ion-header ion-toolbar:first-of-type {
    padding: 0px;
  }
`;

export const ModalTitle = styled.p`
  margin-top: 11px;
  font-style: normal;
  font-weight: bold;
  font-size: 36px;
  line-height: 136.02%;
  text-align: center;
  color: #101225;
`;

export const ModalIntro = styled.p`
  margin-top: 20px;
  font-size: 14px;
  line-height: 160%;
  text-align: center;
  color: #425466;

  max-width: 352px;
`;

export const ModalButton = styled.button`
  width: 296px;
  height: 36px;
  background: #ff5a5a;
  border-radius: 6px;

  font-weight: 600;
  font-size: 12px;
  line-height: 12px;
  color: #ffffff;
`;

export const CloseButton = styled.div`
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
`;

export const ErrorTxt = styled.p`
  font-size: 13px;
  line-height: 15px;
  text-align: center;
  color: red;
`;

const Conatiner = styled.div`
  padding: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .star {
    font-weight: bold;
    font-size: 40px;
    line-height: 48px;
    text-align: center;
    letter-spacing: 12px;
    color: #27272e;
  }

  input {
    box-shadow: 0px 1px 2px rgba(50, 50, 71, 0.08),
      0px 0px 1px rgba(50, 50, 71, 0.2);
    border-radius: 6px;
    background: #edf2f7 !important;
    padding: 13px 16px !important;
    max-width: 420px !important;

    font-weight: 500;
    font-size: 13px !important;
    line-height: 15px !important;
    color: #c7cdd2;

    margin: 14px auto 5px;
  }
`;

interface Props {
  session: ISessionItem;
  showFeedbackModal: () => void;
  onClose: () => void;
}

const DeleteAccountContent = ({
  session,
  showFeedbackModal,
  onClose
}: Props) => {
  const [pwd, setPwd] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  return (
    <Conatiner>
      <CloseButton onClick={onClose}>
        <CloseIcon />
      </CloseButton>
      <p className="star">***</p>
      <ModalTitle>Delete your account</ModalTitle>
      <ModalIntro>
        Please enter your account password before deactivation.
      </ModalIntro>
      <IonInput
        value={pwd}
        onIonChange={e => {
          e.preventDefault();
          setPwd(e.detail.value!);
        }}
        placeholder="Enter your password"
        type="password"
      />
      {error !== '' && <ErrorTxt>{error}</ErrorTxt>}

      <ModalButton
        style={{ marginTop: '35px' }}
        disabled={pwd === '' || loading}
        className="deleteBtn"
        onClick={async () => {
          setLoading(true);

          let userService = new UserService(await DidService.getInstance());
          const isPwdValid = await userService.validateWithPwd(session, pwd);
          if (isPwdValid) {
            await UserService.deleteUser(session);
          } else {
            setError('Invalid Password');
          }

          setLoading(false);
          if (isPwdValid) {
            showFeedbackModal();
          }
        }}
      >
        {loading ? 'Deleting Account Now' : 'Delete Account'}
      </ModalButton>
    </Conatiner>
  );
};

export default DeleteAccountContent;
