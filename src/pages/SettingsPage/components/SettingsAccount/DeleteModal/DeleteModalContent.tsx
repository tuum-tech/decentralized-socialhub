import React, { useCallback, useState } from 'react';
import { IonRow } from '@ionic/react';
import TextInput from 'src/elements/inputs/TextInput';
import { DefaultButton } from 'src/elements-v2/buttons';
import CutIcon from 'src/assets/icon/cut.svg';
import { UserService } from 'src/services/user.service';
import { DidService } from 'src/services/did.service.new';
import useSession from 'src/hooks/useSession';
import { ErrorTxt, ModalTitle } from './common';
import style from './style.module.scss';

interface Props {
  nextStep: () => void;
}

const DeleteModalContent: React.FC<Props> = ({ nextStep }) => {
  const { session } = useSession();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePasswordChange = useCallback(v => {
    setPassword(v);
    setError('');
  }, []);

  const handleSubmit = useCallback(() => {
    (async () => {
      setLoading(true);

      let userService = new UserService(await DidService.getInstance());
      const isPwdValid = await userService.validateWithPwd(
        session.did,
        password
      );
      if (isPwdValid) {
        await UserService.deleteUser(session);
      } else {
        setError('Invalid Password');
      }

      setLoading(false);
      if (isPwdValid) {
        nextStep();
      }
    })();
  }, [nextStep, password, session]);

  return (
    <>
      <IonRow className="ion-justify-content-center">
        <img src={CutIcon} alt="cut-icon" />
      </IonRow>
      <ModalTitle>Delete your account</ModalTitle>

      <TextInput
        label="Please enter your account password before deactivation."
        value={password}
        onChange={handlePasswordChange}
        placeholder="Enter password here"
        className={style['modal-input']}
      />
      {error && <ErrorTxt>{error}</ErrorTxt>}

      <DefaultButton
        variant="contained"
        bgColor="#FF5A5A"
        style={{ margin: 'auto', marginTop: 50, width: 296, height: 36 }}
        loading={loading}
        onClick={handleSubmit}
      >
        Delete Account
      </DefaultButton>
    </>
  );
};

export default DeleteModalContent;
