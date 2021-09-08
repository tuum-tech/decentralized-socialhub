import React, { useEffect, useState } from 'react';

import {
  OnBoardLayout,
  OnBoardLayoutLeft,
  OnBoardLayoutLeftContent,
  OnBoardLayoutLeftContentTitle,
  OnBoardLayoutLeftContentDescription,
  OnBoardLayoutLogo,
  OnBoardLayoutRight,
  OnBoardLayoutRightContent,
  OnBoardLayoutRightContentTitle,
  WavingHandImg
} from 'src/components/layouts/OnBoardLayout';
import LoadingIndicator from 'src/elements/LoadingIndicator';
import { SearchService } from 'src/services/search.service';
import { getItemsFromData } from 'src/utils/script';
import { ButtonWithLogo } from 'src/elements/buttons';
import { Text16, ErrorTxt } from 'src/elements/texts';
import whitelogo from 'src/assets/logo/whitetextlogo.png';
import eye from 'src/assets/icon/eye.png';
import TextInput from 'src/elements/inputs/TextInput';
import { UserService } from 'src/services/user.service';

import FieldDivider from '../FieldDivider';
import SelectUsers from './SelectUsers';
import { DidService } from 'src/services/did.service.new';
import FooterLinks, {
  Footer
} from 'src/components/layouts/OnBoardLayout/FooterLinks';
import styled from 'styled-components';
import { IonButton, IonCol, IonGrid, IonModal, IonRow } from '@ionic/react';
import style from './style.module.scss';

interface Props {
  changeMode: () => void;
  afterSuccess: (session: ISessionItem) => void;
  dids: Array<string>;
  removeUser: (did: string) => void;
}

const ClearStorageModal = styled(IonModal)`
  --border-radius: 16px;
  --min-height: 200px;
  --height: 100%;
  --width: 100%;
  height: 100% !important;
  width: 100% !important;
  --background: transparent !important;
  --box-shadow: none !important;
`;
const NoPaddingGrid = styled(IonGrid)`
  padding: 0 !important;
  overflow-y: auto !important;
`;

const DefaultButton = styled(IonButton)`
  border-radius: 6px;
  background-color: #4c6fff;
  min-width: 80px;
  text-align: center;
  font: 'SF Pro Display';
  text-transform: none;
  letter-spacing: 0px;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  --background: #4c6fff 0% 0% no-repeat padding-box;
  --background-activated: #4c6fff 0% 0% no-repeat padding-box;
  margin-top: 1em;

  &:hover {
    --background-hover: #4c6f00 0% 0% no-repeat padding-box;
  }
`;

const SecondaryButton = styled(DefaultButton)`
  background-color: #fffff;
  --background: #fff 0% 0% no-repeat padding-box;
  --background-activated: #fff 0% 0% no-repeat padding-box;
  color: #000;
  &:hover {
    --background-hover: #e3e3e3 0% 0% no-repeat padding-box;
  }
`;

const MultiDidPasswordLogin: React.FC<Props> = ({
  dids,
  changeMode,
  removeUser,
  afterSuccess
}) => {
  const [did, setDid] = useState(dids[0]);
  const [localUsers, setLocalUsers] = useState([]);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    (async () => {
      const searchServiceLocal = await SearchService.getSearchServiceAppOnlyInstance();
      let getUserRes: any = await searchServiceLocal.getUsersByDIDs(
        dids,
        200,
        0
      );
      const users = getItemsFromData(getUserRes, 'get_users_by_dids');
      if (users.length > 0) {
        setLocalUsers(users);
        setLoading('');
      }
    })();
  }, [dids]);

  const onLoginButtonClick = async () => {
    if (!password || password === '') {
      setError('Enter your password');
      return;
    }
    setLoading('Signing now...');

    let userService = new UserService(await DidService.getInstance());

    const res = await userService.UnLockWithDIDAndPwd(did, password);
    if (res) {
      afterSuccess(res);
      return;
    }

    setLoading('');
  };

  return (
    <OnBoardLayout>
      {loading !== '' && <LoadingIndicator loadingText={loading} />}
      <OnBoardLayoutLeft>
        <OnBoardLayoutLogo src={whitelogo} />
        <OnBoardLayoutLeftContent>
          <WavingHandImg src={eye} />
          <OnBoardLayoutLeftContentTitle className="mt-18px">
            We have seen your accounts before.
          </OnBoardLayoutLeftContentTitle>
          <OnBoardLayoutLeftContentDescription className="mt-25px">
            You can select and login using the password you set
          </OnBoardLayoutLeftContentDescription>
          <Footer>
            <FooterLinks></FooterLinks>
          </Footer>
        </OnBoardLayoutLeftContent>
      </OnBoardLayoutLeft>
      <OnBoardLayoutRight>
        <OnBoardLayoutRightContent>
          <OnBoardLayoutRightContentTitle>
            Sign in using the previous logged info
          </OnBoardLayoutRightContentTitle>
          <Text16>Decentralized Identity (DID):</Text16>
          {localUsers && localUsers.length > 0 && (
            <SelectUsers
              users={localUsers}
              selectDID={(did: string) => setDid(did)}
              removeUser={removeUser}
              openModal={() => {
                setShowTutorial(true);
              }}
            />
          )}
          <TextInput
            value={password}
            type="password"
            label="Password"
            onChange={n => {
              setError('');
              setPassword(n);
            }}
            onHitEnter={async () => {
              await onLoginButtonClick();
            }}
            placeholder="Enter your password"
            hasError={error !== '' && password === ''}
          />
          {error !== '' && <ErrorTxt className="mt-3">{error}</ErrorTxt>}
          <ButtonWithLogo
            mode="dark"
            mt={20}
            text="Sign in to profile"
            onClick={async () => {
              await onLoginButtonClick();
            }}
          />

          <FieldDivider mt={80} />
          <ButtonWithLogo
            text="Create new profile"
            onClick={changeMode}
            mt={42}
          />
        </OnBoardLayoutRightContent>
      </OnBoardLayoutRight>

      <ClearStorageModal
        isOpen={showTutorial}
        backdropDismiss={false}
        cssClass={style['ClearStorageModal']}
      >
        <div className={style['tutorial-component']}>
          <NoPaddingGrid>
            <IonRow>
              <IonCol size="12">
                <h2>Attention</h2>
                <p>
                  This will remove all your past login credentials from the
                  site. You will not lose any data in the process. You will have
                  to relogin using the mnmonics. Do you still want to proceed?
                </p>
                <div className={style['tutorial-left-bottom']}>
                  <DefaultButton
                    onClick={() => {
                      setShowTutorial(false);
                      setLoading('Clearing browser data');
                      window.localStorage.clear();
                      window.location.reload();
                    }}
                  >
                    Yes
                  </DefaultButton>
                  <SecondaryButton
                    onClick={() => {
                      setShowTutorial(false);
                    }}
                  >
                    No
                  </SecondaryButton>
                </div>
              </IonCol>
            </IonRow>
          </NoPaddingGrid>
        </div>
      </ClearStorageModal>
    </OnBoardLayout>
  );
};

export default MultiDidPasswordLogin;
