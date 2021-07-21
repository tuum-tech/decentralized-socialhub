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

  let didService = new DidService();

  return (
    <OnBoardLayout className={style['did-signin']}>
      {loading && <LoadingIndicator loadingText="Signing Now..." />}
      {showHelp && <PassPhraseHelp close={() => setShowHelp(false)} />}
      <DidLeftSide error={error} />
      <OnBoardLayoutRight>
        <DidSignForm
          showModal={() => setShowHelp(true)}
          loadDidFunction={didService.loadDid}
          error={error}
          setError={setError}
          onSuccess={async (uDid: string, mnemonic: string) => {
            const isDidPublished = await didService.isDIDPublished(uDid);
            if (!isDidPublished) {
              alertError(
                null,
                'Did is not published yet, You can only login with published DID user'
              );
            } else {
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
                  state: res
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
