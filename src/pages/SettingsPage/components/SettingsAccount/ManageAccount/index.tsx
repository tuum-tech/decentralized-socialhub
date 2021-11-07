import React, { useState } from 'react';
import { IonItem, IonText, IonButton } from '@ionic/react';
import styled from 'styled-components';

import style from '../style.module.scss';
import DeleteAccountContent, { DeleteAccountModal } from './DeleteModal';
import FeedbackModalContent, { FeedbackModal } from './FeedbackModal';

export const ButtonDisabled = styled(IonButton)`
  width: 273px;
  height: 49px;

  background: #f0f0f0 0% 0% no-repeat padding-box;
  --background: #f0f0f0;
  border-radius: 8px;
  opacity: 1;

  text-align: center;
  font: normal normal 600 18px/21px 'Open Sans';
  text-transform: none;
  letter-spacing: 0px;
  color: #d0d0d0;
`;

const DeleteButton = styled(IonButton)`
  width: 273px;
  height: 49px;
  --background: white;
  border-radius: 8px;
  text-align: center;
  font: normal normal 600 18px/21px 'Open Sans';
  text-transform: none;
  letter-spacing: 0px;
  color: red;
`;

interface Props {
  userSession: ISessionItem;
}

const ManageAccount: React.FC<Props> = ({ userSession }) => {
  const [modalType, setModalType] = useState(0);

  return (
    <>
      <IonItem className={style['section']}>
        <div className={style['section-data']}>
          <IonText className={style['section-title']}>
            Deactivate your account
          </IonText>
          <IonText className={style['section-description']}>
            Begin the process of deactivating your Profile account. Both your
            private and public pages will no longer be accessible by anyone
            however, since the data is stored on the vault of your choosing, you
            own your data so you can always access your data by connecting to
            your vault manually.
          </IonText>
          <br></br>
          <ButtonDisabled className={style['section-button']}>
            Deactivate
          </ButtonDisabled>
          <IonText className={style['coming-soon']}>Coming Soon!</IonText>
        </div>
      </IonItem>
      <IonItem lines="none" className={style['section']}>
        <div className={style['section-data']}>
          <IonText className={style['section-title']}>
            Delete your account
          </IonText>
          <IonText className={style['section-description']}>
            This will wipe out the vault data from your own user vault. Note
            that the data stored on Tuum Tech vault will not be removed with
            this action. Information stored on your user vault such as your
            about section, education and experience will be deleted. You can
            always create a new account with the same DID at a later time but
            you will have to enter your personal data again during that time.
          </IonText>
          <br></br>
          <DeleteButton
            className={style['section-button']}
            onClick={() => {
              setModalType(1);
            }}
          >
            Delete Account
          </DeleteButton>

          <DeleteAccountModal isOpen={modalType === 1} backdropDismiss={false}>
            <DeleteAccountContent
              session={userSession}
              showFeedbackModal={() => setModalType(2)}
              onClose={() => setModalType(0)}
            />
          </DeleteAccountModal>
          <FeedbackModal isOpen={modalType === 2} backdropDismiss={false}>
            <FeedbackModalContent
              session={userSession}
              closeModal={() => setModalType(0)}
            />
          </FeedbackModal>
        </div>
      </IonItem>
    </>
  );
};

export default ManageAccount;
