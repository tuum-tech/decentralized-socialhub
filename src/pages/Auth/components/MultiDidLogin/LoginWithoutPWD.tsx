import React from 'react';

import { ThemeButton } from 'src/elements/buttons';
import { UserService } from 'src/services/user.service';
import { DidService } from 'src/services/did.service.new';
import { SyncService } from 'src/services/sync.service';

interface Props {
  afterSuccess: (session: ISessionItem) => void;
  setLoading: (txt: string) => void;
  loading: string;
  did: string;
}

const LoginWithoutPWD: React.FC<Props> = ({
  did,
  afterSuccess,
  loading,
  setLoading
}) => {
  const onLoginWithoutPWD = async () => {
    setLoading('Logging in without password');

    let userService = new UserService(await DidService.getInstance());

    const res = await userService.UnLockWithDIDAndPwd(did, '');
    if (res) {
      await SyncService.TempInitializeSignedUsers(res);

      afterSuccess(res);
    }

    setLoading('');
  };

  return (
    <ThemeButton
      text="Sign in to profile without password"
      style={{ marginTop: '20px' }}
      onClick={async () => {
        if (loading === '') {
          await onLoginWithoutPWD();
        }
      }}
    />
  );
};

export default LoginWithoutPWD;
