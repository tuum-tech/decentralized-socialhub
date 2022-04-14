import React from 'react';
import { StaticContext, RouteComponentProps } from 'react-router';
import { useHistory } from 'react-router-dom';
import {
  DID,
  connectivity
} from '@elastosfoundation/elastos-connectivity-sdk-js';
import { EssentialsConnector } from '@elastosfoundation/essentials-connector-client-browser';

import {
  OnBoardLayout,
  OnBoardLayoutLeft,
  OnBoardLayoutLeftContent,
  OnBoardLayoutLogo,
  OnBoardLayoutRight,
  OnBoardLayoutRightContent,
  OnBoardLayoutRightContentTitle
} from 'src/components/layouts/OnBoardLayout';
import FooterLinks, {
  Footer
} from 'src/components/layouts/OnBoardLayout/FooterLinks';
import { Text16 } from 'src/elements/texts';
import { ThemeButton, ThemeTransparentButton } from 'src/elements/buttons';
import Navbar from '../components/Navbar';
import { alertError, showNotify } from 'src/utils/notify';
import { DidService } from 'src/services/did.service.new';
import { UserService } from 'src/services/user.service';

import leftBg from 'src/assets/new/auth/signin_left_bg.png';
import style from './style.module.scss';
import { LocationState } from './types';
import { HiveService } from 'src/services/hive.service';
import { DIDURL, VerifiablePresentation } from '@elastosfoundation/did-js-sdk/';
import { useSetRecoilState } from 'recoil';
import { DIDDocumentAtom } from 'src/Atoms/Atoms';

const SignInPage: React.FC<RouteComponentProps<
  {},
  StaticContext,
  LocationState
>> = props => {
  const history = useHistory();
  const setDidDocument = useSetRecoilState(DIDDocumentAtom);
  const getPresentation = async (): Promise<
    VerifiablePresentation | undefined
  > => {
    let connector: EssentialsConnector = connectivity.getActiveConnector() as EssentialsConnector;
    if (connector && connector.hasWalletConnectSession()) {
      connector.disconnectWalletConnect();
    }

    console.log('Entering on connect');
    let didAccess = new DID.DIDAccess();

    try {
      return await didAccess.requestCredentials({
        claims: [DID.simpleIdClaim('Your name', 'name', true)],
        didMustBePublished: true
      });
    } catch (error) {
      console.error(error);
    } finally {
      console.log('end of popup?');
    }

    return;
  };

  const connect = async () => {
    let presentation = await getPresentation();

    const didService = await DidService.getInstance();
    if (presentation !== null && presentation !== undefined) {
      let nameCredential = presentation!.getCredentials().find((c: any) => {
        return c.getId().getFragment() === 'name';
      });
      let name = nameCredential!.getSubject().getProperty('name');
      let owner = nameCredential!.getId().getDid();
      let did = 'did:elastos:' + owner.getMethodSpecificId();
      let mnemonic = '';

      let resolvedDocument = await owner.resolve();
      await didService.storeDocument(resolvedDocument);
      setDidDocument(resolvedDocument.toString(true));

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
    <OnBoardLayout className={style['did-signin']}>
      <Navbar navItemClicked={(item: string) => {}} />
      <OnBoardLayoutLeft
        style={{
          backgroundImage: `url(${leftBg})`
        }}
      >
        <OnBoardLayoutLogo />
        <OnBoardLayoutLeftContent></OnBoardLayoutLeftContent>
      </OnBoardLayoutLeft>

      <OnBoardLayoutRight>
        <OnBoardLayoutRightContent>
          <OnBoardLayoutRightContentTitle>
            Welcome back
          </OnBoardLayoutRightContentTitle>
          <Text16 style={{ marginBottom: '35px', maxWidth: '420px' }}>
            Don't forget to fill out as much of your profile as you can. You
            will earn badges and be set up for the future — where you can earn
            off your data, under your control!
          </Text16>
          <ThemeButton
            img="white"
            onClick={connect}
            style={{ width: '100%' }}
          />

          <OnBoardLayoutRightContentTitle style={{ marginTop: '100px' }}>
            New to Profile?
          </OnBoardLayoutRightContentTitle>
          <ThemeTransparentButton
            to="/create-profile"
            text="Create a new Profile"
          />
          <Footer>
            <FooterLinks />
          </Footer>
        </OnBoardLayoutRightContent>
      </OnBoardLayoutRight>
    </OnBoardLayout>
  );
};

export default SignInPage;
