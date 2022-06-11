import React, { useEffect, useState } from 'react';

import {
  OnBoardLayout,
  OnBoardLayoutLeft,
  OnBoardLayoutLeftContent,
  OnBoardLayoutLogo,
  OnBoardLayoutRight,
  OnBoardLayoutRightContent,
  OnBoardLayoutRightContentTitle,
  WavingHandImg
} from 'src/components/layouts/OnBoardLayout';
import LoadingIndicator from 'src/elements/LoadingIndicator';
import { SearchService } from 'src/services/search.service';
import { getItemsFromData } from 'src/utils/script';
import { ThemeButton } from 'src/elements/buttons';
import { Text16, Title40, Text18 } from 'src/elements/texts';
import LoginWithPWD from './LoginWithPWD';
import LoginWithoutPWD from './LoginWithoutPWD';

import eye from 'src/assets/icon/eye.png';
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

const MultiDidLogin: React.FC<Props> = ({
  dids,
  changeMode,
  removeUser,
  afterSuccess
}) => {
  const [did, setDid] = useState(dids[0]);
  const [localUsers, setLocalUsers] = useState([]);
  const [loading, setLoading] = useState('');
  const [showTutorial, setShowTutorial] = useState(false);

  const [loginType, setLoginType] = useState(0); // 1: loign with pwd, 2: loign without pwd

  useEffect(() => {
    (async () => {
      const searchServiceLocal = await SearchService.getSearchServiceAppOnlyInstance();
      let getUserRes: any = await searchServiceLocal.getUsersByDIDs(
        dids,
        200,
        0
      );
      if (getUserRes.isSuccess === true) {
        for (let user in getUserRes.response.get_users_by_dids.items) {
          if (
            getUserRes.response.get_users_by_dids.items[user].isEssentialUser
          ) {
            delete getUserRes.response.get_users_by_dids.items[user];
          }
        }
      }
      const users = getItemsFromData(getUserRes, 'get_users_by_dids');
      if (users.length > 0) {
        setLocalUsers(users);
        await setLogingTypeAfterDidChanged(users[0].did);
        setLoading('');
      }
    })();
  }, [dids]);

  const setLogingTypeAfterDidChanged = async (newDid: string) => {
    if (newDid && newDid !== '') {
      let uService = new UserService(await DidService.getInstance());

      const canLoginWithPwd = await uService.validateWithPwd(newDid, '');
      console.log('===>canLoginWithPwd', newDid, canLoginWithPwd);

      if (canLoginWithPwd) {
        setLoginType(2);
      } else {
        setLoginType(1);
      }
    }
  };

  return (
    <OnBoardLayout>
      {loading !== '' && <LoadingIndicator loadingText={loading} />}
      <OnBoardLayoutLeft>
        <OnBoardLayoutLogo />
        <OnBoardLayoutLeftContent>
          <WavingHandImg src={eye} />
          <Title40 className="mt-18px">
            We have seen your accounts before.
          </Title40>
          <Text18 className="mt-25px">You can select and login</Text18>
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
              selectDID={async (newDid: string) => {
                setDid(newDid);
                await setLogingTypeAfterDidChanged(newDid);
              }}
              removeUser={removeUser}
              openModal={() => {
                setShowTutorial(true);
              }}
            />
          )}
          {loginType === 1 && (
            <LoginWithPWD
              did={did}
              loading={loading}
              setLoading={setLoading}
              afterSuccess={afterSuccess}
            />
          )}
          {loginType === 2 && (
            <LoginWithoutPWD
              did={did}
              loading={loading}
              setLoading={setLoading}
              afterSuccess={afterSuccess}
            />
          )}

          <FieldDivider mt={80} />
          <ThemeButton
            style={{ marginTop: '20px' }}
            text="Create new profile"
            onClick={changeMode}
          />

          <Footer>
            <FooterLinks />
          </Footer>
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

export default MultiDidLogin;
