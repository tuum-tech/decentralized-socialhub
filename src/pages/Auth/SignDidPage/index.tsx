import { StaticContext, RouteComponentProps } from 'react-router';
import { useHistory } from 'react-router-dom';

import { UserService } from 'src/services/user.service';
import { DidService } from 'src/services/did.service.new';
import { alertError } from 'src/utils/notify';
import {
  OnBoardLayout,
  OnBoardLayoutRight
} from 'src/components/layouts/OnBoardLayout';
import LoadingIndicator from 'src/elements/LoadingIndicator';
import DidSignForm from '../components/DidSign/DidSignForm';
import DidLeftSide from '../components/DidSign/DidLeftSide';
import PassPhraseHelp from '../components/DidSign/PassPhraseHelp';

import React, { useState, useEffect } from 'react';
import style from './style.module.scss';
import { UserType, LocationState } from './types';
import { DIDURL } from '@elastosfoundation/did-js-sdk/';
import { HiveService } from 'src/services/hive.service';

const SignDidPage: React.FC<RouteComponentProps<
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
      <DidLeftSide error={error} />
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

export default SignDidPage;
