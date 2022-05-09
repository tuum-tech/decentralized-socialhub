import React, { useState } from 'react';

import { ErrorTxt } from 'src/elements/texts';
import TextInput from 'src/elements/inputs/TextInput';
import { ThemeButton } from 'src/elements/buttons';

import { UserService } from 'src/services/user.service';

import { DidService } from 'src/services/did.service.new';
import { SyncService } from 'src/services/sync.service';

interface Props {
  did: string;
  setLoading: (txt: string) => void;
  loading: string;
  afterSuccess: (session: ISessionItem) => void;
}

const LoginWithPWD: React.FC<Props> = ({
  did,
  afterSuccess,
  setLoading,
  loading
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onLoginWithPWD = async () => {
    if (!password || password === '') {
      setError('Enter your password');
      return;
    }

    setLoading('Logging in with password');

    let userService = new UserService(await DidService.getInstance());

    const res = await userService.UnLockWithDIDAndPwd(did, password);
    if (res) {
      await SyncService.TempInitializeSignedUsers(res);

      const session = await userService.RemovePassword(res);

      afterSuccess(session);
    }

    setLoading('');
  };

  return (
    <>
      <p style={{ marginTop: '20px' }}>
        This is an old version of authentication workflow. <br /> Next time,
        you'll be able to loging without password.
      </p>
      <TextInput
        value={password}
        type="password"
        label="Password"
        onChange={n => {
          setError('');
          setPassword(n);
        }}
        placeholder="Enter your password"
        hasError={error !== '' && password === ''}
      />
      <ThemeButton
        style={{ marginTop: '20px' }}
        text="Sign in"
        onClick={async () => {
          if (loading === '') {
            await onLoginWithPWD();
          }
        }}
      />
      {error !== '' && <ErrorTxt className="mt-3">{error}</ErrorTxt>}
    </>
  );
};

export default LoginWithPWD;
