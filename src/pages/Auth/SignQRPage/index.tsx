import React, { memo, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { DID } from '@elastosfoundation/elastos-connectivity-sdk-js';
import { incrementAction, getSimpleAjax } from './actions';
import { UserService } from 'src/services/user.service';
import { DidService } from 'src/services/did.service.new';
// import { DidService } from 'src/services/did.service';

import {
  OnBoardLayout,
  OnBoardLayoutLeft,
  OnBoardLayoutLeftContent,
  OnBoardLayoutLeftContentTitle,
  OnBoardLayoutLeftContentIntro,
  OnBoardLayoutLogo,
  OnBoardLayoutRight,
  OnBoardLayoutRightContent,
  OnBoardLayoutRightContentTitle,
  WavingHandImg
} from 'src/components/layouts/OnBoardLayout';
import { Text16 } from 'src/elements/texts';
import { SignInButton, Button } from 'src/elements/buttons';

import whitelogo from 'src/assets/logo/whitetextlogo.png';
import phone from 'src/assets/icon/phone.png';
import injector from 'src/baseplate/injectorWrap';
import { showNotify } from 'src/utils/notify';
import { makeSelectCounter, makeSelectAjaxMsg } from './selectors';
import style from './style.module.scss';
import { NameSpace } from './constants';
import reducer from './reducer';
import saga from './saga';
import { InferMappedProps, SubState } from './types';

const SignQRPage: React.FC<InferMappedProps> = ({
  eProps,
  ...props
}: InferMappedProps) => {
  /**
   * Direct method implementation without SAGA
   * This was to show you dont need to put everything to global state
   * incoming from Server API calls. Maintain a local state.
   */
  const history = useHistory();
  const didService = new DidService();
  const connect = async () => {
    let didAccess = new DID.DIDAccess();
    let presentation = await didAccess.getCredentials({
      claims: {
        name: true
      }
    });
    if (presentation) {
      let nameCredential = presentation.getCredentials().find((c: any) => {
        return c.getId().getFragment() === 'name';
      });
      let name = nameCredential.getSubject().getProperty('name');
      let issuer = nameCredential.getIssuer();
      let did = 'did:elastos:' + issuer.getMethodSpecificId();
      console.log('returned name & did : => ', name, issuer, did);
      let mnemonic = ''; // should be returned from essential??
      let didStore = await DidService.getStore();
      let didDocument = await didStore.loadDid(issuer);
      console.log('loaded did document : => ', didDocument);
      if (didDocument === null) didStore.storeDid(await issuer.resolve());
      let isDidPublished = await didService.isDIDPublished(did);
      if (isDidPublished) {
        showNotify('Did is published on mainnet', 'success');
        let userService = new UserService(didService);
        const res = await userService.SearchUserWithDID(did);
        window.localStorage.setItem(
          `temporary_${did.replace('did:elastos:', '')}`,
          JSON.stringify({
            mnemonic: mnemonic
          })
        );
        if (res) {
          history.push({
            pathname: '/set-password',
            state: res
          });
        } else {
          history.push({
            pathname: '/create-profile-with-did',
            state: {
              did: did,
              mnemonic,
              user: {
                name: name,
                loginCred: {}
              }
            }
          });
        }
      } else {
        showNotify('Did is not published on the blockchain yet', 'error');
      }
    } else {
      showNotify('Unable to get credential from essential', 'error');
    }
  };
  return (
    <OnBoardLayout className={style['qr-sign']}>
      <OnBoardLayoutLeft>
        <OnBoardLayoutLogo src={whitelogo} />
        <OnBoardLayoutLeftContent>
          <WavingHandImg src={phone} />
          <OnBoardLayoutLeftContentTitle className="mt-18px">
            elastOS Sign in
          </OnBoardLayoutLeftContentTitle>
          <OnBoardLayoutLeftContentIntro
            style={{ marginTop: '38px', marginBottom: '5px' }}
          >
            New to Profile?
          </OnBoardLayoutLeftContentIntro>
          <SignInButton width={160} to="/create-profile">
            Create a new Profile
          </SignInButton>
          <OnBoardLayoutLeftContentIntro
            style={{ marginTop: '44px', marginBottom: '5px' }}
          >
            Have secrete Mnemonic words?
          </OnBoardLayoutLeftContentIntro>
          <SignInButton width={120} to="/sign-did">
            Sign In
          </SignInButton>
        </OnBoardLayoutLeftContent>
      </OnBoardLayoutLeft>
      <OnBoardLayoutRight>
        <OnBoardLayoutRightContent>
          <OnBoardLayoutRightContentTitle>
            Connect essential with WalletConnect
          </OnBoardLayoutRightContentTitle>
          <Text16>Scan the QR code with your elastOS application</Text16>
          <div className={style['btn-wallet-connect']}>
            <Button
              type="primary"
              text="WalletConnect"
              mt={20}
              onClick={connect}
            />
          </div>
        </OnBoardLayoutRightContent>
      </OnBoardLayoutRight>
    </OnBoardLayout>
  );
};

/** @returns {object} Contains state props from selectors */
export const mapStateToProps = createStructuredSelector<SubState, SubState>({
  counter: makeSelectCounter(),
  msg: makeSelectAjaxMsg()
});

/** @returns {object} Contains dispatchable props */
export function mapDispatchToProps(dispatch: any) {
  return {
    eProps: {
      // eProps - Emitter proptypes thats binds to dispatch
      /** dispatch for counter to increment */
      onCount: (count: { counter: number }) => dispatch(incrementAction(count)),
      onSimpleAjax: () => dispatch(getSimpleAjax())
    }
  };
}

/**
 * Injects prop and saga bindings done via
 * useInjectReducer & useInjectSaga
 */
const withInjectedMode = injector(SignQRPage, {
  key: NameSpace,
  reducer,
  saga
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
  memo
)(withInjectedMode) as React.ComponentType<InferMappedProps>;

// export default Tab1;
