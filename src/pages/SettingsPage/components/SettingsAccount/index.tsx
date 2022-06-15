import React, { useState } from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonCardContent,
  IonText,
  IonButton
} from '@ionic/react';
import styled from 'styled-components';
import clsx from 'clsx';
import DeleteModal from './DeleteModal';
import style from './style.module.scss';

const ButtonDisabled = styled(IonButton)`
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

const SettingsAccount: React.FC = () => {
  const [loading, setLoading] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  return (
    <div className={style['settingsaccount']}>
      <IonCard className={style['tab-card']}>
        <IonCardContent>
          <IonCardHeader>
            <IonCardTitle className={style['card-title']}>
              Account Settings
            </IonCardTitle>
          </IonCardHeader>
          <IonItem className={style['section']}>
            <div className={style['section-data']}>
              <IonText className={style['section-title']}>
                Change language
              </IonText>
              <IonText className={style['section-description']}>
                Choose your app language
              </IonText>
            </div>
            <div className={style['section-action']}>
              <span className={style['section-action-inner']}>
                English {'>'}
              </span>
            </div>
          </IonItem>
          <IonItem className={style['section']}>
            <div className={style['section-data']}>
              <IonText className={style['section-title']}>
                Download your data
              </IonText>
              <IonText className={style['section-description']}>
                We are committed to reach the goal of privacy, all your data is
                owned by you and stored on the vault of your choosing. You can
                request this data at anytime.
              </IonText>
              <br></br>
              <div className="d-flex align-items-center">
                <ButtonDisabled className={style['section-button']}>
                  Download Here
                </ButtonDisabled>
                <IonText className={style['coming-soon']}>Coming Soon!</IonText>
              </div>
            </div>
          </IonItem>
          <IonItem className={style['section']}>
            <div className={style['section-data']}>
              <IonText className={style['section-title']}>
                Deactivate your account
              </IonText>
              <IonText className={style['section-description']}>
                Begin the process of deactivating your Profile account. Both
                your private and public pages will no longer be accessible by
                anyone however, since the data is stored on the vault of your
                choosing, you own your data so you can always access your data
                by connecting to your vault manually.
              </IonText>
              <br></br>
              <div className="d-flex align-items-center">
                <ButtonDisabled className={style['section-button']}>
                  Deactivate
                </ButtonDisabled>
                <IonText className={style['coming-soon']}>Coming Soon!</IonText>
              </div>
            </div>
          </IonItem>
          <IonItem lines="none" className={style['section']}>
            <div className={style['section-data']}>
              <IonText
                className={clsx(style['section-title'], style['delete'])}
              >
                Delete your account
              </IonText>
              <IonText className={style['section-description']}>
                This will wipe out the vault data from your own user vault. Note
                that the data stored on Tuum Tech vault will not be removed with
                this action. Information stored on your user vault such as your
                about section, education and experience will be deleted. You can
                always create a new account with the same DID at a later time
                but you will have to enter your personal data again during that
                time.
              </IonText>
              <br></br>
              <DeleteButton
                className={clsx(
                  style['section-button'],
                  style['delete-button']
                )}
                disabled={loading !== ''}
                onClick={async () => {
                  setIsAlertOpen(true);
                }}
              >
                {loading === 'Deleting Account'
                  ? 'Deleting Now...'
                  : 'Delete Account'}
              </DeleteButton>
            </div>
          </IonItem>
        </IonCardContent>
      </IonCard>
      <DeleteModal isAlertOpen={isAlertOpen} setIsAlertOpen={setIsAlertOpen} />
    </div>
  );
};

export default SettingsAccount;
