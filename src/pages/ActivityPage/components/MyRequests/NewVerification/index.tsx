import React, { useState, useEffect } from 'react';
import { IonRow, IonCol, IonButton, IonModal } from '@ionic/react';
import styled from 'styled-components';

import TimeLine from './TimeLine';
import { VerificationService } from 'src/services/verification.service';
import { ProfileService } from 'src/services/profile.service';
import UsersView from './steps/step2';
import CredentialView from './steps/step1';
import ReviewPage from './steps/step3';
import style from './style.module.scss';
import shield from '../../../../../assets/icon/shield.png';

interface Props {
  session: ISessionItem;
  targetUser: ISessionItem;
  onClose: () => void;
  selectedCredential?: string;
  sendRequest: (
    dids: string[],
    credentials: VerificationData[],
    msg: string
  ) => void;
}

export const NewVerificationModal = styled(IonModal)`
  --border-radius: 16px;
  --width: 1100px;
  --height: 678px;
  :host(.modal-card) ion-header ion-toolbar:first-of-type {
    padding: 0px;
  }
`;

const NewVerificationContent: React.FC<Props> = ({
  session,
  onClose,
  targetUser,
  sendRequest,
  selectedCredential
}: Props) => {
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<VerificationData[]>([]);
  const [credentials, setCredentials] = useState<VerificationData[]>([]);
  const [selectedDids, setSelectedDids] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (session && session.did) {
        setLoading(true);
        let profile = await ProfileService.getFullProfile(session.did, session);
        if (profile) {
          const vService = new VerificationService();
          const cates = vService.retrieveUsersVerificationCategories(
            profile,
            session
          );
          setCategories(cates);
        }
        setLoading(false);
      }
    })();
  }, [session]);

  const renderRightContents = () => {
    if (categories.length === 0) {
      return <p>You have no credentials</p>;
    }
    if (step === 1) {
      return (
        <CredentialView
          categories={categories}
          credentials={credentials}
          selectedCredential={selectedCredential}
          setCredentials={setCredentials}
          onNext={() => setStep(2)}
        />
      );
    }
    if (step === 2) {
      return (
        <UsersView
          onPrev={() => setStep(1)}
          onNext={() => setStep(3)}
          session={session}
          selectedDids={selectedDids}
          updateSelectedUserDids={setSelectedDids}
        />
      );
    }
    if (step === 3) {
      return (
        <ReviewPage
          selectedDids={selectedDids}
          credentials={credentials}
          session={session}
          onPrev={() => setStep(2)}
          sendRequest={(msg: string) =>
            sendRequest(selectedDids, credentials, msg)
          }
        />
      );
    }
  };

  return (
    <div className={style['verification-modal']}>
      <IonRow>
        <IonCol sizeXs="12" sizeSm="5" className={style['col-left']}>
          <img alt="shield" src={shield} />
          <h2>New verification request</h2>
          <p>
            Get your credentials verified by experts, friends or individuals
          </p>
          <div className={style['verification-left-bottom']}>
            <TimeLine step={step} />
            <IonButton
              onClick={onClose}
              className={style['verification-quit-button']}
            >
              Close
            </IonButton>
          </div>
        </IonCol>
        <IonCol
          className={style['verification-col-right']}
          sizeXs="12"
          sizeSm="7"
        >
          {loading && <p>Loading...</p>}
          {!loading && renderRightContents()}
        </IonCol>
      </IonRow>
    </div>
  );
};

export default NewVerificationContent;
