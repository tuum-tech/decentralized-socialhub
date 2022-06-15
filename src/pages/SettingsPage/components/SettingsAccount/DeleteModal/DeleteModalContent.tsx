import React, { useCallback, useState } from 'react';
import { IonRow } from '@ionic/react';
import { DefaultButton } from 'src/elements-v2/buttons';
import CutIcon from 'src/assets/icon/cut.svg';
import { UserService } from 'src/services/user.service';
import { DidService } from 'src/services/did.service.new';
import useSession from 'src/hooks/useSession';
import { ModalTitle } from './common';

interface Props {
  nextStep: () => void;
}

const DeleteModalContent: React.FC<Props> = ({ nextStep }) => {
  const { session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(() => {
    (async () => {
      setLoading(true);

      let userService = new UserService(await DidService.getInstance());
      const isPwdValid = await userService.validateWithPwd(session.did, '');
      if (isPwdValid) {
        await UserService.deleteUser(session);
      }

      setLoading(false);
      if (isPwdValid) {
        nextStep();
      }
    })();
  }, [nextStep, session]);

  return (
    <>
      <IonRow className="ion-justify-content-center">
        <img src={CutIcon} alt="cut-icon" />
      </IonRow>
      <ModalTitle>Delete your account</ModalTitle>

      <DefaultButton
        variant="contained"
        bgColor="#FF5A5A"
        style={{ margin: 'auto', marginTop: 50, width: 296, height: 36 }}
        loading={loading}
        onClick={handleSubmit}
      >
        Yes. Delete my Account forever!
      </DefaultButton>
    </>
  );
};

export default DeleteModalContent;
