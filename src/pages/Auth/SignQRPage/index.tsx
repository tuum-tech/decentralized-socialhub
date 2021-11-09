import React from 'react';
import { StaticContext, RouteComponentProps } from 'react-router';
import { useHistory } from 'react-router-dom';
import { DID } from '@elastosfoundation/elastos-connectivity-sdk-js';
import { UserService } from 'src/services/user.service';
import { DidService } from 'src/services/did.service.new';

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
import { alertError, showNotify } from 'src/utils/notify';
import style from './style.module.scss';
import FooterLinks, {
  Footer
} from 'src/components/layouts/OnBoardLayout/FooterLinks';
import { HiveService } from 'src/services/hive.service';
import { DIDURL } from '@elastosfoundation/did-js-sdk/';

const SignQRPage: React.FC<RouteComponentProps<{}, StaticContext>> = props => {
  /**
   * Direct method implementation without SAGA
   * This was to show you dont need to put everything to global state
   * incoming from Server API calls. Maintain a local state.
   */
  const history = useHistory();

  const connect = async () => {
    const didService = await DidService.getInstance();
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
      let mnemonic = '';
      await didService.storeDocument(await issuer.resolve());
      let isDidPublished = await didService.isDIDPublished(did);
      if (isDidPublished) {
        let didDocument = await didService.getDidDocument(did, false);
        if (didDocument.services && didDocument.services.size > 0) {
          let hiveUrl = new DIDURL(did + '#HiveVault');
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
            state: { ...res, isEssentialUser: true }
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
          <Footer>
            <FooterLinks></FooterLinks>
          </Footer>
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

export default SignQRPage;
