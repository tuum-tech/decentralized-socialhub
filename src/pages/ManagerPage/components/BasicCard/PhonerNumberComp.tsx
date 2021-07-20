import React, { useState } from 'react';
import { IonRow, IonCol, IonLabel } from '@ionic/react';
import styled from 'styled-components';

import { isValidPhoneNumber } from 'react-phone-number-input';

import SmallTextInput from 'src/elements/inputs/SmallTextInput';
import { SmallLightButton } from 'src/elements/buttons';
import { Text12, ErrorTxt as ErrorText } from 'src/elements/texts';

import { createPhoneUser, updatePhoneNumber, verifyCode } from './fetchapi';

const ActionBtnCol = styled(IonCol)`
  margin: 0 0 0 auto;
`;

const Container = styled(IonRow)`
  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
  }
`;

const ErrorTxt = styled(ErrorText)`
  text-align: left !important;
`;

interface IProps {
  sessionItem: ISessionItem;
  updateFunc: any;
}

const PhonerNumberComp: React.FC<IProps> = ({
  sessionItem,
  updateFunc
}: IProps) => {
  const [loading, setLoading] = useState(0);
  const alreadyHasPhone = sessionItem.loginCred!.phone !== '';
  const [phone, setPhone] = useState(sessionItem.loginCred!.phone || '');
  const [code, setCode] = useState('');
  const [showVerifyInput, setShowVerifyInput] = useState(false);
  const [error, setError] = useState('');

  const sendBtnDisabled = () => {
    if (loading) return true;
    if (phone === '') return true;

    return !isValidPhoneNumber(phone);
  };

  return (
    <>
      <Container class="ion-justify-content-start">
        <IonCol size="5">
          <SmallTextInput
            disabled={sessionItem.tutorialStep !== 4 || loading > 0}
            label="Phone Number(+79149625769)"
            name="phoneNumber"
            value={phone}
            onChange={(evt: any) => {
              setPhone(evt.target.value);
              setError('');
            }}
          />
          {phone !== '' && !isValidPhoneNumber(phone) && (
            <ErrorTxt>Invalid Phone Number</ErrorTxt>
          )}
          {error !== '' && <ErrorTxt>{error}</ErrorTxt>}
          {alreadyHasPhone && (
            <Text12>
              If you want to update phone number, please type phone number and
              click "Send Verification" button.
            </Text12>
          )}
        </IonCol>
        <ActionBtnCol size="auto">
          <SmallLightButton
            disabled={sendBtnDisabled()}
            onClick={async () => {
              if (phone === sessionItem.loginCred?.phone) {
                setError('Same Phone Number');
                return;
              }
              setLoading(1);

              const updatePhoneNumberRes = await updatePhoneNumber(
                sessionItem.did,
                sessionItem.loginCred?.email || '',
                phone
              );

              setShowVerifyInput(true);
              setLoading(0);
            }}
          >
            Send Verification
          </SmallLightButton>
        </ActionBtnCol>
      </Container>

      {showVerifyInput && (
        <Container class="ion-justify-content-start">
          <IonCol size="5">
            <SmallTextInput
              placeholder="Type your SMS code"
              name="sms"
              value={code}
              onChange={(evt: any) => {
                setCode(evt.target.value);
              }}
            />
          </IonCol>
          <ActionBtnCol size="auto">
            <SmallLightButton
              disabled={code === '' || loading > 0}
              onClick={async () => {
                setLoading(2);
                const verifyCodeRes = (await verifyCode(
                  code
                )) as IVerifyCodeResponse;

                if (
                  verifyCodeRes &&
                  verifyCodeRes.data &&
                  verifyCodeRes.data.return_code === 'CODE_CONFIRMED'
                ) {
                  let newSession = {
                    ...sessionItem,
                    loginCred: {
                      ...sessionItem.loginCred,
                      phone
                    }
                  };

                  await updateFunc(newSession);
                  setError('');
                  setShowVerifyInput(false);
                } else {
                  setError('Invalid SMS code');
                }
                setLoading(0);
              }}
            >
              Verify your SMS code
            </SmallLightButton>
          </ActionBtnCol>
        </Container>
      )}
    </>
  );
};

export default PhonerNumberComp;
