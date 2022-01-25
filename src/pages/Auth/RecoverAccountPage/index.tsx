import { StaticContext, RouteComponentProps } from 'react-router';
import { useHistory, Link } from 'react-router-dom';

import { UserService } from 'src/services/user.service';
import { DidService } from 'src/services/did.service.new';
import { alertError } from 'src/utils/notify';
import {
  OnBoardLayout,
  OnBoardLayoutRight,
  OnBoardLayoutLeft,
  OnBoardLayoutLeftContent,
  OnBoardLayoutLogo,
  WavingHandImg
} from 'src/components/layouts/OnBoardLayout';
import LoadingIndicator from 'src/elements/LoadingIndicator';
import DidSignForm from '../components/DidSign/DidSignForm';
import { Title40, Text18, Text12 } from 'src/elements/texts';
import PassPhraseHelp from '../components/DidSign/PassPhraseHelp';
import FooterLinks, {
  Footer
} from 'src/components/layouts/OnBoardLayout/FooterLinks';
import wavinghand from 'src/assets/icon/wavinghand.png';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import style from './style.module.scss';
import { UserType, LocationState } from './types';
import { DIDURL } from '@elastosfoundation/did-js-sdk/';
import { HiveService } from 'src/services/hive.service';

const CreateButton = styled(Link)`
  background: #313049;
  border-radius: 10px;
  padding: 14px 25px;
  color: white;
  display: block;
  width: 222px;
  margin-top: 14px;
  text-align: center;

  p {
    line-height: 12px !important;
  }
`;

const RecoverAccountPage: React.FC<RouteComponentProps<
  {},
  StaticContext,
  LocationState
>> = props => {
  const history = useHistory();
  const [showHelp, setShowHelp] = useState(false);
  const [error, setError] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      !user &&
      props.location.state &&
      props.location.state.user &&
      props.location.state.user.name
    ) {
      setUser(props.location.state.user);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <OnBoardLayout className={style['did-signin']}>
      {loading && <LoadingIndicator loadingText="Signing Now..." />}
      {showHelp && <PassPhraseHelp close={() => setShowHelp(false)} />}
      <OnBoardLayoutLeft>
        <OnBoardLayoutLogo />
        <OnBoardLayoutLeftContent>
          <WavingHandImg src={wavinghand} />
          <Title40 className="mt-18px">Recover Account</Title40>
          <Text18 className="mt-25px">
            When recovering your account, entering your seed phrase is required,
            so please do so with extreme caution. Entering mnemonics regularly
            is considered bad practice and should only be done as a last resort,
            as you're exposing your Elastos DID security words to potential
            hackers and predators on the web.
            <br />
            <br />
            If you must proceed, make sure you're in a private place, on a
            secure network, and not exposed to anyone. Remember to store your
            secret words in a safe location and never save them on a digital
            device.
          </Text18>

          <Text12 style={{ marginTop: '50px' }}>Start Over</Text12>
          <CreateButton to="/create-profile">Create a new Profile</CreateButton>

          <Footer>
            <FooterLinks></FooterLinks>
          </Footer>
        </OnBoardLayoutLeftContent>
      </OnBoardLayoutLeft>
      <OnBoardLayoutRight>
        <DidSignForm
          showModal={() => setShowHelp(true)}
          loadDidFunction={async (mnemonic: string, password: string) => {
            let didService = await DidService.getInstance();
            didService.loadDid(mnemonic, password);
          }}
          error={error}
          setError={setError}
          onSuccess={async (uDid: string, mnemonic: string) => {
            let didService = await DidService.getInstance();
            const isDidPublished = await didService.isDIDPublished(uDid);
            if (!isDidPublished) {
              alertError(
                null,
                'Did is not published yet, You can only login with published DID user'
              );
            } else {
              let didDocument = await didService.getDidDocument(uDid, false);
              if (didDocument.services && didDocument.services.size > 0) {
                let hiveUrl = new DIDURL(uDid + '#HiveVault');
                if (didDocument.services.has(hiveUrl)) {
                  let service = didDocument.services.get(hiveUrl);
                  let hiveVersion = await HiveService.getHiveVersion(
                    service.serviceEndpoint
                  );
                  let isHiveValid = await HiveService.isHiveVersionSupported(
                    hiveVersion
                  );
                  if (!isHiveValid) {
                    alertError(
                      null,
                      `Hive version ${hiveVersion} not supported. The minimal supported version is ${process.env.REACT_APP_HIVE_MIN_VERSION} and maximun is ${process.env.REACT_APP_HIVE_MAX_VERSION}`
                    );
                    return;
                  }
                }
              }

              setLoading(true);
              let userService = new UserService(didService);
              const res = await userService.SearchUserWithDID(uDid);
              window.localStorage.setItem(
                `temporary_${uDid.replace('did:elastos:', '')}`,
                JSON.stringify({
                  mnemonic: mnemonic
                })
              );
              setLoading(false);

              if (res) {
                history.push({
                  pathname: '/set-password',
                  state: { ...res, isEssentialUser: false }
                });
              } else {
                history.push({
                  pathname: '/create-profile-with-did',
                  state: {
                    did: uDid,
                    mnemonic,
                    user
                  }
                });
              }
            }
          }}
        />
      </OnBoardLayoutRight>
    </OnBoardLayout>
  );
};

export default RecoverAccountPage;